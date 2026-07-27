<p align="center">
  <img src="https://raw.githubusercontent.com/berkansezer77/presto/main/docs/images/logo.png" width="120" alt="Presto">
</p>
<h1 align="center">Presto</h1>
<p align="center">
  A visual automation editor for Zigbee buttons, dials and remotes in Home Assistant.<br>
  No cloud, no AI, no helper entities — just pick a device, drop actions on it, done.
</p>
<p align="center">
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg" alt="HACS"></a>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.11%2B-41BDF5.svg" alt="Home Assistant">
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/berkansezer77/presto/main/docs/images/editor.png" width="880" alt="Presto editor">
</p>

## What is it?

**Presto** turns any Zigbee button device — a Philips Hue Tap Dial, a Hue Dimmer Switch,
or any Zigbee2MQTT / deCONZ remote — into a point-and-click automation surface inside
Home Assistant.

Pick a device from the sidebar, add a **mode**, and assign what each button press and
each dial turn should do. Drag your room lights and light groups straight onto a mode.
Everything Presto produces is a **real Home Assistant automation** — it keeps running
even when the panel is closed. There is no cloud service, no AI, and you never have to
create `input_boolean` / `input_select` helpers by hand.

## Features

<p align="center">
  <img src="https://raw.githubusercontent.com/berkansezer77/presto/main/docs/images/dial.png" width="560" alt="Buttons and dial">
</p>

- **Any Zigbee controller** — auto-detects Hue Tap Dial, Hue Dimmer Switch, and generic
  Zigbee2MQTT / deCONZ button devices. Detection is language-independent, so it works no
  matter what you named your entities.
- **Four buttons + the dial, visually** — each button gets single / long / double-press
  slots; the dial can drive brightness, volume, color temperature or temperature.
- **Modes (layers)** — give one physical device two behaviours and switch between them
  with a button. Presto keeps the active mode in its own entity — **no helper needed**.
- **Double-press without hardware support** — Zigbee Tap Dials have no native double-press;
  Presto emulates it inside the automation with a timed wait. Optional, per-button tunable.
- **Multiple actions per press & multiple scenes** — fire a scene *and* toggle a group on
  the same press.
- **"Only affect lights that are on"** — the dial can adjust just the lights currently lit.
- **Per-mode indicator** — flash a chosen light in a chosen colour when the mode changes.
- **Backups** — snapshot your whole configuration, restore it, or download it to your
  computer as a JSON file.
- **Built-in validation** — Presto checks every assignment before writing it to HA, so a
  `light.turn_on` pointed at a `switch` never silently does nothing.
- **English & Turkish** — switch the interface language from the top-right corner.

## Installation

### HACS (recommended)

1. In HACS, open the three-dot menu → **Custom repositories**.
2. Add `https://github.com/berkansezer77/presto` with category **Integration**.
3. Search for **Presto**, install it, and restart Home Assistant.
4. Go to **Settings → Devices & Services → Add Integration → Presto**.

### Manual

1. Copy `custom_components/dial_tap` into your Home Assistant `config/custom_components/`
   folder.
2. Restart Home Assistant.
3. Add the **Presto** integration from **Settings → Devices & Services**.

After setup, open **Presto** from the sidebar and start assigning buttons.

## How it works

Presto is the place where you *define* automations; Home Assistant is the engine that
*runs* them. When you press **Install Automations**, Presto writes standard HA automations
(tagged so they stay grouped) via the automation config API. Nothing runs through Presto
at runtime — if you disable the panel, your buttons keep working.

## Requirements

- Home Assistant 2024.11 or newer.
- A Zigbee button device exposed to Home Assistant through **Zigbee2MQTT**, **deCONZ**, or
  the **Philips Hue** integration.

## Contributing

Issues and pull requests are welcome. If your controller isn't detected, open an issue
with the device model and how it's connected (Z2M / deCONZ / Hue).

## License

[MIT](LICENSE) © 2026 Berkan Sezer
