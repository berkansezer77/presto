"""Dial Tap mod seçicileri.

Her Tap Dial cihazı için bir `select` entity'si üretilir. Aktif mod burada
yaşar — kullanıcıdan input_select/input_boolean gibi yardımcı (helper)
kurması İSTENMEZ, entegrasyon kendi entity'sini oluşturur.

Otomasyonlar bu entity'yi iki şekilde kullanır:
  * koşul  -> {"condition": "state", "entity_id": "select.x", "state": "Işıklar"}
  * aksiyon-> {"action": "select.select_option", ...} / "select.select_next"
"""
from __future__ import annotations

import logging
import re

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import DOMAIN, SIGNAL_CONFIG

_LOGGER = logging.getLogger(__name__)

FALLBACK_OPTION = "—"


def _slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "_", str(text or "").lower()).strip("_")
    return s or "cihaz"


def _devices_from(cfg: dict) -> dict:
    """cfg['devices'] -> {key: device dict}. Bozuk kayıtları sessizce atla."""
    devices = cfg.get("devices") if isinstance(cfg, dict) else None
    if not isinstance(devices, dict):
        return {}
    return {k: v for k, v in devices.items() if isinstance(v, dict)}


def _mode_names(device: dict) -> list[str]:
    modes = device.get("modes")
    if not isinstance(modes, list):
        return []
    out: list[str] = []
    for m in modes:
        if not isinstance(m, dict):
            continue
        name = str(m.get("name") or "").strip()
        # Aynı ada sahip iki mod HA'da seçilemez hale gelir — tekilleştir.
        if name and name not in out:
            out.append(name)
    return out


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Kayıtlı cihazlar için mod seçicilerini kur ve panel değişikliklerini dinle."""
    store = hass.data[DOMAIN]["store"]
    known: dict[str, DialTapModeSelect] = {}
    hass.data[DOMAIN]["mode_selects"] = known

    async def _sync() -> None:
        cfg = await store.async_load() or {}
        devices = _devices_from(cfg)

        new_entities: list[DialTapModeSelect] = []
        for key, dev in devices.items():
            names = _mode_names(dev)
            if not names:
                # Modu olmayan cihaz için seçici üretmenin anlamı yok.
                continue
            ent = known.get(key)
            if ent is None:
                ent = DialTapModeSelect(key, dev, names)
                known[key] = ent
                new_entities.append(ent)
            else:
                ent.update_from_config(dev, names)

        # Panelden silinen cihazların seçicisi boşa düşer; kaldıramayız ama
        # yanlış seçenek göstermesin diye tek seçeneğe indiririz.
        for key, ent in known.items():
            if key not in devices:
                ent.update_from_config({"name": ent.device_name}, [])

        if new_entities:
            async_add_entities(new_entities)

    await _sync()

    @callback
    def _on_config_change() -> None:
        hass.async_create_task(_sync())

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_CONFIG, _on_config_change)
    )


class DialTapModeSelect(SelectEntity, RestoreEntity):
    """Bir Tap Dial'ın aktif modu."""

    _attr_should_poll = False
    _attr_icon = "mdi:knob"
    _attr_has_entity_name = False

    def __init__(self, key: str, device: dict, options: list[str]) -> None:
        self._key = key
        self.device_name = str(device.get("name") or key)
        self._attr_unique_id = f"{DOMAIN}_mode_{_slug(key)}"
        self._attr_name = f"{self.device_name} Mod"
        self._attr_options = list(options) or [FALLBACK_OPTION]
        self._attr_current_option = self._attr_options[0]

    async def async_added_to_hass(self) -> None:
        """Yeniden başlatmada son seçili mod geri gelsin."""
        await super().async_added_to_hass()
        last = await self.async_get_last_state()
        if last and last.state in self._attr_options:
            self._attr_current_option = last.state

    @property
    def extra_state_attributes(self) -> dict:
        return {"dial_tap_key": self._key}

    @callback
    def update_from_config(self, device: dict, options: list[str]) -> None:
        """Panel modları/cihaz adı değiştiğinde tazele."""
        new_name = str(device.get("name") or self.device_name)
        name_changed = new_name != self.device_name
        self.device_name = new_name
        self._attr_name = f"{self.device_name} Mod"
        new_options = list(options) or [FALLBACK_OPTION]
        if new_options == self._attr_options:
            # Seçenekler aynı ama SADECE ad değişmiş olabilir — o zaman da state yaz,
            # yoksa yeni ad canlıya yansımaz.
            if name_changed and self.hass is not None:
                self.async_write_ha_state()
            return
        self._attr_options = new_options
        # Seçili mod silindiyse ilk moda düş — aksi halde entity geçersiz duruma girer.
        if self._attr_current_option not in new_options:
            self._attr_current_option = new_options[0]
        if self.hass is not None:
            self.async_write_ha_state()

    async def async_select_option(self, option: str) -> None:
        if option not in self._attr_options:
            raise ValueError(
                f"{option} geçerli bir mod değil. Seçenekler: {self._attr_options}"
            )
        self._attr_current_option = option
        self.async_write_ha_state()
