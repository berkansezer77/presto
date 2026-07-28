"""Dial Tap ses seviyesi takipçileri.

NEDEN VAR: bazı medya cihazları (Alexa/Echo, tabletler, bazı cast cihazları)
`volume_up`/`volume_down` desteklemez, sadece `volume_set` kabul eder. Onlarda
sesi artırmak için "şu anki sesi oku, üstüne ekle, yaz" gerekir — ama bu
cihazlar sesi HA'ya ANLIK bildirmez (Alexa periyodik yoklar). Dial'ı hızlı
çevirince komutların hepsi aynı bayat değeri okur ve ses tek adım sonra takılır.

Çözüm: sesi cihazdan okumayı bırakıp burada tutmak. Bu entity bize ait olduğu
için değeri anında güncellenir, düzgün birikir. Dial önce burayı değiştirir,
hemen ardından bu değer cihaza yazılır.

Kullanıcıdan yardımcı (helper) kurması İSTENMEZ.
"""
from __future__ import annotations

import logging
import re

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import DOMAIN, SIGNAL_CONFIG

_LOGGER = logging.getLogger(__name__)

DEFAULT_VOLUME = 30.0


def _slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "_", str(text or "").lower()).strip("_")
    return s or "cihaz"


def _needs_volume(device: dict) -> bool:
    """Bu cihazın herhangi bir modunda dial sesi mi kontrol ediyor?"""
    modes = device.get("modes")
    if not isinstance(modes, list):
        return False
    for m in modes:
        if not isinstance(m, dict):
            continue
        dial = m.get("dial")
        if isinstance(dial, dict) and dial.get("kind") == "volume":
            return True
    return False


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Ses takipçilerini kur ve panel değişikliklerini dinle."""
    store = hass.data[DOMAIN]["store"]
    known: dict[str, DialTapVolume] = {}
    hass.data[DOMAIN]["volume_numbers"] = known

    async def _sync() -> None:
        cfg = await store.async_load() or {}
        devices = cfg.get("devices")
        if not isinstance(devices, dict):
            devices = {}

        new_entities: list[DialTapVolume] = []
        for key, dev in devices.items():
            if not isinstance(dev, dict) or not _needs_volume(dev):
                continue
            ent = known.get(key)
            if ent is None:
                ent = DialTapVolume(key, dev)
                known[key] = ent
                new_entities.append(ent)
            else:
                ent.update_from_config(dev)

        if new_entities:
            async_add_entities(new_entities)

        # Artık ses kullanmayan (dial'ı volume'dan çıkarılmış ya da silinmiş) cihazların
        # takip entity'si öksüz kalmasın — "kullanılamıyor" olarak işaretle.
        need = {
            k for k, dev in devices.items()
            if isinstance(dev, dict) and _needs_volume(dev)
        }
        for key, ent in known.items():
            ent.set_available(key in need)

    await _sync()

    @callback
    def _on_config_change() -> None:
        hass.async_create_task(_sync())

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_CONFIG, _on_config_change)
    )


class DialTapVolume(NumberEntity, RestoreEntity):
    """Bir Tap Dial'ın hedeflediği sesin takip edilen seviyesi (%)."""

    _attr_should_poll = False
    _attr_available = True
    _attr_icon = "mdi:volume-high"
    _attr_native_min_value = 0
    _attr_native_max_value = 100
    _attr_native_step = 1
    _attr_native_unit_of_measurement = "%"
    _attr_mode = NumberMode.SLIDER
    _attr_has_entity_name = False

    def __init__(self, key: str, device: dict) -> None:
        self._key = key
        self.device_name = str(device.get("name") or key)
        self._attr_unique_id = f"{DOMAIN}_volume_{_slug(key)}"
        self._attr_name = f"{self.device_name} Ses"
        self._attr_native_value = DEFAULT_VOLUME

    async def async_added_to_hass(self) -> None:
        """Yeniden başlatmada son değer geri gelsin."""
        await super().async_added_to_hass()
        last = await self.async_get_last_state()
        if last and last.state not in (None, "", "unknown", "unavailable"):
            try:
                self._attr_native_value = min(100.0, max(0.0, float(last.state)))
            except (TypeError, ValueError):
                pass

    @property
    def extra_state_attributes(self) -> dict:
        return {"dial_tap_key": self._key}

    @callback
    def update_from_config(self, device: dict) -> None:
        """Cihaz adı değişirse entity adını tazele."""
        yeni = str(device.get("name") or self.device_name)
        if yeni == self.device_name:
            return
        self.device_name = yeni
        self._attr_name = f"{yeni} Ses"
        if self.hass is not None:
            self.async_write_ha_state()

    @callback
    def set_available(self, ok: bool) -> None:
        """Cihaz artık ses kullanmıyorsa entity'yi kullanılamaz yap (öksüz kalmasın)."""
        if ok == self._attr_available:
            return
        self._attr_available = ok
        if self.hass is not None:
            self.async_write_ha_state()

    async def async_set_native_value(self, value: float) -> None:
        self._attr_native_value = min(100.0, max(0.0, float(value)))
        self.async_write_ha_state()
