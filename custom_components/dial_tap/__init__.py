"""The Presto integration.

Zigbee buton / dial / kumanda cihazları için otomasyon merkezi. Kenar
çubuğuna "Presto" paneli ekler: ev haritası (odalar + bölümler + cihazlar)
ve tuş/dial atamaları orada yapılır.

Panel = tanım yeri, HA = çalıştıran motor. Üretilen her şey HA'nın kendi
otomasyon motoruna yazılır; panel kapalıyken de çalışır.
İnternet ve AI bağımlılığı YOKTUR.
"""
from __future__ import annotations

import json
import logging
import os

from homeassistant.components import panel_custom
from homeassistant.components.http import HomeAssistantView, StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .const import DOMAIN, FRONTEND_URL_BASE, FRONTEND_VERSION, PLATFORMS, SIGNAL_CONFIG

_LOGGER = logging.getLogger(__name__)


# Config .storage'a yazılır ve 30 yedeğe kopyalanabilir — abartılı boyutları reddet.
MAX_CONFIG_BYTES = 512 * 1024


def _validate_config(body):
    """Panelden/dosyadan gelen yapılandırmayı kabaca doğrula.

    Frontend doğrulaması bir güvenlik sınırı DEĞİLDİR; burası son savunma hattı.
    Hata varsa açıklama metni, yoksa None döndürür.
    """
    if not isinstance(body, dict):
        return "Config bir nesne (obje) olmalı."
    try:
        size = len(json.dumps(body))
    except (TypeError, ValueError):
        return "Config JSON'a çevrilemiyor."
    if size > MAX_CONFIG_BYTES:
        return f"Config çok büyük ({size} bayt, sınır {MAX_CONFIG_BYTES})."
    for key, typ in (("devices", dict), ("rooms", dict), ("manual_devices", list)):
        if key in body and not isinstance(body[key], typ):
            return f"'{key}' alanı geçersiz tipte."
    devices = body.get("devices")
    if isinstance(devices, dict):
        if len(devices) > 200:
            return "Çok fazla cihaz."
        for k, dev in devices.items():
            if not isinstance(dev, dict):
                return f"Cihaz '{k}' bir nesne olmalı."
            modes = dev.get("modes")
            if modes is not None and not isinstance(modes, list):
                return f"Cihaz '{k}' modes bir liste olmalı."
    return None


def _admin_guard(view, request):
    """Sadece admin kullanıcılar config/yedekleri okuyup yazabilir.

    Panel, HA otomasyonlarını üretip .storage'a yazdığı için normal (admin
    olmayan) kullanıcıya kapalı olmalı. Admin değilse 403 döndürür, yetkiliyse
    None döndürür.
    """
    user = request.get("hass_user")
    if user is None or not getattr(user, "is_admin", False):
        return view.json_message("Admin required", status_code=403)
    return None

# Panel yapılandırması (odalar, bölümler, cihazlar, modlar) burada yaşar:
# .storage/dial_tap_config
STORE_VERSION = 1
STORE_KEY = "dial_tap_config"

# Yedekler ayrı dosyada: .storage/dial_tap_backups  (config'i şişirmesin)
STORE_KEY_BACKUP = "dial_tap_backups"
MAX_BACKUPS = 30


class DialTapConfigView(HomeAssistantView):
    """Panelin yönettiği yapılandırmayı oku/yaz (JSON, oturum gerekir)."""

    url = "/api/dial_tap/config"
    name = "api:dial_tap:config"
    requires_auth = True

    def __init__(self, hass: HomeAssistant, store: Store) -> None:
        self._hass = hass
        self._store = store

    async def get(self, request):
        if (deny := _admin_guard(self, request)) is not None:
            return deny
        data = await self._store.async_load()
        return self.json(data or {})

    async def post(self, request):
        if (deny := _admin_guard(self, request)) is not None:
            return deny
        try:
            body = await request.json()
        except ValueError:
            return self.json_message("Invalid JSON", status_code=400)
        if not isinstance(body, dict):
            return self.json_message("Expected an object", status_code=400)
        if (err := _validate_config(body)) is not None:
            return self.json_message(err, status_code=400)
        await self._store.async_save(body)
        # Modlar değişmiş olabilir -> select entity'leri kendini yenilesin.
        async_dispatcher_send(self._hass, SIGNAL_CONFIG)
        return self.json({"ok": True})


class DialTapBackupView(HomeAssistantView):
    """Panel yapılandırmasının yedekleri: al / listele / geri yükle / sil.

    Yedekler ayrı dosyada (.storage/dial_tap_backups). Config = tek gerçek
    kaynak; HA otomasyonları silinse bile buradan geri yüklenip "Kur" ile
    yeniden üretilebilir. Kullanıcı manuel yedek alır, gerekince geri yükler.
    """

    url = "/api/dial_tap/backups"
    name = "api:dial_tap:backups"
    requires_auth = True

    def __init__(self, hass: HomeAssistant, store: Store, backup_store: Store) -> None:
        self._hass = hass
        self._store = store
        self._bstore = backup_store

    async def _load(self) -> list:
        data = await self._bstore.async_load()
        items = (data or {}).get("items")
        return items if isinstance(items, list) else []

    def _ozet(self, snaps: list) -> list:
        """Config'i döndürmeden hafif liste (id, zaman, not, cihaz sayısı)."""
        out = []
        for s in snaps:
            devs = (s.get("config") or {}).get("devices") or {}
            out.append({"id": s.get("id"), "ts": s.get("ts"),
                        "note": s.get("note", ""), "devices": len(devs)})
        return out

    async def get(self, request):
        if (deny := _admin_guard(self, request)) is not None:
            return deny
        return self.json({"items": self._ozet(await self._load())})

    async def post(self, request):
        if (deny := _admin_guard(self, request)) is not None:
            return deny
        from homeassistant.util import dt as dt_util
        try:
            body = await request.json()
        except ValueError:
            return self.json_message("Invalid JSON", status_code=400)
        action = body.get("action")
        snaps = await self._load()

        if action == "create":
            cfg = await self._store.async_load() or {}
            snap = {
                "id": dt_util.utcnow().strftime("%Y%m%d%H%M%S%f"),
                "ts": dt_util.utcnow().isoformat(),
                "note": str(body.get("note", ""))[:120],
                "config": cfg,
            }
            snaps.insert(0, snap)
            del snaps[MAX_BACKUPS:]           # en yeni MAX_BACKUPS tanesi kalsın
            await self._bstore.async_save({"items": snaps})
            return self.json({"ok": True, "id": snap["id"], "items": self._ozet(snaps)})

        if action == "restore":
            snap = next((s for s in snaps if s.get("id") == body.get("id")), None)
            if not snap:
                return self.json_message("Yedek bulunamadı", status_code=404)
            await self._store.async_save(snap.get("config") or {})
            async_dispatcher_send(self._hass, SIGNAL_CONFIG)
            return self.json({"ok": True})

        if action == "delete":
            snaps = [s for s in snaps if s.get("id") != body.get("id")]
            await self._bstore.async_save({"items": snaps})
            return self.json({"ok": True, "items": self._ozet(snaps)})

        if action == "export":
            # bir yedeğin TAM config'i (bilgisayara indirme için)
            snap = next((s for s in snaps if s.get("id") == body.get("id")), None)
            if not snap:
                return self.json_message("Yedek bulunamadı", status_code=404)
            return self.json({"config": snap.get("config") or {}})

        if action == "import":
            # bilgisayardan yüklenen config'i doğrudan uygula
            cfg = body.get("config")
            if not isinstance(cfg, dict):
                return self.json_message("Geçersiz yedek dosyası", status_code=400)
            if (err := _validate_config(cfg)) is not None:
                return self.json_message(err, status_code=400)
            await self._store.async_save(cfg)
            async_dispatcher_send(self._hass, SIGNAL_CONFIG)
            return self.json({"ok": True})

        return self.json_message("Bilinmeyen işlem", status_code=400)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Dial Tap from a config entry."""
    domain_data = hass.data.setdefault(DOMAIN, {})

    store = domain_data.get("store")
    if store is None:
        store = Store(hass, STORE_VERSION, STORE_KEY)
        domain_data["store"] = store

    backup_store = domain_data.get("backup_store")
    if backup_store is None:
        backup_store = Store(hass, STORE_VERSION, STORE_KEY_BACKUP)
        domain_data["backup_store"] = backup_store

    if not domain_data.get("frontend_registered"):
        frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
        await hass.http.async_register_static_paths(
            [StaticPathConfig(FRONTEND_URL_BASE, frontend_dir, False)]
        )
        hass.http.register_view(DialTapConfigView(hass, store))
        hass.http.register_view(DialTapBackupView(hass, store, backup_store))

        try:
            await panel_custom.async_register_panel(
                hass,
                frontend_url_path="presto",
                webcomponent_name="presto-panel",
                module_url=f"{FRONTEND_URL_BASE}/presto-panel-{FRONTEND_VERSION}.js",
                sidebar_title="Presto",
                sidebar_icon="mdi:knob",
                require_admin=True,
            )
        except ValueError:
            # Zaten kayıtlı (ör. entry reload) — sorun değil.
            pass

        domain_data["frontend_registered"] = True

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry. Panel ve statik dosyalar kalır (zararsız)."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
