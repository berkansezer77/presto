/* Presto Paneli — Zigbee buton/dial/kumanda otomasyon merkezi.
   Ev haritasi (odalar + bolumler + cihazlar) Otomasyon panelinden gelir;
   AI/bulut bagimliligi YOKTUR — her sey elle kurulur.
   Uretilen her sey HA'nin kendi otomasyon motoruna yazilir. */

const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};
const icon = (mdi, cls) => {
  const i = document.createElement("ha-icon");
  i.setAttribute("icon", mdi);
  if (cls) i.className = cls;
  return i;
};
const uid = () => Math.random().toString(36).slice(2, 9);

/* ============================================ DİL (TR / EN)
   Kaynak metinler Türkçe. İngilizce seçiliyse, ekran çizildikten SONRA
   shadow DOM'daki metinler bu sözlükten çevrilir (kaynak koda dokunulmaz;
   sözlükte olmayan metin Türkçe kalır — hiçbir şey kırılmaz). */
const DT_EN = {
  "ışık": "light",
  "priz/anahtar": "socket/switch",
  "iklim": "climate",
  "fan": "fan",
  "medya": "media",
  "perde": "blinds",
  "kilit": "lock",
  "alarm": "alarm",
  "süpürge": "vacuum",
  "nem": "humidity",
  "kamera": "camera",
  "sensör": "sensor",
  "yardımcı": "helper",
  "sahne": "scene",
  "Işıklar": "Lights",
  "Işık Grupları": "Light Groups",
  "Priz & Anahtar": "Sockets & Switches",
  "İklim": "Climate",
  "Medya": "Media",
  "Perde & Panjur": "Blinds & Shutters",
  "Güvenlik": "Security",
  "Temizlik": "Cleaning",
  "Varlık & Temas": "Presence & Contact",
  "Ölçümler": "Measurements",
  "Yardımcılar": "Helpers",
  "Sahneler": "Scenes",
  "Diğer": "Other",
  "— boş —": "— empty —",
  "Sahne çalıştır": "Run scene",
  "Aç / kapat (toggle)": "On / off (toggle)",
  "Aç": "Turn on",
  "Kapat": "Close",
  "Medya kontrol": "Media control",
  "Mod değiştir (diğer moda geç)": "Switch mode (go to other mode)",
  "Belirli moda geç": "Go to a specific mode",
  "Script çalıştır": "Run script",
  "Servis çağır (gelişmiş)": "Call service (advanced)",
  "Cihazlar": "Devices",
  "Oynatıcı": "Player",
  "Script": "Script",
  "Hedef (boş bırakılabilir)": "Target (can be left empty)",
  "Parlaklık": "Brightness",
  "Ses": "Volume",
  "Renk sıcaklığı": "Color temperature",
  "Sıcaklık": "Temperature",
  "Oynat / duraklat": "Play / pause",
  "Sonraki": "Next",
  "Önceki": "Previous",
  "Durdur": "Stop",
  "Açık": "On",
  "Kapalı": "Off",
  "Çalışıyor": "Running",
  "Boşta": "Idle",
  "Isıtma": "Heating",
  "Soğutma": "Cooling",
  "Otomatik": "Auto",
  "Nem alma": "Dry",
  "Oto": "Auto",
  "Oynatıyor": "Playing",
  "Kilitli": "Locked",
  "Devre dışı": "Disarmed",
  "Evde kurulu": "Armed home",
  "Dışarıda kurulu": "Armed away",
  "Gece kurulu": "Armed night",
  "Tatil kurulu": "Armed vacation",
  "Kuruluyor": "Arming",
  "Bekliyor": "Pending",
  "ALARM!": "ALARM!",
  "Kapatılıyor": "Disarming",
  "Temizliyor": "Cleaning",
  "Yuvada": "Docked",
  "Hazır": "Ready",
  "Hareket!": "Motion!",
  "Varlık!": "Presence!",
  "SU!": "WATER!",
  "DUMAN!": "SMOKE!",
  "GAZ!": "GAS!",
  "Titreşim": "Vibration",
  "Sakin": "Calm",
  "Boş": "Clear",
  "Kuru": "Dry",
  "Temiz": "Clear",
  "Aktif": "Active",
  "Pasif": "Inactive",
  "Cihaz listesi güncellendi": "Device list updated",
  "Kaydedildi": "Saved",
  "Kaydedilemedi": "Could not save",
  "Akıllı Ev · Presto": "Smart Home · Presto",
  "Zigbee butonların, dial'ların ve kumandaların burada yaşar. Soldan cihazını seç, <b>mod</b> aç, tuşlara ve dial'a ne yapacaklarını ata. Odalardaki ışıkları ve <b>ışık gruplarını</b> sürükleyip moda bırakabilirsin. Üretilen her şey gerçek HA otomasyonu olur — panel kapalıyken de çalışır. İnternet yok, bulut yok, yardımcı (helper) kurmana gerek yok.": "Your Zigbee buttons, dials and remotes live here. Pick a device on the left, add a <b>mode</b>, and assign what each button and the dial should do. Drag room lights and <b>light groups</b> onto a mode. Everything it produces becomes a real HA automation — it runs even when the panel is closed. No internet, no cloud, no helper entities to set up.",
  "Cihaz / Sensör Ekle": "Add Device / Sensor",
  "Cihaz Seç": "Select Device",
  "Bu izleme odasına eklenecek cihazları seç — durumları burada görünür": "Choose the devices to add to this monitoring room — their states appear here",
  "Tüm odalardan istediğin kadar cihaz seç — otomasyonda kullanılacak": "Select as many devices as you want from all rooms — they'll be used in the automation",
  "Cihaz ara…": "Search device…",
  "Tamam": "OK",
  "Genel": "General",
  "Odalar-arası otomasyonlar": "Cross-room automations",
  "Seçili cihazlar": "Selected devices",
  "Farklı odalardan cihaz seç; hepsi burada toplanır, sonra aşağıya otomasyonu yaz. (Cihazlar odaların içinde durur, burada tekrar listelenmez.)": "Pick devices from different rooms; they all gather here, then write your automation below. (Devices stay inside their rooms, they aren't re-listed here.)",
  "Henüz cihaz seçilmedi.": "No devices selected yet.",
  "Çıkar": "Remove",
  "Cihaz seç (tüm odalar)": "Select device (all rooms)",
  "Kategoriyi sil (otomasyonlar Genel'e döner)": "Delete category (automations return to General)",
  "Genel Otomasyonlar": "General Automations",
  "Scriptler": "Scripts",
  "Oda bulunamadı.": "Room not found.",
  "İzleme odası · panele özel (HA area değil)": "Monitoring room · panel-only (not an HA area)",
  "Yeniden adlandır": "Rename",
  "Yeni ad:": "New name:",
  "Odayı sil": "Delete room",
  "İzlenen cihazlar": "Monitored devices",
  "Eklediğin cihazların/sensörlerin canlı durumu burada görünür. HA odalarına (area) dokunulmaz. Aşağıya yazarsan bu cihazlarla otomasyon kurulur.": "The live state of the devices/sensors you add appears here. HA areas are untouched. If you write below, an automation is built with these devices.",
  "Henüz cihaz eklenmedi — aşağıdan ekle.": "No devices added yet — add below.",
  "İzlemeden çıkar": "Remove from monitoring",
  "Cihaz / sensör ekle": "Add device / sensor",
  "Otomasyonlar": "Automations",
  "Seçimi kaldır": "Deselect",
  "Seç — bir tuşa atarken kullanılır": "Select — used when assigning to a button",
  "✓ seçildi — editörde tuşa atayabilirsin": "✓ selected — you can assign it to a button in the editor",
  "Script — dokun → seç, ya da ▶ ile çalıştır": "Script — tap → select, or run with ▶",
  "Şimdi çalıştır": "Run now",
  "Çalıştırıldı: ": "Ran: ",
  "Çalıştırılamadı": "Could not run",
  "HA script editöründe aç": "Open in HA script editor",
  "Sil": "Delete",
  "Script silindi": "Script deleted",
  "Silinemedi (YAML'da elle tanımlı olabilir)": "Could not delete (may be defined manually in YAML)",
  "Mod ekle": "Add mode",
  "Tap Dial bulunamadı.": "No Tap Dial found.",
  "Dimmer / Anahtar": "Dimmer / Switch",
  "Odalar": "Rooms",
  "HA'da alan (oda) bulunamadı.": "No areas (rooms) found in HA.",
  "Manuel cihazı kaldır": "Remove manual device",
  "İzleme odası adı (ör. Sensörlerim):": "Monitoring room name (e.g. My Sensors):",
  "Oda seç — cihazlar burada görünecek.": "Select a room — devices will appear here.",
  "Cihaz listesini yenile (yeni eklenenler gelsin)": "Refresh device list (bring in newly added ones)",
  "Yenilendi": "Refreshed",
  "Otomasyon": "Automation",
  "Bölüm": "Section",
  "Bu odada ara… (isim ya da entity_id, ör. binary_sensor.genel)": "Search in this room… (name or entity_id, e.g. binary_sensor.genel)",
  "Bölümsüz": "Unsectioned",
  "Tüm cihazlar bölümlere dağıtıldı. ✓ (Bölümden çıkarmak için chip'i buraya sürükle.)": "All devices are distributed into sections. ✓ (Drag a chip here to remove it from a section.)",
  "Bölümü sil (cihazlar bölümsüze döner)": "Delete section (devices return to unsectioned)",
  "Bölüm silindi": "Section deleted",
  "Bölüm adı (ör. TV)": "Section name (e.g. TV)",
  "Bilgi / kontrol (HA)": "Info / control (HA)",
  "Bölüme taşı": "Move to section",
  "Bölümden çıkarıldı": "Removed from section",
  "Bölümsüze al": "Move to unsectioned",
  "Önce sağ üstten “+ Bölüm” ekle": "First add a section from the top right “+ Section”",
  "Kategoriye taşı": "Move to category",
  "Genel'e al": "Move to General",
  "Yeni kategori…": "New category…",
  "Kategori aç ve bu otomasyonu taşı": "Create category and move this automation",
  "Seç": "Select",
  "Değiştir": "Change",
  "Duraklat (HA'dan kaldırılır, tanım kalır)": "Pause (removed from HA, definition kept)",
  "Sürdür": "Resume",
  "Duraklatıldı": "Paused",
  "HA'ya yazılamadı": "Could not write to HA",
  "Düzenle": "Edit",
  "HA otomasyon editöründe aç (ham YAML)": "Open in HA automation editor (raw YAML)",
  "Otomasyon silindi": "Automation deleted",
  "Manuel cihaz ekle": "Add manual device",
  "— Cihaz seç —": "— Select device —",
  "İptal": "Cancel",
  "Ekle": "Add",
  "Önce bir cihaz seç.": "Select a device first.",
  "Tetikler çekiliyor…": "Fetching triggers…",
  "Tetik alınamadı: ": "Could not get triggers: ",
  "Manuel cihaz": "Manual device",
  "çift bas": "double press",
  "uzun bas": "long press",
  "tek bas": "single press",
  "Servis alanı boş.": "Service field is empty.",
  "Sahne seçilmemiş.": "No scene selected.",
  "Hedef cihaz seçilmemiş.": "No target device selected.",
  "Oynatıcı seçilmemiş.": "No player selected.",
  "Script seçilmemiş.": "No script selected.",
  "Bu cihaz artık bulunamıyor. HA'dan kaldırılmış olabilir.": "This device can no longer be found. It may have been removed from HA.",
  "Yedekler": "Backups",
  "Tuş Testi": "Button Test",
  "Otomasyonları Kur": "Install Automations",
  "ÇALIŞMA YERİ": "WHERE IT RUNS",
  "HA otomasyonu": "HA automation",
  "HA'nın Otomasyonlar bölümüne yazılır; trace görünür": "Written to HA's Automations section; trace is visible",
  "Panel dinler ve çalıştırır; HA'ya otomasyon yazılmaz": "The panel listens and runs it; no automation is written to HA",
  "Tümünü temizle": "Clear all",
  "Havuzu boşalt (tuşlara/dial'a atadıkların KALIR)": "Empty the pool (what you assigned to buttons/dial STAYS)",
  "Havuzdan çıkar": "Remove from pool",
  "Kurulmadı — önce şunları düzelt": "Not installed — fix these first",
  "Kuruldu — bilmen gerekenler": "Installed — things you should know",
  "düzelt →": "fix →",
  "MODLAR": "MODES",
  "Mod": "Mode",
  "Bu moda geç (cihaza dokunmadan)": "Switch to this mode (without touching the device)",
  "Modu sil": "Delete mode",
  "Gelişmiş ayarlar": "Advanced settings",
  "Mod entity'si otomasyonları kurunca oluşur.": "The mode entity is created once you install the automations.",
  "Soldan bir mod ekle — sonra tuşları buradan atarsın.": "Add a mode on the left — then you assign the buttons here.",
  "HA'da Çalışan Otomasyonlar": "Automations Running in HA",
  "HA'daki eski otomasyonları sil": "Delete old automations in HA",
  "Mod adı (ör. Işıklar, TV):": "Mode name (e.g. Lights, TV):",
  "Bu adda mod zaten var": "A mode with this name already exists",
  "MOD GÖSTERGESİ": "MODE INDICATOR",
  "Mod değişince hangi moda geçtiğini ışıkla anla. İsteğe bağlı.": "See which mode you switched to via a light when the mode changes. Optional.",
  "Yanıp sönsün, sonra eski haline dönsün": "Blink, then return to its previous state",
  "O modun renginde kalsın": "Stay in that mode's color",
  "Varsayılan gösterge ışığı": "Default indicator light",
  "Kaç kez": "How many times",
  "kez": "times",
  "Yanış süresi": "Blink duration",
  "sn": "s",
  "Her mod için renk ve ışık": "Color and light for each mode",
  "bu modun ışığı:": "this mode's light:",
  "ışık seçilmedi → varsayılan": "no light selected → default",
  "boş": "empty",
  "ÇEVİR": "TURN",
  "DIAL": "DIAL",
  "Tek bas": "Single press",
  "Uzun bas": "Long press",
  "Çift bas": "Double press",
  "AÇ": "ON",
  "PARLAKLIK +": "BRIGHTNESS +",
  "PARLAKLIK −": "BRIGHTNESS −",
  "KAPAT": "OFF",
  "Bu tuş “Mod değiştir” — üzerine atanmaz, başka tuş seç": "This button is “Switch mode” — you can't assign over it, pick another button",
  "Bu tuşta tek hedefli bir atama var — önce onu temizle": "This button has a single-target assignment — clear it first",
  "Sonraki mod": "Next mode",
  "Yukarıdan bir tuşa dokun — ne yapacağını burada seçersin.": "Tap a button above — you choose what it does here.",
  "Yukarıdan bir tuşa ya da ortadaki dial'a dokun — ne yapacağını burada seçersin.": "Tap a button above or the dial in the center — you choose what it does here.",
  "Dial — çevirme": "Dial — turning",
  "Ne kontrol etsin": "What it controls",
  "Hedef cihaz": "Target device",
  "Sadece açık olan ışıkları etkile": "Only affect lights that are on",
  "Kapalı ışıklara dokunmaz — bölgesel açtığında sadece yananları kısar": "Doesn't touch off lights — when partially on, only dims the ones that are lit",
  "Hepsini etkile (kapalıları da açar)": "Affect all (also turns on the off ones)",
  "Grubun tamamını hedefler, kapalı olanlar yanar": "Targets the whole group, off ones turn on",
  "Hangi ışıklar": "Which lights",
  "Yavaş çevirme adımı": "Slow turn step",
  "Hızlı çevirme adımı": "Fast turn step",
  "Bu tetikleyicide atama var": "This trigger has an assignment",
  "Tetikleyici": "Trigger",
  "ms": "ms",
  "Çift bas penceresi": "Double-press window",
  "Bu işlemi kaldır": "Remove this action",
  "İşlem ekle (aynı anda çalışır)": "Add action (runs at the same time)",
  "Ne yapsın?": "What should it do?",
  "Hedef": "Target",
  "Komut": "Command",
  "Hangi mod": "Which mode",
  "Servis": "Service",
  "Zaten açıksa kapat": "Turn off if already on",
  "Her zaman aç": "Always turn on",
  "Akıllı davranış": "Smart behavior",
  "Kapanacak ışıklar": "Lights to turn off",
  "ör. ışık aç, boolean toggle, light.turn_on": "e.g. turn on light, boolean toggle, light.turn_on",
  "Eşleşen servis yok.": "No matching service.",
  "hedefe uygun": "matches target",
  "Servis seçildi: ": "Service selected: ",
  "Ara… (isim ya da entity_id)": "Search… (name or entity_id)",
  "Eşleşen cihaz yok.": "No matching device.",
  "Not (ör. 'otomasyonları silmeden önce')": "Note (e.g. 'before deleting the automations')",
  "Şimdi yedekle": "Back up now",
  "Mevcut hali bilgisayara indir": "Download current state to computer",
  "İndirildi ✓": "Downloaded ✓",
  "İndirilemedi": "Could not download",
  "Dosyadan geri yükle": "Restore from file",
  "Bu dosyayı geri yükle? Şu anki tüm Presto ayarların DEĞİŞECEK.": "Restore this file? All your current Presto settings WILL CHANGE.",
  "Dosyadan yüklendi — sayfa yenileniyor": "Loaded from file — reloading page",
  "Dosya okunamadı ya da geçersiz": "File could not be read or is invalid",
  "Henüz yedek yok.": "No backups yet.",
  "Geri yükle": "Restore",
  "Bu yedeği geri yükle? Şu anki tüm Presto ayarların bununla DEĞİŞECEK.": "Restore this backup? All your current Presto settings WILL CHANGE to this.",
  "Yedek geri yüklendi — sayfa yenileniyor": "Backup restored — reloading page",
  "Geri yüklenemedi": "Could not restore",
  "Bu yedeği bilgisayara indir": "Download this backup to computer",
  "Yedeği sil": "Delete backup",
  "Silinemedi": "Could not delete",
  "Yedek alındı ✓": "Backup taken ✓",
  "Yedek alınamadı": "Could not take backup",
  "Yedekler okunamadı.": "Could not read backups.",
  "Cihazdaki tuşlara bas / dial'ı çevir — gelen sinyal burada görünür.": "Press the buttons on the device / turn the dial — the incoming signal appears here.",
  "Bekleniyor…": "Waiting…",
  "Dial → sağa yavaş": "Dial → right slow",
  "Dial → sağa HIZLI": "Dial → right FAST",
  "Dial → sola yavaş": "Dial → left slow",
  "Dial → sola HIZLI": "Dial → left FAST",
  "Dial → saat yönü": "Dial → clockwise",
  "Dial → ters yön": "Dial → counter-clockwise",
  "sinyal geldi": "signal received",
  "Dinleme başlatılamadı: ": "Could not start listening: ",
  "Kuruluyor…": "Installing…",
  "Kurulacak atama yok": "No assignments to install",
  "Kurulamadı — ": "Could not install — ",
  "Kurarken": "While installing",
  "Alan kaldırıldı (Diğer)": "Area removed (Other)",
  "Oda değiştirilemedi (yetki?)": "Could not change room (permissions?)",
  "Otomasyonu Düzenle": "Edit Automation",
  "Yeni Otomasyon": "New Automation",
  "Bu odada uygun cihaz yok.": "No suitable device in this room.",
  "Bunlar algılayınca…": "When these detect…",
  "Bu odada hareket/varlık sensörü yok.": "No motion/presence sensor in this room.",
  "…bunlar açılsın": "…turn these on",
  "Bu odada ışık/anahtar yok.": "No light/switch in this room.",
  "Kapatma — bu sensör boş deyince": "Turn off — when this sensor reports clear",
  "Sensör yok — kapatma adımı atlanır.": "No sensor — the turn-off step is skipped.",
  "Şu kadar boş kalınca kapat:": "Turn off after this long clear:",
  "Hemen": "Immediately",
  "10 sn": "10 s",
  "30 sn": "30 s",
  "1 dk": "1 min",
  "2 dk": "2 min",
  "5 dk": "5 min",
  "10 dk": "10 min",
  "Kapanacaklar — boş bırakırsan açılanlarla aynı": "Which turn off — if left empty, same as the ones turned on",
  "Şart": "Condition",
  "Her zaman": "Always",
  "Karanlıkken (lux)": "When dark (lux)",
  "Güneş batınca": "After sunset",
  "Saat aralığı": "Time range",
  "Işık sensörü:": "Light sensor:",
  "Şundan karanlıksa aç:": "Turn on if darker than:",
  "lx altı": "below lx",
  "Lux sensörü bulunamadı — 'Güneş batınca' seçeneğini kullan.": "No lux sensor found — use the 'After sunset' option.",
  "Sadece": "Only",
  "ile": "to",
  "arası": "between",
  "İsim": "Name",
  "Otomasyon adı": "Automation name",
  "Vazgeç": "Cancel",
  "Yazılıyor…": "Writing…",
  "Otomasyon HA'ya yazıldı ✓": "Automation written to HA ✓",
  "HA'ya yazılamadı — yetki/bağlantı?": "Could not write to HA — permission/connection?"
};
const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---- cihaz alanları: hangi domain'ler "cihaz" sayılır ---- */
const DOM_ORDER = ["light", "switch", "climate", "fan", "media_player", "cover",
  "lock", "alarm_control_panel", "vacuum", "humidifier", "camera", "binary_sensor", "sensor",
  "input_boolean", "input_number", "input_select", "input_text", "input_datetime",
  "input_button", "counter", "timer", "number", "select", "button", "scene"];
const DOM_META = {
  light:        { icon: "mdi:lightbulb-outline",      label: "ışık" },
  switch:       { icon: "mdi:power-socket-eu",        label: "priz/anahtar" },
  climate:      { icon: "mdi:snowflake",              label: "iklim" },
  fan:          { icon: "mdi:fan",                    label: "fan" },
  media_player: { icon: "mdi:television-classic",     label: "medya" },
  cover:        { icon: "mdi:blinds-horizontal",      label: "perde" },
  lock:         { icon: "mdi:lock-outline",           label: "kilit" },
  alarm_control_panel:{ icon: "mdi:shield-lock-outline", label: "alarm" },
  vacuum:       { icon: "mdi:robot-vacuum",           label: "süpürge" },
  humidifier:   { icon: "mdi:air-humidifier",         label: "nem" },
  camera:       { icon: "mdi:cctv",                   label: "kamera" },
  binary_sensor:{ icon: "mdi:radar",                  label: "sensör" },
  sensor:       { icon: "mdi:gauge",                  label: "sensör" },
  input_boolean:{ icon: "mdi:toggle-switch-outline",  label: "yardımcı" },
  input_number: { icon: "mdi:ray-vertex",             label: "yardımcı" },
  input_select: { icon: "mdi:form-dropdown",          label: "yardımcı" },
  input_text:   { icon: "mdi:form-textbox",           label: "yardımcı" },
  input_datetime:{ icon: "mdi:calendar-clock",        label: "yardımcı" },
  input_button: { icon: "mdi:gesture-tap-button",     label: "yardımcı" },
  counter:      { icon: "mdi:counter",                label: "yardımcı" },
  timer:        { icon: "mdi:timer-outline",          label: "yardımcı" },
  number:       { icon: "mdi:numeric",                label: "yardımcı" },
  select:       { icon: "mdi:form-dropdown",          label: "yardımcı" },
  button:       { icon: "mdi:gesture-tap-button",     label: "yardımcı" },
  scene:        { icon: "mdi:palette-outline",        label: "sahne" },
};
const HELPER_PLAT = ["group", "template", "threshold", "derivative", "integration", "statistics", "trend", "min_max", "bayesian", "combine", "utility_meter"];
const BSENSOR_OK = ["motion", "occupancy", "presence", "door", "window", "opening",
  "garage_door", "moisture", "smoke", "gas", "vibration"];
const SENSOR_OK = ["temperature", "humidity", "illuminance", "power", "energy",
  "carbon_dioxide", "pm25"];
const BSENSOR_ICON = {
  motion: "mdi:motion-sensor", occupancy: "mdi:motion-sensor", presence: "mdi:motion-sensor",
  door: "mdi:door", window: "mdi:window-closed-variant", opening: "mdi:door",
  garage_door: "mdi:garage", moisture: "mdi:water-alert", smoke: "mdi:smoke-detector",
  gas: "mdi:gas-cylinder", vibration: "mdi:vibrate",
};
const SENSOR_ICON = {
  temperature: "mdi:thermometer", humidity: "mdi:water-percent",
  illuminance: "mdi:brightness-5", power: "mdi:lightning-bolt",
  energy: "mdi:lightning-bolt-circle", carbon_dioxide: "mdi:molecule-co2",
  pm25: "mdi:blur",
};

/* cihaz sınıfları — kompakt listede gruplama */
const GROUP_DEF = [
  { key: "isik",   name: "Işıklar",        icon: "mdi:lightbulb-outline",       doms: ["light"] },
  /* Işık grupları (Hue oda/zone + HA ışık grubu) — tek tek ışıklardan AYRI listelenir.
     Bunlar "bölge" gibi çalışır: Çekim Alanı, Röportaj, Ark Zone... */
  { key: "isikgrup", name: "Işık Grupları", icon: "mdi:lightbulb-group-outline", doms: ["light"] },
  { key: "priz",   name: "Priz & Anahtar", icon: "mdi:power-socket-eu",         doms: ["switch"] },
  { key: "iklim",  name: "İklim",          icon: "mdi:thermostat",              doms: ["climate", "fan", "humidifier"] },
  { key: "medya",  name: "Medya",          icon: "mdi:television-classic",      doms: ["media_player"] },
  { key: "perde",  name: "Perde & Panjur", icon: "mdi:blinds-horizontal",       doms: ["cover"] },
  { key: "guv",    name: "Güvenlik",       icon: "mdi:shield-home-outline",     doms: ["lock", "camera", "alarm_control_panel"] },
  { key: "temiz",  name: "Temizlik",       icon: "mdi:robot-vacuum",            doms: ["vacuum"] },
  { key: "varlik", name: "Varlık & Temas", icon: "mdi:motion-sensor",           doms: ["binary_sensor"] },
  { key: "olcum",  name: "Ölçümler",       icon: "mdi:gauge",                   doms: ["sensor"] },
  { key: "yardimci", name: "Yardımcılar",  icon: "mdi:tune-variant",            doms: ["input_boolean", "input_number", "input_select", "input_text", "input_datetime", "input_button", "counter", "timer", "number", "select", "button"] },
  { key: "sahne",  name: "Sahneler",       icon: "mdi:palette-outline",         doms: ["scene"] },
];
/* domain -> grup anahtarı (görünürlük filtresi için) */
const DOM_GROUP = {};
// isikgrup sanal bir bölüm (domain'i yine "light") — eşlemeyi ezmesin
for (const g of GROUP_DEF) if (g.key !== "isikgrup") for (const d of g.doms) DOM_GROUP[d] = g.key;

/* oda ikonu — alan adına bak, tahmin et */
function roomIcon(name) {
  const n = (name || "").toLowerCase();
  const map = [
    [/salon|oturma/, "mdi:sofa"], [/yatak/, "mdi:bed-king"],
    [/mutfak/, "mdi:fridge-outline"], [/banyo|duş/, "mdi:shower"],
    [/çocuk|bebek/, "mdi:teddy-bear"], [/ofis|çalışma/, "mdi:desk"],
    [/balkon|teras/, "mdi:balcony"], [/koridor|antre|hol/, "mdi:door-open"],
    [/tuvalet|wc/, "mdi:toilet"], [/yemek/, "mdi:silverware-fork-knife"],
    [/garaj/, "mdi:garage"], [/bahçe/, "mdi:tree"], [/çamaşır/, "mdi:washing-machine"],
  ];
  for (const [re, ic] of map) if (re.test(n)) return ic;
  return "mdi:door";
}


/* ---- PRESTO: tusa atanabilecek isler ---- */
const DT_ANY = "light|switch|fan|media_player|climate|cover|lock|humidifier|vacuum|input_boolean|scene|script";
const DT_ACT = {
  none:      { label: "— boş —" },
  scene:     { label: "Sahne çalıştır",        domain: "scene",  multi: true, pick: "Sahneler" },
  toggle:    { label: "Aç / kapat (toggle)",   domain: DT_ANY, multi: true, pick: "Cihazlar" },
  on:        { label: "Aç",                    domain: DT_ANY, multi: true, pick: "Cihazlar" },
  off:       { label: "Kapat",                 domain: DT_ANY, multi: true, pick: "Cihazlar" },
  media:     { label: "Medya kontrol",         domain: "media_player", pick: "Oynatıcı" },
  mode_next: { label: "Mod değiştir (diğer moda geç)" },
  mode_set:  { label: "Belirli moda geç" },
  script:    { label: "Script çalıştır",       domain: "script",       pick: "Script" },
  service:   { label: "Servis çağır (gelişmiş)", domain: DT_ANY, multi: true, pick: "Hedef (boş bırakılabilir)" },
};
/* ---- PRESTO: dial cevirince ne degissin ---- */
const DT_DIAL = {
  none:        { label: "— boş —" },
  brightness:  { label: "Parlaklık",       domain: "light",        slow: 15,  fast: 25,  unit: "%" },
  volume:      { label: "Ses",             domain: "media_player", slow: 5,   fast: 10,  unit: "%", filtre: "ses" },
  color_temp:  { label: "Renk sıcaklığı",  domain: "light",        slow: 200, fast: 500, unit: "K" },
  temperature: { label: "Sıcaklık",        domain: "climate",      slow: 0.5, fast: 1,   unit: "°" },
};
const DT_MEDIA = { play_pause: "Oynat / duraklat", next: "Sonraki", prev: "Önceki", stop: "Durdur" };
/* Çift bas penceresi (ms). Fiziksel duvar düğmesinde iki basış arası 400 ms'yi
   rahat aşıyor — dar tutmak çift basmayı "iki tek basış" gibi gösteriyor. */
const DT_DBL_WIN = 500;
/* İki aşamalı çalışma: bir Tap Dial'da en fazla 2 mod. */
const DT_MAX_MODE = 2;
/* Mod göstergesi varsayılan renkleri (Mod 1 / Mod 2) */
const DT_MODE_COLORS = ["#3b82f6", "#f59e0b"];
/* Yanıp sönme: kaç kez ve her yanış kaç saniye */
const DT_BLINK_TIMES = 2;
const DT_BLINK_SECS = 0.4;
/* Servis hangi entity domain'lerinde çalışır — "light.turn_on" bir switch'e
   uygulanınca HA sessizce hiçbir şey yapmaz, bunu önden yakalayalım. */
const DT_UNIVERSAL = ["homeassistant", "scene", "script", "notify", "persistent_notification"];
const _dtSlug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "dial";
/* Türkçe arama: "ışık" ile "Işık" eşleşsin diye i/ı, ş/s, ğ/g ... katlanır.
   (JS'te "I".toLowerCase() === "i" olduğu için düz toLowerCase yetmiyor.) */
const _dtNorm = (s) => String(s || "")
  .replace(/[İIı]/g, "i").replace(/[Şş]/g, "s").replace(/[Ğğ]/g, "g")
  .replace(/[Üü]/g, "u").replace(/[Öö]/g, "o").replace(/[Çç]/g, "c")
  .toLowerCase();

class DialTapPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._cfg = null;
    this._built = false;
    this._loaded = false;
    this._room = null;          // seçili area_id
    this._saveTimer = null;
    this._popCloser = null;
    this._sel = new Set();      // MOR seçili cihazlar (beyne ipucu)
    this._busy = false;
    this._editA = null;
  }

  set hass(hass) {
    this._hass = hass;
    if (this._lang == null) {
      let l = null;
      try { l = localStorage.getItem("dialtap_lang"); } catch (e) {}
      if (!l) l = (hass.language || "tr").slice(0, 2);
      this._lang = l === "en" ? "en" : "tr";
    }
    if (!this._loaded) { this._loaded = true; this._entCount = Object.keys(hass.entities || {}).length; this._load(); return; }
    this._updateLive();
    // yeni cihaz/entity eklenmiş/silinmişse (sayı değişti) tam yenile — yazarken bozmadan
    const n = Object.keys(hass.entities || {}).length;
    if (n !== this._entCount) { this._entCount = n; this._scheduleRefresh(); }
  }

  /* İngilizce seçiliyse shadow DOM'daki tüm metinleri çevir.
     Render eden her fonksiyonun SONUNDA çağrılır. Türkçe kaynak dokunulmaz. */
  _dtI18n() {
    if (this._lang !== "en" || !this.shadowRoot) return;
    const root = this.shadowRoot;
    // 1) düz metin düğümleri
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walk.nextNode()) nodes.push(walk.currentNode);
    for (const n of nodes) {
      const raw = n.nodeValue;
      const key = raw.trim();
      if (!key) continue;
      const en = DT_EN[key];
      if (en !== undefined) n.nodeValue = raw.replace(key, en);
    }
    // 2) <b>/<code> içeren note kutuları — innerHTML'i tam metinle eşleştir
    root.querySelectorAll(".dt-note, .dt-poolempty, .gb-empty, .dt-errrow span, .room-meta, .hero-s").forEach((e) => {
      const h = e.innerHTML && e.innerHTML.trim();
      if (h && DT_EN[h] !== undefined) e.innerHTML = DT_EN[h];
    });
    // 3) placeholder + title
    root.querySelectorAll("input, [title]").forEach((e) => {
      if (e.placeholder && DT_EN[e.placeholder.trim()] !== undefined) e.placeholder = DT_EN[e.placeholder.trim()];
      const t = e.getAttribute && e.getAttribute("title");
      if (t && DT_EN[t.trim()] !== undefined) e.setAttribute("title", DT_EN[t.trim()]);
    });
  }

  /* Dil-duyarlı üretim: interpolasyonla kurulan dinamik metinler _dtI18n'in
     birebir eşleşme sözlüğüne takılmaz — o yüzden burada doğrudan İngilizce üretilir. */
  _L(tr, en) { return this._lang === "en" ? en : tr; }
  _T(s) { return this._lang === "en" && DT_EN[s] !== undefined ? DT_EN[s] : s; }

  _scheduleRefresh() {
    clearTimeout(this._refreshTimer);
    this._refreshTimer = setTimeout(() => {
      const ae = this.shadowRoot && this.shadowRoot.activeElement;
      if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) { this._scheduleRefresh(); return; }
      if (this.shadowRoot.getElementById("cnf")) { this._scheduleRefresh(); return; } // onay kartı açıkken bekle
      this._renderRail(); this._renderStage();
      this._flash("Cihaz listesi güncellendi");
    }, 1500);
  }

  connectedCallback() { if (this._cfg) this._render(); }

  async _load() {
    let data = {};
    try { data = await this._hass.callApi("GET", "dial_tap/config"); } catch (e) { data = {}; }
    this._cfg = data && typeof data === "object" ? data : {};
    if (!this._cfg.rooms || typeof this._cfg.rooms !== "object") this._cfg.rooms = {};
    this._render();
  }

  _save() {
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => {
      this._hass.callApi("POST", "dial_tap/config", this._cfg)
        .then(() => this._flash("Kaydedildi"))
        .catch(() => this._flash("Kaydedilemedi", true));
    }, 450);
  }

  _flash(text, err) {
    const s = this.shadowRoot.getElementById("status");
    if (!s) return;
    s.textContent = "● " + text;
    s.style.color = err ? "#ff6b7d" : "#5fe39a";
    s.style.opacity = "1";
    clearTimeout(this._flashTimer);
    this._flashTimer = setTimeout(() => { s.style.opacity = "0"; }, 1700);
  }

  /* ---------------------------------------------------------- veri */
  _entOk(eid, ent) {
    if (!ent) return false;
    if (ent.hidden || ent.hidden_by || ent.disabled_by) return false;
    if (ent.entity_category) return false; // config/diagnostic çöplüğü dışarı
    const dom = eid.split(".")[0];
    if (!DOM_META[dom]) return false;
    // ayarlardan gizlenen kategoriler (ör. buttons, yardımcılar) her yerde saklanır
    const gk = DOM_GROUP[dom];
    if (gk && Array.isArray(this._cfg.hideGroups) && this._cfg.hideGroups.includes(gk)) return false;
    // panelde/kullanıcı tarafından oluşturulan yardımcılar (grup/template sensörleri) device_class'sız da olsa GEÇSİN
    if (HELPER_PLAT.includes(ent.platform)) return true;
    const st = this._hass.states[eid];
    const dc = st && st.attributes ? st.attributes.device_class : undefined;
    if (dom === "binary_sensor") return BSENSOR_OK.includes(dc);
    if (dom === "sensor") return SENSOR_OK.includes(dc);
    return true;
  }

  /* registry'de OLMAYAN (YAML/unique_id'siz) entity için state-tabanlı filtre */
  _entOkState(eid) {
    const dom = eid.split(".")[0];
    if (!DOM_META[dom]) return false;
    const gk = DOM_GROUP[dom];
    if (gk && Array.isArray(this._cfg.hideGroups) && this._cfg.hideGroups.includes(gk)) return false;
    const st = this._hass.states[eid];
    const dc = st && st.attributes ? st.attributes.device_class : undefined;
    if (dom === "binary_sensor") return BSENSOR_OK.includes(dc);
    if (dom === "sensor") return SENSOR_OK.includes(dc);
    return true;
  }

  /* area_id -> [{eid, dom, dc}] — cihazlar odalara dağıtılmış */
  _byRoom() {
    const h = this._hass;
    const out = {};
    if (!h || !h.entities) return out;
    for (const [eid, ent] of Object.entries(h.entities)) {
      if (!this._entOk(eid, ent)) continue;
      let area = ent.area_id;
      if (!area && ent.device_id && h.devices && h.devices[ent.device_id])
        area = h.devices[ent.device_id].area_id;
      const key = area || "__none";
      (out[key] = out[key] || []).push(eid);
    }
    // registry'de OLMAYAN (YAML) entity'ler — states'te var, hass.entities'te yok → Diğer'e koy
    for (const eid of Object.keys(h.states || {})) {
      if (h.entities[eid]) continue;
      if (!this._entOkState(eid)) continue;
      (out.__none = out.__none || []).push(eid);
    }
    // her oda içinde: domain sırası + isim
    for (const k of Object.keys(out)) {
      out[k].sort((a, b) => {
        const da = DOM_ORDER.indexOf(a.split(".")[0]);
        const db = DOM_ORDER.indexOf(b.split(".")[0]);
        if (da !== db) return da - db;
        return this._name(a).localeCompare(this._name(b), "tr");
      });
    }
    return out;
  }

  _roomList() {
    const h = this._hass;
    const byRoom = this._byRoom();
    const rooms = [];
    const areas = h && h.areas ? Object.values(h.areas) : [];
    areas.sort((a, b) => (a.name || "").localeCompare(b.name || "", "tr"));
    for (const a of areas) {
      const ents = byRoom[a.area_id] || [];
      if (!ents.length) continue; // boş odalar rayı kirletmesin
      rooms.push({ id: a.area_id, name: a.name, icon: a.icon || roomIcon(a.name), ents });
    }
    if (byRoom.__none && byRoom.__none.length)
      rooms.push({ id: "__none", name: "Diğer", icon: "mdi:shape-outline", ents: byRoom.__none });
    return rooms;
  }

  _name(eid) {
    const s = this._hass && this._hass.states[eid];
    return s ? (s.attributes.friendly_name || eid) : eid;
  }

  _entIcon(eid) {
    const dom = eid.split(".")[0];
    const st = this._hass.states[eid];
    const dc = st && st.attributes ? st.attributes.device_class : undefined;
    if (dom === "binary_sensor" && BSENSOR_ICON[dc]) return BSENSOR_ICON[dc];
    if (dom === "sensor" && SENSOR_ICON[dc]) return SENSOR_ICON[dc];
    return (DOM_META[dom] || {}).icon || "mdi:circle-medium";
  }

  /* canlı durum: {on, pulse, text} */
  _stateInfo(eid) {
    const st = this._hass.states[eid];
    if (!st || st.state === "unavailable") return { on: false, pulse: false, text: "—" };
    const dom = eid.split(".")[0];
    const v = st.state;
    const a = st.attributes || {};
    if (dom === "light" || dom === "switch" || dom === "fan" || dom === "humidifier" || dom === "input_boolean")
      return { on: v === "on", pulse: false, text: v === "on" ? "Açık" : "Kapalı" };
    if (dom === "timer")
      return { on: v === "active", pulse: v === "active", text: v === "active" ? "Çalışıyor" : "Boşta" };
    if (dom === "counter" || dom === "number" || dom === "input_number") {
      const u = a.unit_of_measurement || "";
      return { on: false, pulse: false, text: `${v}${u}` };
    }
    if (dom === "input_select" || dom === "select")
      return { on: false, pulse: false, text: String(v) };
    if (dom === "scene" || dom === "input_button" || dom === "button")
      return { on: false, pulse: false, text: "—" };
    if (dom === "climate") {
      const on = v !== "off";
      const t = a.current_temperature != null ? ` · ${a.current_temperature}°` : "";
      const modes = { heat: "Isıtma", cool: "Soğutma", auto: "Otomatik", dry: "Nem alma", fan_only: "Fan", heat_cool: "Oto" };
      return { on, pulse: false, text: (on ? (modes[v] || v) : "Kapalı") + t };
    }
    if (dom === "media_player") {
      const on = v !== "off" && v !== "standby" && v !== "idle";
      return { on: v !== "off", pulse: v === "playing", text: v === "playing" ? "Oynatıyor" : (v === "off" ? "Kapalı" : "Açık") };
    }
    if (dom === "cover") {
      const open = v === "open" || v === "opening";
      return { on: open, pulse: v === "opening" || v === "closing", text: open ? "Açık" : "Kapalı" };
    }
    if (dom === "lock")
      return { on: v === "unlocked", pulse: false, text: v === "locked" ? "Kilitli" : "Açık" };
    if (dom === "alarm_control_panel") {
      const t = { disarmed: "Devre dışı", armed_home: "Evde kurulu", armed_away: "Dışarıda kurulu",
        armed_night: "Gece kurulu", armed_vacation: "Tatil kurulu", arming: "Kuruluyor", pending: "Bekliyor",
        triggered: "ALARM!", disarming: "Kapatılıyor" };
      return { on: v !== "disarmed", pulse: v === "triggered" || v === "arming" || v === "pending", text: t[v] || v };
    }
    if (dom === "vacuum")
      return { on: v === "cleaning", pulse: v === "cleaning", text: v === "cleaning" ? "Temizliyor" : (v === "docked" ? "Yuvada" : v) };
    if (dom === "camera")
      return { on: v === "recording" || v === "streaming", pulse: v === "recording", text: v === "idle" ? "Hazır" : v };
    if (dom === "binary_sensor") {
      const dc = a.device_class;
      const onTxt = { motion: "Hareket!", occupancy: "Varlık!", presence: "Varlık!", door: "Açık", window: "Açık", opening: "Açık", garage_door: "Açık", moisture: "SU!", smoke: "DUMAN!", gas: "GAZ!", vibration: "Titreşim" };
      const offTxt = { motion: "Sakin", occupancy: "Boş", presence: "Boş", door: "Kapalı", window: "Kapalı", opening: "Kapalı", garage_door: "Kapalı", moisture: "Kuru", smoke: "Temiz", gas: "Temiz", vibration: "Sakin" };
      const on = v === "on";
      return { on, pulse: on && ["motion", "occupancy", "presence", "moisture", "smoke", "gas"].includes(dc), text: on ? (onTxt[dc] || "Aktif") : (offTxt[dc] || "Pasif") };
    }
    if (dom === "sensor") {
      const u = a.unit_of_measurement || "";
      return { on: false, pulse: false, text: `${v}${u}` };
    }
    return { on: v === "on", pulse: false, text: v };
  }

  /* oda config: bölümler */
  _roomCfg(roomId) {
    const r = this._cfg.rooms;
    if (!r[roomId] || typeof r[roomId] !== "object") r[roomId] = {};
    if (!Array.isArray(r[roomId].sections)) r[roomId].sections = [];
    if (!Array.isArray(r[roomId].autos)) r[roomId].autos = [];
    return r[roomId];
  }

  /* SANAL (izleme) odalar — panele özel, HA area'sına YAZILMAZ. cfg.vrooms=[{id,name,icon,ents[]}] */
  _vrooms() {
    if (!Array.isArray(this._cfg.vrooms)) this._cfg.vrooms = [];
    for (const v of this._cfg.vrooms) if (!Array.isArray(v.ents)) v.ents = [];
    return this._cfg.vrooms;
  }
  _curVroom() {
    return this._vrooms().find((v) => v.id === this._room) || null;
  }
  /* oluşturulan entity'yi (varsa) izleme odasına ekle. room verilirse ondan, yoksa aktif vroom'dan. */
  _vroomEkle(room, eid) {
    if (!eid) return;
    let v = null;
    if (room && typeof room.id === "string" && room.id.startsWith("__v_"))
      v = this._vrooms().find((x) => x.id === room.id);
    if (!v) v = this._curVroom();
    if (v && !v.ents.includes(eid)) { v.ents.push(eid); this._save(); }
  }

  /* ---------------------------------------------------------- iskelet */
  _render() {
    if (!this._hass || !this._cfg) return;
    if (!this._built) this._build();
    this._renderRail();
    this._renderStage();
  }

  _build() {
    this._built = true;
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;min-height:100%;background:#0c0a10;color:#fff;
          font-family:'Inter','Segoe UI',system-ui,sans-serif;}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        button,.rr,.dev,.sec-act,.pop-item,.addsec{touch-action:manipulation;user-select:none;-webkit-user-select:none;}
        ha-icon{--mdc-icon-size:20px;display:inline-flex;vertical-align:middle;}

        .top{position:sticky;top:0;z-index:6;background:rgba(12,10,16,.85);backdrop-filter:blur(12px);
          border-bottom:1px solid rgba(255,255,255,.06);}
        .topwrap{max-width:1160px;margin:0 auto;display:flex;align-items:center;gap:12px;padding:14px 28px;}
        .brand{display:flex;align-items:center;gap:10px;font-weight:600;letter-spacing:2.5px;font-size:14px;}
        .brand .logo{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#ec4b88,#8b3dff);
          display:flex;align-items:center;justify-content:center;color:#fff;}
        .brand .logo ha-icon{--mdc-icon-size:18px;}
        .status{margin-left:auto;font-size:13px;opacity:0;transition:opacity .25s;color:#5fe39a;}
        /* dil seçici TR/EN */
        .dt-lang{margin-left:14px;display:inline-flex;border:1px solid rgba(255,255,255,.1);
          border-radius:9px;overflow:hidden;flex:0 0 auto;}
        .dt-lang div{padding:6px 11px;font-size:12px;font-weight:700;letter-spacing:1px;color:#8b839c;
          cursor:pointer;transition:.15s;}
        .dt-lang div.on{background:#ec4b88;color:#fff;}
        .dt-lang div:not(.on):hover{color:#e8dfe8;background:rgba(255,255,255,.05);}

        /* üst araç çubuğu (ayarlar dişlisi) */
        .gear{margin-left:14px;width:38px;height:38px;border-radius:11px;border:1px solid rgba(255,255,255,.09);
          background:rgba(255,255,255,.04);color:#b9aeb8;cursor:pointer;display:flex;align-items:center;
          justify-content:center;transition:.15s;flex:0 0 auto;}
        .gear:hover{color:#ff9cc1;border-color:rgba(236,75,136,.5);background:rgba(236,75,136,.08);}
        .gear ha-icon{--mdc-icon-size:20px;}

        /* bildirim şeridi (her odada üstte) */
          flex-wrap:wrap;}
          align-items:center;gap:6px;}
        .chchip{display:inline-flex;align-items:center;gap:8px;padding:6px 13px 6px 10px;border-radius:20px;
          background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07);font-size:12.5px;color:#d8cede;}
        .chchip .ch-ic{width:22px;height:22px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}
        .chchip .ch-ic ha-icon{--mdc-icon-size:15px;}
        .chchip .ch-tg{display:inline-flex;}
        .chchip .cn{font-weight:500;}
        .chchip .ct{font-size:10.5px;color:#7d7280;}
          border:1px dashed rgba(255,255,255,.16);background:none;color:#8d8290;cursor:pointer;font:inherit;
          font-size:12px;transition:.15s;}

        /* ayarlar modalı — kanal listesi */
        .set-sec{margin-bottom:22px;}
        .set-h{font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#b58cff;margin:0 0 12px;
          display:flex;align-items:center;gap:8px;}
        .set-h ha-icon{--mdc-icon-size:15px;}
        .svc{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;
          border:1px solid rgba(255,255,255,.06);margin-bottom:8px;background:rgba(255,255,255,.02);}
        .svc.on{border-color:rgba(139,61,255,.45);background:rgba(139,61,255,.07);}
        .svc-ic{width:30px;height:30px;border-radius:9px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;
          background:rgba(255,255,255,.05);}
        .svc-ic ha-icon{--mdc-icon-size:17px;}
        .svc-b{flex:1;min-width:0;}
        .svc-n{font-size:13.5px;color:#e7dce6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .svc-s{font-size:11px;color:#6f6675;font-family:monospace;}
        .svc-type{background:#1b1721;border:1px solid rgba(255,255,255,.1);border-radius:9px;color:#cfc4ce;
          padding:6px 8px;font:inherit;font-size:12px;outline:none;flex:0 0 auto;}
        .svc-lbl{background:#1b1721;border:1px solid rgba(255,255,255,.1);border-radius:9px;color:#fff;
          padding:6px 9px;font:inherit;font-size:12px;outline:none;width:120px;}
        .set-search{width:100%;background:#1b1721;border:1px solid rgba(255,255,255,.1);border-radius:11px;
          color:#fff;padding:10px 13px;font:inherit;font-size:13px;outline:none;margin-bottom:12px;}
        .set-search:focus{border-color:rgba(236,75,136,.5);}
        .roomsearch{max-width:440px;margin:2px 0 20px;}
        .set-note{font-size:12px;color:#7d7280;line-height:1.55;margin-bottom:14px;}

        /* genel bölümü — odalar-arası seçim kutusu */
        .genel-box{background:#15121c;border:1px solid rgba(139,61,255,.28);border-radius:18px;padding:20px 20px 18px;
          margin-bottom:20px;}
        .gb-h{display:flex;align-items:center;gap:9px;margin-bottom:6px;}
        .gb-h .gt{font-family:Georgia,serif;font-size:20px;}
        .gb-sub{font-size:12.5px;color:#8d8290;margin-bottom:16px;line-height:1.5;}
        .gb-sel{display:flex;flex-wrap:wrap;gap:8px;min-height:20px;margin-bottom:14px;}
        .gb-empty{color:#6f6675;font-size:13px;}
        .gb-add{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border-radius:20px;
          border:1px dashed rgba(157,92,255,.4);background:rgba(139,61,255,.08);color:#c9a8ff;cursor:pointer;
          font:inherit;font-size:13px;transition:.15s;}
        .rr.raildrop{background:rgba(236,75,136,.22)!important;outline:2px dashed rgba(236,75,136,.7);outline-offset:-2px;}
        /* sanal (izleme) oda: ray + canlı durum kartları */
        .rr.addvroom{color:#9d8fb0;opacity:.85;}
        .rr.addvroom:hover{opacity:1;color:#ff9cc1;}
        .rr.vroom.on{background:rgba(236,75,136,.14);}
        .vmon{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;margin-bottom:14px;}
        .vcard{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:13px;
          background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);min-width:0;}
        .vcard ha-icon{--mdc-icon-size:21px;color:#8d8290;flex:0 0 auto;}
        .vcard.on{border-color:rgba(236,75,136,.5);background:rgba(236,75,136,.08);}
        .vcard.on ha-icon{color:#ff8fb3;}
        .vcard.pulse{border-color:rgba(236,75,136,.75);animation:vpulse 1.6s ease-in-out infinite;}
        @keyframes vpulse{0%,100%{background:rgba(236,75,136,.08);}50%{background:rgba(236,75,136,.2);}}
        .vc-t{flex:1;min-width:0;}
        .vc-n{font-size:13.5px;color:#ece4ee;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .vc-s{font-size:12px;color:#9b91a8;margin-top:2px;}
        .vcard.on .vc-s{color:#ff9cc1;}
        .gb-add:hover{background:rgba(139,61,255,.16);}
        .gb-add ha-icon{--mdc-icon-size:16px;}
        /* odalar-arası seçici popover */
        .xp{position:fixed;inset:0;z-index:55;background:rgba(8,6,12,.7);backdrop-filter:blur(8px);
          display:flex;align-items:flex-start;justify-content:center;padding:40px 16px;overflow-y:auto;}
        .xp-in{width:100%;max-width:640px;background:#131017;border:1px solid rgba(255,255,255,.09);
          border-radius:20px;padding:22px;box-shadow:0 30px 80px rgba(0,0,0,.7);}
        .xp-room{margin-bottom:14px;padding-top:22px;border-top:1px solid rgba(255,143,179,.22);}
        .xp-room:first-child{padding-top:0;border-top:none;}
        .xp-rn{font-size:19px;font-weight:700;letter-spacing:.6px;color:#ffd3e2;margin:0 0 14px;
          display:flex;align-items:center;gap:10px;}
        .xp-rn ha-icon{--mdc-icon-size:22px;color:#ff8fb3;}

        .wrap{max-width:1160px;margin:0 auto;padding:34px 28px 90px;}
        .hero-l{font-size:12px;letter-spacing:3px;color:#6f6675;text-transform:uppercase;}
        .hero-h{font-family:Georgia,'Times New Roman',serif;font-size:36px;font-weight:500;margin:6px 0 4px;}
        .hero-s{font-size:14.5px;color:#9a90a0;margin-bottom:30px;max-width:640px;line-height:1.55;}

        .layout{display:flex;gap:34px;align-items:flex-start;}

        /* ---- oda rayı ---- */
        .rail{width:236px;flex:0 0 auto;position:sticky;top:86px;}
        .rail-l{font-size:11px;letter-spacing:2.5px;color:#5d5464;text-transform:uppercase;
          padding:0 14px 10px;}
        .rr{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:12px;cursor:pointer;
          color:#93899b;position:relative;transition:.16s;}
        .rr:hover{color:#e8dfe8;background:rgba(255,255,255,.035);}
        .rr.on{color:#fff;background:linear-gradient(90deg,rgba(236,75,136,.15),rgba(139,61,255,.05) 70%,transparent);}
        .rr.on::before{content:"";position:absolute;left:-2px;top:9px;bottom:9px;width:3px;border-radius:3px;
          background:linear-gradient(#ec4b88,#8b3dff);box-shadow:0 0 14px rgba(236,75,136,.8);}
        .rr ha-icon{--mdc-icon-size:19px;opacity:.85;}
        .rr.on ha-icon{color:#ff8fb3;opacity:1;}
        .rr .n{flex:1;font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .rr .c{font-size:11px;color:#5d5464;font-variant-numeric:tabular-nums;}
        .rr.on .c{color:#b9a0c0;}
        /* Presto modları — cihazın altında girintili */
        .rr.rmode{padding:7px 14px 7px 34px;gap:9px;}
        .rr.rmode .n{font-size:13px;}
        .rr.rmode.addmode{color:#6d6478;}
        .rr.rmode.addmode ha-icon{--mdc-icon-size:15px;}
        .rr.rmode .dt-dot{width:7px;height:7px;border-radius:50%;background:#3a3248;flex:0 0 7px;}
        .rr.rmode .dt-dot.live{background:#4ade80;box-shadow:0 0 8px #4ade80;}

        /* ---- sahne ---- */
        .stage{flex:1;min-width:0;position:relative;}
        .glow{position:absolute;top:-90px;left:-60px;width:420px;height:280px;border-radius:50%;
          background:radial-gradient(closest-side,rgba(236,75,136,.14),rgba(139,61,255,.06) 60%,transparent);
          pointer-events:none;filter:blur(6px);}
        .stage-h{position:relative;display:flex;align-items:flex-end;gap:18px;flex-wrap:wrap;
          padding:2px 0 6px;margin-bottom:6px;}
        .room-title{font-family:Georgia,serif;font-size:42px;font-weight:500;line-height:1.05;}
        .room-meta{font-size:13px;color:#8d8290;padding-bottom:9px;letter-spacing:.2px;}
        .room-meta b{color:#cfc4ce;font-weight:600;}
        .addsec{margin-left:auto;display:inline-flex;align-items:center;gap:7px;padding:9px 16px;
          border-radius:22px;border:1px dashed rgba(255,255,255,.2);background:none;color:#cfc4ce;
          cursor:pointer;font:inherit;font-size:13.5px;transition:.15s;margin-bottom:6px;}
        .addsec ha-icon{--mdc-icon-size:17px;}
        .addsec:hover{border-color:#ec4b88;color:#ff9cc1;background:rgba(236,75,136,.07);}

        .secwrap{margin-top:14px;}
        .sec{position:relative;padding:16px 0 12px 24px;margin-bottom:4px;}
        .sec::before{content:"";position:absolute;left:0;top:24px;bottom:16px;width:2px;border-radius:2px;
          background:linear-gradient(rgba(236,75,136,.85),rgba(139,61,255,.35) 60%,transparent);}
        .sec.unassigned::before{background:linear-gradient(rgba(255,255,255,.22),transparent);}
        .sec-h{display:flex;align-items:center;gap:10px;margin-bottom:13px;min-height:26px;}
        .sec-name{font-size:12px;letter-spacing:2.6px;text-transform:uppercase;color:#e2d7e0;font-weight:600;}
        .sec.unassigned .sec-name{color:#8d8290;}
        .sec-count{font-size:11px;color:#5d5464;font-variant-numeric:tabular-nums;letter-spacing:.5px;}
        .sec-act{background:none;border:none;color:#5d5464;cursor:pointer;padding:4px;border-radius:7px;
          display:inline-flex;opacity:0;transition:.15s;}
        .sec-h:hover .sec-act{opacity:1;}
        .sec-act:hover{color:#ff9cc1;background:rgba(236,75,136,.1);}
        .sec-act ha-icon{--mdc-icon-size:16px;}
        .sec-in{background:#17141c;border:1px solid rgba(236,75,136,.5);border-radius:10px;color:#fff;
          padding:8px 12px;font:inherit;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;outline:none;width:220px;}

        .devflow{display:flex;flex-wrap:wrap;gap:7px;}
        .dev{display:inline-flex;align-items:center;gap:7px;padding:5px 10px 5px 8px;border-radius:17px;
          background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.055);cursor:pointer;
          transition:.16s;max-width:100%;}
        .dev:hover{border-color:rgba(236,75,136,.55);background:rgba(236,75,136,.08);transform:translateY(-1px);}
        .dev ha-icon{--mdc-icon-size:15px;color:#9a90a0;flex:0 0 auto;transition:.16s;}
        .dev.on ha-icon{color:#ffcf5c;}
        .dev.pulse ha-icon{color:#ff7eb0;}
        .dev .dn{font-size:12.5px;color:#e7dce6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:170px;}
        .dev .ds{font-size:11px;color:#6f6675;white-space:nowrap;font-variant-numeric:tabular-nums;}
        /* cihaz sınıf grupları */
        .grp{margin:0 0 13px;}
        .grp:last-child{margin-bottom:0;}
        .grp-h{display:flex;align-items:center;gap:7px;margin:0 0 7px;}
        .grp-h ha-icon{--mdc-icon-size:13px;color:#7d7280;}
        .grp-h .gn{font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:#7d7280;font-weight:600;}
        .grp-h .gc{font-size:10px;color:#4a444f;font-variant-numeric:tabular-nums;}
        .dev.on .ds{color:#ffcf5c;}
        .dev.pulse .ds{color:#ff7eb0;}
        .dev .dot{width:6px;height:6px;border-radius:50%;background:#413b46;flex:0 0 auto;transition:.2s;}
        .dev.on .dot{background:#ffcf5c;box-shadow:0 0 9px rgba(255,207,92,.9);}
        .dev.pulse .dot{background:#ff5c9d;box-shadow:0 0 10px rgba(255,92,157,.95);animation:pp 1.1s ease-in-out infinite;}
        @keyframes pp{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.55);opacity:.6}}
        /* sürükle-bırak */
        .dev.drag{opacity:.35;}
        .sec.dropok{background:rgba(139,61,255,.07);border-radius:16px;}
        .sec.dropok::before{background:linear-gradient(#b58cff,#ec4b88);box-shadow:0 0 14px rgba(139,61,255,.8);}
        .sec.dropok .sec-name{color:#c9a8ff;}
        /* MOR seçim — beyne ipucu */
        .dev.sel{background:rgba(139,61,255,.2);border-color:#9d5cff;
          box-shadow:0 0 0 1px rgba(157,92,255,.55),0 0 18px rgba(139,61,255,.35);}
        .dev.sel ha-icon{color:#c9a8ff;}
        .dev.sel .dn{color:#efe6ff;}
        .dev.sel .dot{background:#b58cff;box-shadow:0 0 9px rgba(181,140,255,.95);}
        .dev-mv{display:inline-flex;align-items:center;justify-content:center;border:none;background:none;
          color:#4a444f;cursor:pointer;padding:2px;margin:-2px -4px -2px -2px;border-radius:7px;transition:.15s;}
        .dev-mv ha-icon{--mdc-icon-size:15px;color:inherit;}
        .dev:hover .dev-mv{color:#8d8290;}
        .dev-mv:hover{color:#ff9cc1 !important;background:rgba(236,75,136,.12);}

        /* ---- (kaldirildi: AI yazma kutusu) ---- */
        .cmp{position:relative;margin:6px 0 18px;border-radius:20px;padding:1px;
          background:linear-gradient(135deg,rgba(139,61,255,.55),rgba(236,75,136,.4) 45%,rgba(255,255,255,.08));}
        .cmp-in{background:#14111a;border-radius:19px;padding:16px 18px 13px;}
        .cmp-row{display:flex;align-items:flex-start;gap:13px;}
        .cmp-ic{width:38px;height:38px;border-radius:12px;flex:0 0 auto;margin-top:2px;display:flex;
          align-items:center;justify-content:center;color:#c9a8ff;
          background:linear-gradient(135deg,rgba(139,61,255,.25),rgba(236,75,136,.2));}
        .cmp-ic ha-icon{--mdc-icon-size:21px;}
        .cmp textarea{flex:1;background:none;border:none;outline:none;resize:none;color:#fff;
          font:inherit;font-size:15.5px;line-height:1.55;min-height:52px;padding:8px 0 0;}
        .cmp textarea::placeholder{color:#6f6675;}
        .cmp-send{width:42px;height:42px;border-radius:14px;border:none;flex:0 0 auto;cursor:pointer;
          background:linear-gradient(135deg,#8b3dff,#ec4b88);color:#fff;display:flex;align-items:center;
          justify-content:center;transition:.15s;margin-top:2px;}
        .cmp-send ha-icon{--mdc-icon-size:20px;}
        .cmp-send:hover{filter:brightness(1.15);transform:translateY(-1px);}
        .cmp-send[disabled]{opacity:.4;cursor:default;transform:none;filter:none;}
        .cmp-foot{display:flex;align-items:center;gap:10px;margin-top:10px;padding-left:51px;flex-wrap:wrap;}
        .cmp-hint{font-size:12px;color:#6f6675;}
        .cmp-hint b{color:#b58cff;font-weight:500;}
        .cmp-selrow{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
        .cmp-selchip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:14px;
          font-size:11.5px;color:#d9c8ff;background:rgba(139,61,255,.16);border:1px solid rgba(157,92,255,.4);}
        .cmp-selchip ha-icon{--mdc-icon-size:13px;color:#b58cff;}
        .cmp-edit{display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:7px 12px;border-radius:12px;
          background:rgba(139,61,255,.13);border:1px solid rgba(157,92,255,.4);font-size:12.5px;color:#d9c8ff;}
        .cmp-edit ha-icon{--mdc-icon-size:15px;color:#b58cff;}
        .cmp-edit b{color:#fff;font-weight:600;}
        .cmp-edit .x{margin-left:auto;background:none;border:none;color:#8d8290;cursor:pointer;
          padding:2px 6px;border-radius:7px;font:inherit;font-size:12px;}
        .cmp-edit .x:hover{color:#ff8296;background:rgba(255,255,255,.06);}
        .auto-act.ai{color:#b58cff;}
        .auto-act.ai:hover{color:#e0ccff;background:rgba(139,61,255,.16);}
        .cnf-warn{margin-top:10px;font-size:12.5px;color:#ffb86b;line-height:1.6;}
        .cnf-warn b{color:#ffd9a8;}
        .cmp-busy{display:flex;align-items:center;gap:10px;padding:14px 4px 4px 51px;font-size:13.5px;color:#c9a8ff;}
        .cmp-busy .b1{width:9px;height:9px;border-radius:50%;background:#b58cff;animation:pp 1s ease-in-out infinite;}
        .cmp-err{padding:12px 4px 2px 51px;font-size:13px;color:#ff8296;line-height:1.5;}

        /* ---- onay kartı ---- */
        .cnf{margin:0 0 18px;border-radius:18px;background:#171226;border:1px solid rgba(157,92,255,.35);
          padding:18px 20px;box-shadow:0 14px 40px rgba(80,40,160,.18);}
        .cnf-t{display:flex;align-items:center;gap:9px;font-size:11px;letter-spacing:2.4px;
          text-transform:uppercase;color:#b58cff;margin-bottom:10px;}
        .cnf-t ha-icon{--mdc-icon-size:16px;}
        .cnf-sum{font-family:Georgia,serif;font-size:19px;line-height:1.45;color:#f2ecff;margin-bottom:10px;}
        .cnf-det{font-size:12.5px;color:#8d8290;line-height:1.6;}
        .cnf-det b{color:#c9a8ff;font-weight:500;}
        .cnf-det i{color:#ffb86b;font-style:normal;}
        .cnf-foot{display:flex;gap:10px;margin-top:16px;}

        .empty{color:#6f6675;font-size:13.5px;padding:18px 0 6px 24px;line-height:1.6;}
        .empty b{color:#b9aeb8;}

        /* ---- otomasyonlar ---- */
        .sec.autos::before{background:linear-gradient(rgba(139,61,255,.9),rgba(236,75,136,.35) 60%,transparent);}
        /* ---- scriptler ---- */
        .sec.scripts{margin-top:26px;}
        .sec.scripts::before{background:linear-gradient(rgba(236,75,136,.9),rgba(139,61,255,.35) 60%,transparent);}
        .sec.scripts .auto-ic{background:rgba(236,75,136,.14);color:#ff8fb3;}
        .auto.selx{background:rgba(236,75,136,.07);border-radius:14px;padding-left:10px;padding-right:10px;
          border:1px solid rgba(236,75,136,.45);border-bottom:1px solid rgba(236,75,136,.45);margin:4px 0;}
        .auto.selx .auto-n{color:#ffb3cd;}
        .addauto{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:22px;
          border:none;background:linear-gradient(90deg,rgba(139,61,255,.24),rgba(236,75,136,.24));
          color:#e6d6ff;cursor:pointer;font:inherit;font-size:13.5px;transition:.15s;margin-bottom:6px;}
        .addauto ha-icon{--mdc-icon-size:17px;}
        .addauto:hover{filter:brightness(1.25);}
        .auto{display:flex;align-items:center;gap:14px;padding:13px 2px;border-bottom:1px solid rgba(255,255,255,.045);}
        .auto:last-child{border-bottom:none;}
        .auto-ic{width:38px;height:38px;border-radius:12px;flex:0 0 auto;display:flex;align-items:center;
          justify-content:center;background:rgba(139,61,255,.15);color:#b58cff;}
        .auto-ic ha-icon{--mdc-icon-size:20px;}
        .auto.paused .auto-ic{background:rgba(255,255,255,.05);color:#6f6675;}
        .auto-b{flex:1;min-width:0;}
        .auto-n{font-size:14.5px;font-weight:600;color:#f0e8f0;}
        .auto.paused .auto-n{color:#8d8290;}
        .auto-s{font-size:12.5px;color:#7d7280;margin-top:3px;line-height:1.55;}
        .auto-s b{color:#c9a8ff;font-weight:500;}
        .auto-s i{color:#ffb86b;font-style:normal;}
        .auto-act{background:none;border:none;color:#5d5464;cursor:pointer;padding:6px;border-radius:8px;
          display:inline-flex;transition:.15s;flex:0 0 auto;}
        .auto-act:hover{color:#ff9cc1;background:rgba(236,75,136,.1);}
        .auto-act ha-icon{--mdc-icon-size:18px;}
        .tgl{width:42px;height:24px;border-radius:20px;background:#2a2530;position:relative;cursor:pointer;
          transition:.2s;flex:0 0 auto;}
        .tgl .k{position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.2s;}
        .tgl.on{background:linear-gradient(90deg,#8b3dff,#ec4b88);}
        .tgl.on .k{left:21px;}

        /* ---- tarif editörü ---- */
        .ov{position:fixed;inset:0;z-index:50;background:rgba(8,6,12,.74);backdrop-filter:blur(9px);
          display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:40px 16px 60px;}
        .ed{width:100%;max-width:680px;background:#131017;border:1px solid rgba(255,255,255,.09);
          border-radius:22px;padding:26px 26px 22px;box-shadow:0 30px 80px rgba(0,0,0,.7);}
        .ed-t{font-family:Georgia,serif;font-size:24px;margin-bottom:2px;}
        .ed-s{font-size:13px;color:#8d8290;margin-bottom:22px;}
        .ed-l{font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#b58cff;
          margin:22px 0 10px;display:flex;align-items:center;gap:8px;}
        .ed-l.first{margin-top:0;}
        .ed-l ha-icon{--mdc-icon-size:15px;}
        .picks{display:flex;flex-wrap:wrap;gap:8px;}
        .pick{display:inline-flex;align-items:center;gap:7px;padding:8px 14px 8px 10px;border-radius:20px;
          font-size:13px;color:#b9aeb8;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
          cursor:pointer;transition:.14s;touch-action:manipulation;user-select:none;}
        .pick ha-icon{--mdc-icon-size:16px;color:#8d8290;}
        .pick:hover{border-color:rgba(236,75,136,.5);}
        .pick.on{color:#fff;background:rgba(236,75,136,.17);border-color:rgba(236,75,136,.65);}
        .pick.on ha-icon{color:#ff8fb3;}
        .ed-hint{font-size:12px;color:#6f6675;margin-top:8px;line-height:1.5;}
        .ed-in{background:#1b1721;border:1px solid rgba(255,255,255,.1);border-radius:11px;color:#fff;
          padding:10px 13px;font:inherit;font-size:14px;outline:none;}
        .ed-in:focus{border-color:#ec4b88;}
        .ed-in.small{width:92px;text-align:center;}
        .ed-in.wide{width:100%;}
        .ed-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .ed-row .lbl{font-size:13px;color:#9a90a0;}
        .ed-foot{display:flex;gap:10px;margin-top:28px;}
        .btn{flex:1;padding:13px;border-radius:13px;border:none;font:inherit;font-size:14.5px;
          font-weight:600;cursor:pointer;transition:.15s;touch-action:manipulation;}
        .btn.pri{background:linear-gradient(90deg,#8b3dff,#ec4b88);color:#fff;}
        .btn.pri:hover{filter:brightness(1.12);}
        .btn.pri[disabled]{opacity:.45;cursor:default;filter:none;}
        .btn.sec2{background:rgba(255,255,255,.06);color:#cfc4ce;flex:0 0 auto;padding:13px 22px;}
        .btn.sec2:hover{background:rgba(255,255,255,.1);}

        /* ---- taşı popover ---- */
        .pop{position:absolute;z-index:30;background:#191521;border:1px solid rgba(255,255,255,.12);
          border-radius:15px;padding:8px;min-width:230px;box-shadow:0 20px 50px rgba(0,0,0,.6);}
        .pop-t{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7d7280;padding:7px 11px 6px;}
        .pop-item{display:flex;align-items:center;gap:9px;padding:10px 11px;border-radius:9px;font-size:14px;
          color:#e7dce6;cursor:pointer;}
        .pop-item:hover{background:rgba(236,75,136,.12);color:#ff9cc1;}
        .pop-item ha-icon{--mdc-icon-size:17px;color:#8d8290;}
        .pop-item.cur{color:#ff9cc1;}
        .pop-item.cur ha-icon{color:#ff9cc1;}
        .pop-new{display:flex;gap:6px;padding:8px 9px 9px;border-top:1px solid rgba(255,255,255,.07);margin-top:4px;}
        .pop-in{flex:1;min-width:130px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);
          border-radius:8px;color:#f0e8f0;font:inherit;font-size:13px;padding:7px 9px;outline:none;}
        .pop-in:focus{border-color:rgba(236,75,136,.55);}
        .pop-add{display:flex;align-items:center;justify-content:center;width:34px;border:none;border-radius:8px;
          background:rgba(236,75,136,.2);color:#ff9cc1;cursor:pointer;}
        .pop-add ha-icon{--mdc-icon-size:17px;}

        @media(max-width:880px){
          .wrap{padding:24px 16px 70px;}
          .layout{flex-direction:column;gap:10px;}
          .rail{width:100%;position:static;display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;
            scrollbar-width:none;}
          .rail::-webkit-scrollbar{display:none;}
          .rail-l{display:none;}
          .rr{flex:0 0 auto;padding:9px 15px;border:1px solid rgba(255,255,255,.07);border-radius:22px;}
          .rr.on::before{display:none;}
          .rr.on{background:rgba(236,75,136,.16);border-color:rgba(236,75,136,.5);}
          .rr .c{display:none;}
          .room-title{font-size:32px;}
          .addsec{margin-left:0;}
        }
      </style>
      <div class="top"><div class="topwrap">
        <div class="brand"><span class="logo"><ha-icon icon="mdi:knob"></ha-icon></span>PRESTO</div>
        <div class="status" id="status"></div>
        <div class="dt-lang" id="langsel">
          <div data-l="tr">TR</div><div data-l="en">EN</div>
        </div>
      </div></div>
      <div class="wrap">
        <div class="hero-l">Akıllı Ev · Presto</div>
        <div class="hero-h">Presto</div>
        <div class="hero-s">Zigbee butonların, dial'ların ve kumandaların burada yaşar. Soldan cihazını seç, <b>mod</b> aç, tuşlara ve dial'a ne yapacaklarını ata. Odalardaki ışıkları ve <b>ışık gruplarını</b> sürükleyip moda bırakabilirsin. Üretilen her şey gerçek HA otomasyonu olur — panel kapalıyken de çalışır. İnternet yok, bulut yok, yardımcı (helper) kurmana gerek yok.</div>
        <div class="layout">
          <div class="rail" id="rail"></div>
          <div class="stage" id="stage"></div>
        </div>
      </div>`;

    // dil seçici
    const ls = this.shadowRoot.getElementById("langsel");
    if (ls) {
      const boya = () => ls.querySelectorAll("div[data-l]").forEach((d) =>
        d.classList.toggle("on", d.dataset.l === this._lang));
      boya();
      ls.querySelectorAll("div[data-l]").forEach((d) => {
        d.onclick = () => {
          this._lang = d.dataset.l;
          try { localStorage.setItem("dialtap_lang", this._lang); } catch (e) {}
          location.reload();   // en temiz: baştan Türkçe çiz, sonra gerekiyorsa çevir
        };
      });
    }

    // İngilizce seçiliyse: DOM her değiştiğinde çeviriyi uygula (guard'lı, döngüsüz)
    this._i18nObserver = new MutationObserver(() => {
      if (this._lang !== "en") return;
      clearTimeout(this._i18nT);
      this._i18nT = setTimeout(() => {
        this._i18nObserver.disconnect();
        try { this._dtI18n(); } catch (e) {}
        this._i18nObserver.observe(this.shadowRoot, { childList: true, subtree: true });
      }, 0);
    });
    this._i18nObserver.observe(this.shadowRoot, { childList: true, subtree: true });
    this._dtI18n();
  }

  /* ---------------------------------------------- odalar-arası cihaz seçici
     membership verilirse (bir dizi, ör. sanal oda ents'i) o diziye ekler/çıkarır + kaydeder;
     yoksa this._sel (otomasyon seçimi) kullanılır. */
  _openCrossPicker(membership) {
    const has = (eid) => membership ? membership.includes(eid) : this._sel.has(eid);
    const toggle = (eid) => {
      if (membership) {
        const i = membership.indexOf(eid);
        if (i >= 0) membership.splice(i, 1); else membership.push(eid);
        this._save();
      } else {
        if (this._sel.has(eid)) this._sel.delete(eid); else this._sel.add(eid);
      }
    };
    const ov = el("div", "xp");
    const inp = el("div", "xp-in");
    ov.appendChild(inp);
    const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); this._renderStage(); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    ov.onclick = (e) => { if (e.target === ov) close(); };

    inp.appendChild(el("div", "ed-t", membership ? "Cihaz / Sensör Ekle" : "Cihaz Seç"));
    inp.appendChild(el("div", "ed-s", membership ? "Bu izleme odasına eklenecek cihazları seç — durumları burada görünür"
      : "Tüm odalardan istediğin kadar cihaz seç — otomasyonda kullanılacak"));
    const search = el("input", "set-search");
    search.placeholder = "Cihaz ara…";
    inp.appendChild(search);
    const body = el("div");
    inp.appendChild(body);

    const rooms = this._roomList();
    const render = () => {
      const q = search.value.trim().toLowerCase();
      body.innerHTML = "";
      for (const r of rooms) {
        const matches = r.ents.filter((e) => !q || (this._name(e) + " " + e).toLowerCase().includes(q));
        if (!matches.length) continue;
        const rd = el("div", "xp-room");
        const rn = el("div", "xp-rn");
        rn.appendChild(icon(r.icon));
        rn.appendChild(document.createTextNode(r.name));
        rd.appendChild(rn);
        // oda içinde cihazları KATEGORİLERE ayır (oda görünümüyle aynı GROUP_DEF)
        const chip = (eid) => {
          const p = el("div", "pick" + (has(eid) ? " on" : ""));
          p.appendChild(icon(this._entIcon(eid)));
          p.appendChild(document.createTextNode(this._name(eid)));
          p.onclick = () => { toggle(eid); p.classList.toggle("on", has(eid)); };
          return p;
        };
        const cats = GROUP_DEF.map((g) => ({ g, list: [] }));
        const diger = { g: { name: "Diğer", icon: "mdi:dots-horizontal-circle-outline" }, list: [] };
        for (const eid of matches) {
          const dom = eid.split(".")[0];
          const b = cats.find((c) => c.g.doms.includes(dom));
          (b || diger).list.push(eid);
        }
        for (const c of [...cats, diger]) {
          if (!c.list.length) continue;
          const grp = el("div", "grp");
          const gh = el("div", "grp-h");
          gh.appendChild(icon(c.g.icon));
          gh.appendChild(el("span", "gn", c.g.name));
          gh.appendChild(el("span", "gc", String(c.list.length)));
          grp.appendChild(gh);
          const flow = el("div", "picks");
          for (const eid of c.list) flow.appendChild(chip(eid));
          grp.appendChild(flow);
          rd.appendChild(grp);
        }
        body.appendChild(rd);
      }
    };
    search.oninput = render;
    render();

    const foot = el("div", "ed-foot");
    const done = el("button", "btn pri", "Tamam");
    done.onclick = close;
    foot.appendChild(done);
    inp.appendChild(foot);
    this.shadowRoot.appendChild(ov);
  }

  /* ---------------------------------------------------------- Genel görünüm */
  _renderGenel(stage) {
    stage.innerHTML = "";
    stage.appendChild(el("div", "glow"));
    const rc = this._roomCfg("__genel");
    const room = { id: "__genel", name: "Genel", icon: "mdi:vector-combine", ents: [...this._sel] };

    const head = el("div", "stage-h");
    head.appendChild(el("div", "room-title", "Genel"));
    head.appendChild(el("div", "room-meta", "Odalar-arası otomasyonlar"));
    stage.appendChild(head);

    // odalar-arası seçim kutusu
    const box = el("div", "genel-box");
    const bh = el("div", "gb-h");
    bh.appendChild(icon("mdi:cursor-default-click-outline"));
    bh.appendChild(el("span", "gt", "Seçili cihazlar"));
    box.appendChild(bh);
    box.appendChild(el("div", "gb-sub", "Farklı odalardan cihaz seç; hepsi burada toplanır, sonra aşağıya otomasyonu yaz. (Cihazlar odaların içinde durur, burada tekrar listelenmez.)"));
    const selBox = el("div", "gb-sel");
    if (!this._sel.size) selBox.appendChild(el("div", "gb-empty", "Henüz cihaz seçilmedi."));
    for (const eid of this._sel) {
      const c = el("div", "dev sel");
      c.appendChild(icon(this._entIcon(eid)));
      c.appendChild(el("span", "dn", this._name(eid)));
      const x = el("button", "dev-mv");
      x.appendChild(icon("mdi:close"));
      x.title = "Çıkar";
      x.onclick = () => { this._sel.delete(eid); this._renderStage(); };
      c.appendChild(x);
      selBox.appendChild(c);
    }
    box.appendChild(selBox);
    const add = el("button", "gb-add");
    add.appendChild(icon("mdi:plus"));
    add.appendChild(document.createTextNode("Cihaz seç (tüm odalar)"));
    add.onclick = () => this._openCrossPicker();
    box.appendChild(add);
    stage.appendChild(box);


    const wrap = el("div", "secwrap");
    stage.appendChild(wrap);
    if (rc.autos.length) {
      // KATEGORİLER: rc.autoCats=[{id,name}], her otomasyonda a.cat — 📁 ile taşınır
      if (!Array.isArray(rc.autoCats)) rc.autoCats = [];
      const catById = (id) => rc.autoCats.find((c) => c.id === id) || null;
      const bolum = (title, list, cat) => {
        const asec = el("div", "sec autos");
        const ah = el("div", "sec-h");
        ah.appendChild(el("span", "sec-name", title));
        ah.appendChild(el("span", "sec-count", String(list.length)));
        if (cat) {
          const rm = el("button", "sec-act");
          rm.appendChild(icon("mdi:trash-can-outline"));
          rm.title = "Kategoriyi sil (otomasyonlar Genel'e döner)";
          rm.onclick = () => {
            for (const a of rc.autos) if (a.cat === cat.id) a.cat = null;
            rc.autoCats = rc.autoCats.filter((c) => c !== cat);
            this._save();
            this._renderStage();
          };
          ah.appendChild(rm);
        }
        asec.appendChild(ah);
        for (const a of list) asec.appendChild(this._autoRow(room, a, rc));
        if (!list.length) asec.appendChild(el("div", "gb-empty", "Boş — otomasyon satırındaki 📁 ile buraya taşı."));
        wrap.appendChild(asec);
      };
      bolum("Genel Otomasyonlar", rc.autos.filter((a) => !catById(a.cat)), null);
      for (const c of rc.autoCats) bolum(c.name, rc.autos.filter((a) => a.cat === c.id), c);
    }
    // ---- SCRIPTLER ----
    const scripts = Object.keys(this._hass.states)
      .filter((e) => e.startsWith("script.oto_"))
      .sort((a, b) => this._name(a).localeCompare(this._name(b), "tr"));
    if (scripts.length) {
      const ssec = el("div", "sec autos scripts");
      const sh = el("div", "sec-h");
      sh.appendChild(el("span", "sec-name", "Scriptler"));
      sh.appendChild(el("span", "sec-count", String(scripts.length)));
      ssec.appendChild(sh);
      for (const eid of scripts) ssec.appendChild(this._scriptRow(eid));
      wrap.appendChild(ssec);
    }
  }

  /* ---------------------------------------------------------- SANAL (izleme) oda görünümü */
  _renderVroom(stage) {
    stage.innerHTML = "";
    stage.appendChild(el("div", "glow"));
    const v = this._curVroom();
    if (!v) { stage.appendChild(el("div", "empty", "Oda bulunamadı.")); return; }
    const rc = this._roomCfg(v.id);
    const room = { id: v.id, name: v.name, icon: v.icon || "mdi:eye-outline", ents: [...v.ents] };

    const head = el("div", "stage-h");
    head.appendChild(el("div", "room-title", v.name));
    head.appendChild(el("div", "room-meta", "İzleme odası · panele özel (HA area değil)"));
    const ren = el("button", "addsec");
    ren.style.marginLeft = "auto";
    ren.appendChild(icon("mdi:pencil-outline"));
    ren.appendChild(document.createTextNode("Yeniden adlandır"));
    ren.onclick = () => {
      const nn = (prompt("Yeni ad:", v.name) || "").trim();
      if (nn) { v.name = nn.slice(0, 30); this._save(); this._renderRail(); this._renderStage(); }
    };
    head.appendChild(ren);
    const del = el("button", "addsec");
    del.appendChild(icon("mdi:trash-can-outline"));
    del.appendChild(document.createTextNode("Odayı sil"));
    del.onclick = () => {
      if (!confirm(`"${v.name}" izleme odasını sil? (cihazlar ve otomasyonlar HA'da kalır; sadece bu grup kaldırılır)`)) return;
      this._cfg.vrooms = this._vrooms().filter((x) => x !== v);
      this._save();
      this._room = "__genel";
      this._renderRail(); this._renderStage();
    };
    head.appendChild(del);
    stage.appendChild(head);

    // ---- izlenen cihazlar/sensörler: CANLI DURUM ----
    const box = el("div", "genel-box");
    const bh = el("div", "gb-h");
    bh.appendChild(icon("mdi:eye-outline"));
    bh.appendChild(el("span", "gt", "İzlenen cihazlar"));
    box.appendChild(bh);
    box.appendChild(el("div", "gb-sub", "Eklediğin cihazların/sensörlerin canlı durumu burada görünür. HA odalarına (area) dokunulmaz. Aşağıya yazarsan bu cihazlarla otomasyon kurulur."));
    const grid = el("div", "vmon");
    if (!v.ents.filter((e) => this._hass.states[e]).length)
      grid.appendChild(el("div", "gb-empty", "Henüz cihaz eklenmedi — aşağıdan ekle."));
    for (const eid of v.ents) {
      const info = this._stateInfo(eid);
      const c = el("div", "vcard" + (info.pulse ? " pulse" : info.on ? " on" : ""));
      c.dataset.eid = eid;
      c.appendChild(icon(this._entIcon(eid)));
      const t = el("div", "vc-t");
      t.appendChild(el("div", "vc-n", this._name(eid)));
      t.appendChild(el("div", "vc-s", info.text));
      c.appendChild(t);
      const x = el("button", "dev-mv");
      x.appendChild(icon("mdi:close"));
      x.title = "İzlemeden çıkar";
      x.onclick = () => { const i = v.ents.indexOf(eid); if (i >= 0) v.ents.splice(i, 1); this._save(); this._renderRail(); this._renderStage(); };
      c.appendChild(x);
      grid.appendChild(c);
    }
    box.appendChild(grid);
    const add = el("button", "gb-add");
    add.appendChild(icon("mdi:plus"));
    add.appendChild(document.createTextNode("Cihaz / sensör ekle"));
    add.onclick = () => this._openCrossPicker(v.ents);
    box.appendChild(add);
    stage.appendChild(box);


    // ---- otomasyonlar (Genel ile aynı) ----
    const wrap = el("div", "secwrap");
    stage.appendChild(wrap);
    if (rc.autos.length) {
      const asec = el("div", "sec autos");
      const ah = el("div", "sec-h");
      ah.appendChild(el("span", "sec-name", "Otomasyonlar"));
      ah.appendChild(el("span", "sec-count", String(rc.autos.length)));
      asec.appendChild(ah);
      for (const a of rc.autos) asec.appendChild(this._autoRow(room, a, rc));
      wrap.appendChild(asec);
    }
  }

  /* script satırı: dokun→seç · çalıştır · HA'da aç · sil */
  _scriptRow(eid) {
    const sel = this._sel.has(eid);
    const row = el("div", "auto" + (sel ? " selx" : ""));
    const ic = el("div", "auto-ic");
    ic.appendChild(icon("mdi:script-text-outline"));
    row.appendChild(ic);
    const b = el("div", "auto-b");
    b.style.cursor = "pointer";
    b.title = sel ? "Seçimi kaldır" : "Seç — bir tuşa atarken kullanılır";
    b.appendChild(el("div", "auto-n", this._name(eid)));
    b.appendChild(el("div", "auto-s", sel ? "✓ seçildi — editörde tuşa atayabilirsin" : "Script — dokun → seç, ya da ▶ ile çalıştır"));
    b.onclick = () => {
      if (this._sel.has(eid)) this._sel.delete(eid); else this._sel.add(eid);
      this._renderStage();
    };
    row.appendChild(b);

    const run = el("button", "auto-act");
    run.appendChild(icon("mdi:play"));
    run.title = "Şimdi çalıştır";
    run.onclick = async () => {
      try { await this._hass.callService("script", "turn_on", { entity_id: eid }); this._flash("Çalıştırıldı: " + this._name(eid)); }
      catch (e) { this._flash("Çalıştırılamadı", true); }
    };
    row.appendChild(run);

    const haEd = el("button", "auto-act");
    haEd.appendChild(icon("mdi:home-assistant"));
    haEd.title = "HA script editöründe aç";
    haEd.onclick = () => this._goHA("/config/script/edit/" + eid.slice(7));
    row.appendChild(haEd);

    const del = el("button", "auto-act");
    del.appendChild(icon("mdi:trash-can-outline"));
    del.title = "Sil";
    del.onclick = async () => {
      try {
        await this._hass.callApi("DELETE", "config/script/config/" + eid.slice(7));
        this._sel.delete(eid);
        this._flash("Script silindi");
      } catch (e) { this._flash("Silinemedi (YAML'da elle tanımlı olabilir)", true); }
      this._renderStage();
    };
    row.appendChild(del);
    return row;
  }

  /* ---------------------------------------------------------- ray */
  _renderRail() {
    const rail = this.shadowRoot.getElementById("rail");
    if (!rail) return;
    const rooms = this._roomList();
    // geçerli oda id'si mi? (Genel + gerçek odalar + SANAL izleme odaları)
    const gecerli = (id) => id === "__genel" || (typeof id === "string" && id.startsWith("__dt_"))
      || rooms.some((r) => r.id === id) || this._vrooms().some((v) => v.id === id);
    if (!gecerli(this._room)) {
      // refresh sonrası: en son bulunulan odayı hatırla (yoksa ilk oda)
      let saved = null;
      try { saved = localStorage.getItem("dialtap_last_room"); } catch (e) { saved = null; }
      if (saved && gecerli(saved)) this._room = saved;
      else this._room = rooms.length ? rooms[0].id : "__genel";
    }
    rail.innerHTML = "";
    const go = (id) => { this._room = id; try { localStorage.setItem("dialtap_last_room", id); } catch (e) {} this._sel.clear(); this._roomQuery = ""; this._editA = null; this._dtSlot = null; this._dtModeId = null; this._closePop(); this._renderRail(); this._renderStage(); };
    // Genel (odalar-arası) — en üstte, ayrı
    const gr = el("div", "rr" + (this._room === "__genel" ? " on" : ""));
    gr.appendChild(icon("mdi:vector-combine"));
    gr.appendChild(el("span", "n", "Genel"));
    gr.onclick = () => go("__genel");
    rail.appendChild(gr);

    // ---- Cihazlar (otomatik keşif): Tap Dial + Dimmer/Anahtar ----
    const tumu = this._dtDevices();
    const dials = tumu.filter((d) => d.type !== "dimmer");
    const dimmers = tumu.filter((d) => d.type === "dimmer");
    const cihazSatiri = (d, baslik) => {
      const did = "__dt_" + d.key;
      const secili = did === this._room;
      const dr = el("div", "rr" + (secili ? " on" : ""));
      dr.appendChild(icon(d.type === "dimmer" ? "mdi:light-switch" : "mdi:knob"));
      dr.appendChild(el("span", "n", d.name));
      dr.appendChild(el("span", "c", String(this._dtModeCount(d.key))));
      if (d.manual) { const x = el("span", "dt-mandel"); x.appendChild(icon("mdi:delete")); x.title = "Manuel cihazı kaldır"; x.onclick = (e) => { e.stopPropagation(); this._dtRemoveManual(d); }; dr.appendChild(x); }
      dr.onclick = () => go(did);
      rail.appendChild(dr);

      // ---- bu cihazın modları: Mod 1 / Mod 2 + ekleme ----
      const dcRec = (this._cfg.devices || {})[d.key];
      const modlar = (dcRec && Array.isArray(dcRec.modes)) ? dcRec.modes : [];
      const modEnt = this._dtModeEntity(d.key);
      const aktifAd = modEnt && this._hass.states[modEnt] ? this._hass.states[modEnt].state : null;
      modlar.forEach((m, i) => {
        const mr = el("div", "rr rmode" + (secili && this._dtModeId === m.id ? " on" : ""));
        mr.appendChild(el("span", "dt-dot" + (aktifAd === m.name ? " live" : "")));
        mr.appendChild(el("span", "n", `Mod ${i + 1} · ${m.name}`));
        mr.onclick = () => {
          this._room = did;
          try { localStorage.setItem("dialtap_last_room", did); } catch (e) {}
          this._dtModeId = m.id; this._dtSlot = null;
          this._closePop(); this._renderRail(); this._renderStage();
        };
        // odalardan ışık/grup sürükleyip bu modun havuzuna bırakabilirsin
        this._railDrop(mr, "mode", d.key + "|" + m.id, `Mod ${i + 1} · ${m.name}`);
        rail.appendChild(mr);
      });
      if (modlar.length < DT_MAX_MODE) {
        const am = el("div", "rr rmode addmode");
        am.appendChild(icon("mdi:plus"));
        am.appendChild(el("span", "n", "Mod ekle"));
        am.onclick = () => {
          this._room = did; this._dtSlot = null;
          this._renderRail();
          this._dtAddMode(this._dtCfg(d.key));
        };
        rail.appendChild(am);
      }
    };

    rail.appendChild(el("div", "rail-l", "Presto"));
    if (!dials.length) rail.appendChild(el("div", "empty", "Tap Dial bulunamadı."));
    for (const d of dials) cihazSatiri(d);

    if (dimmers.length) {
      rail.appendChild(el("div", "rail-l", "Dimmer / Anahtar"));
      for (const d of dimmers) cihazSatiri(d);
    }

    rail.appendChild(el("div", "rail-l", "Odalar"));
    for (const r of rooms) {
      const row = el("div", "rr" + (r.id === this._room ? " on" : ""));
      row.appendChild(icon(r.icon));
      row.appendChild(el("span", "n", r.name));
      row.appendChild(el("span", "c", String(r.ents.length)));
      row.onclick = () => go(r.id);
      this._railDrop(row, "room", r.id, r.name);   // sürükle-bırak → HA area değişir (Diğer → area temizlenir)
      rail.appendChild(row);
    }
    if (!rooms.length)
      rail.appendChild(el("div", "empty", "HA'da alan (oda) bulunamadı."));
  }

  /* yeni sanal (izleme) oda ekle — sadece panelde yaşar, HA area OLUŞTURMAZ */
  _addVroom() {
    const name = (prompt("İzleme odası adı (ör. Sensörlerim):") || "").trim();
    if (!name) return;
    const v = { id: "__v_" + uid(), name: name.slice(0, 30), icon: "mdi:eye-outline", ents: [] };
    this._vrooms().push(v);
    this._save();
    this._room = v.id;
    try { localStorage.setItem("dialtap_last_room", v.id); } catch (e) {}
    this._renderRail();
    this._renderStage();
  }

  /* ---------------------------------------------------------- sahne */
  _renderStage() {
    const stage = this.shadowRoot.getElementById("stage");
    if (!stage) return;
    if (this._room === "__genel") { this._renderGenel(stage); return; }
    if (this._room && this._room.startsWith("__v_")) { this._renderVroom(stage); return; }
    if (this._room && this._room.startsWith("__dt_")) { this._renderDialTap(stage, this._room.slice(5)); return; }
    stage.innerHTML = "";
    const rooms = this._roomList();
    const room = rooms.find((r) => r.id === this._room);
    if (!room) {
      stage.appendChild(el("div", "empty", "Oda seç — cihazlar burada görünecek."));
      return;
    }
    stage.appendChild(el("div", "glow"));

    const rc = this._roomCfg(room.id);
    const assigned = new Set();
    for (const s of rc.sections) for (const e of (s.entities || [])) assigned.add(e);
    // odadan kalkmış cihazları bölümlerden temizle (sessiz bakım)
    const inRoom = new Set(room.ents);
    let dirty = false;
    for (const s of rc.sections) {
      const before = (s.entities || []).length;
      s.entities = (s.entities || []).filter((e) => inRoom.has(e));
      if (s.entities.length !== before) dirty = true;
    }
    if (dirty) this._save();

    // özet: "6 ışık · 2 sensör · 1 iklim"
    const cnt = {};
    for (const e of room.ents) { const d = e.split(".")[0]; cnt[d] = (cnt[d] || 0) + 1; }
    const meta = DOM_ORDER.filter((d) => cnt[d])
      .map((d) => `<b>${cnt[d]}</b> ${DOM_META[d].label}`).join(" · ");

    const head = el("div", "stage-h");
    head.appendChild(el("div", "room-title", room.name));
    head.appendChild(el("div", "room-meta", meta));
    const ref = el("button", "addsec");
    ref.style.marginLeft = "auto";
    ref.title = "Cihaz listesini yenile (yeni eklenenler gelsin)";
    ref.appendChild(icon("mdi:refresh"));
    ref.onclick = () => { this._renderRail(); this._renderStage(); this._flash("Yenilendi"); };
    head.appendChild(ref);
    const addA = el("button", "addauto");
    addA.appendChild(icon("mdi:auto-fix"));
    addA.appendChild(document.createTextNode("Otomasyon"));
    addA.onclick = () => this._openAutoEditor(room, rc, null);
    head.appendChild(addA);
    const add = el("button", "addsec");
    add.style.marginLeft = "0";
    add.appendChild(icon("mdi:plus"));
    add.appendChild(document.createTextNode("Bölüm"));
    add.onclick = () => this._addSection(room.id);
    head.appendChild(add);
    stage.appendChild(head);

    // ---- arama (özellikle Diğer gibi kalabalık odalarda cihaz bul) ----
    const si = el("input", "set-search roomsearch");
    si.placeholder = "Bu odada ara… (isim ya da entity_id, ör. binary_sensor.genel)";
    si.value = this._roomQuery || "";
    const applyFilter = () => {
      const q = (this._roomQuery || "").trim().toLowerCase();
      stage.querySelectorAll(".dev").forEach((d) => {
        const eid = d.dataset.eid || "";
        d.style.display = (!q || (this._name(eid) + " " + eid).toLowerCase().includes(q)) ? "" : "none";
      });
      stage.querySelectorAll(".grp").forEach((g) => {
        const vis = [...g.querySelectorAll(".dev")].some((d) => d.style.display !== "none");
        g.style.display = (!q || vis) ? "" : "none";
      });
    };
    si.oninput = () => { this._roomQuery = si.value; applyFilter(); };
    stage.appendChild(si);


    const wrap = el("div", "secwrap");
    stage.appendChild(wrap);

    // ---- otomasyonlar ----
    if (rc.autos.length) {
      const asec = el("div", "sec autos");
      const ah = el("div", "sec-h");
      ah.appendChild(el("span", "sec-name", "Otomasyonlar"));
      ah.appendChild(el("span", "sec-count", String(rc.autos.length)));
      asec.appendChild(ah);
      for (const a of rc.autos) asec.appendChild(this._autoRow(room, a, rc));
      wrap.appendChild(asec);
    }

    for (const s of rc.sections)
      wrap.appendChild(this._sectionEl(room, s, rc));

    // bölümsüz cihazlar
    const rest = room.ents.filter((e) => !assigned.has(e));
    if (rest.length || !rc.sections.length) {
      const un = el("div", "sec unassigned");
      const h = el("div", "sec-h");
      h.appendChild(el("span", "sec-name", rc.sections.length ? "Bölümsüz" : "Cihazlar"));
      h.appendChild(el("span", "sec-count", String(rest.length)));
      un.appendChild(h);
      if (!rest.length) un.appendChild(el("div", "empty", "Tüm cihazlar bölümlere dağıtıldı. ✓ (Bölümden çıkarmak için chip'i buraya sürükle.)"));
      un.appendChild(this._groupedFlow(room, rest, rc));
      this._dropTarget(un, room, rc, null);
      wrap.appendChild(un);
    }
    applyFilter();   // mevcut arama sorgusunu render sonrası uygula
  }

  _sectionEl(room, s, rc) {
    const sec = el("div", "sec");
    const h = el("div", "sec-h");
    const nameEl = el("span", "sec-name", s.name);
    h.appendChild(nameEl);
    h.appendChild(el("span", "sec-count", String((s.entities || []).length)));
    const ren = el("button", "sec-act");
    ren.appendChild(icon("mdi:pencil-outline"));
    ren.title = "Yeniden adlandır";
    ren.onclick = () => {
      const inp = el("input", "sec-in");
      inp.value = s.name;
      h.replaceChild(inp, nameEl);
      inp.focus(); inp.select();
      const done = () => {
        const v = inp.value.trim();
        if (v) { s.name = v; this._save(); }
        this._renderStage();
      };
      inp.onkeydown = (e) => { if (e.key === "Enter") done(); if (e.key === "Escape") this._renderStage(); };
      inp.onblur = done;
    };
    h.appendChild(ren);
    const del = el("button", "sec-act");
    del.appendChild(icon("mdi:trash-can-outline"));
    del.title = "Bölümü sil (cihazlar bölümsüze döner)";
    del.onclick = () => {
      rc.sections = rc.sections.filter((x) => x !== s);
      this._save();
      this._flash("Bölüm silindi");
      this._renderStage();
    };
    h.appendChild(del);
    sec.appendChild(h);
    const flow = el("div", "devflow");
    for (const eid of (s.entities || [])) {
      if (this._hass.states[eid] || this._hass.entities[eid]) flow.appendChild(this._devEl(room, eid, rc));
    }
    if (!(s.entities || []).length)
      sec.appendChild(el("div", "empty", "Boş bölüm — aşağıdaki cihazı <b>sürükleyip buraya bırak</b> (ya da chip'teki klasör ikonuyla taşı)."));
    sec.appendChild(flow);
    this._dropTarget(sec, room, rc, s);
    return sec;
  }

  _addSection(roomId) {
    const rc = this._roomCfg(roomId);
    const stage = this.shadowRoot.getElementById("stage");
    // yeni bölümü inline isimle ekle
    const s = { id: uid(), name: "", entities: [] };
    rc.sections.push(s);
    this._renderStage();
    // yeni bölümün adını hemen düzenlemeye aç
    const secs = stage.querySelectorAll(".sec:not(.unassigned)");
    const last = secs[secs.length - 1];
    if (!last) return;
    const h = last.querySelector(".sec-h");
    const nameEl = h.querySelector(".sec-name");
    const inp = el("input", "sec-in");
    inp.placeholder = "Bölüm adı (ör. TV)";
    h.replaceChild(inp, nameEl);
    inp.focus();
    const done = () => {
      const v = inp.value.trim();
      if (v) { s.name = v; this._save(); }
      else rc.sections = rc.sections.filter((x) => x !== s);
      this._renderStage();
    };
    inp.onkeydown = (e) => { if (e.key === "Enter") done(); if (e.key === "Escape") { rc.sections = rc.sections.filter((x) => x !== s); this._renderStage(); } };
    inp.onblur = done;
  }

  /* --- MEDYA SES YETENEKLERİ (HA supported_features bit maskesi) ---
     VOLUME_SET = 4, VOLUME_STEP = 1024. Berkan'ın Echo'ları SET destekliyor
     ama STEP desteklemiyor — ikisini ayrı ayrı üretmek zorundayız, yoksa
     volume_up o cihazlarda sessizce çalışmaz. */
  _dtFeat(eid) {
    const s = this._hass.states[eid];
    return (s && s.attributes && s.attributes.supported_features) || 0;
  }
  _dtSesVar(eid) { return eid.startsWith("media_player.") && !!(this._dtFeat(eid) & (4 | 1024)); }
  _dtSesStep(eid) { return !!(this._dtFeat(eid) & 1024); }

  /* Bu ışık bir GRUP mu? (Hue oda/zone grubu ya da HA ışık grubu)
     Ayırt edici: attributes.entity_id = içindeki ışıkların listesi. */
  _isLightGroup(eid) {
    if (!eid.startsWith("light.")) return false;
    const s = this._hass.states[eid];
    const içi = s && s.attributes ? s.attributes.entity_id : null;
    return Array.isArray(içi) && içi.length > 0;
  }

  /* cihazları sınıflara ayrılmış kompakt akış olarak çiz */
  _groupedFlow(room, ents, rc) {
    const box = el("div");
    for (const g of GROUP_DEF) {
      let list = ents.filter((e) => g.doms.includes(e.split(".")[0]));
      // Işıklar bölümünden grupları ayır — kendi bölümlerinde gösterilecekler
      if (g.key === "isik") list = list.filter((e) => !this._isLightGroup(e));
      if (g.key === "isikgrup") list = ents.filter((e) => this._isLightGroup(e));
      if (!list.length) continue;
      const grp = el("div", "grp");
      const h = el("div", "grp-h");
      h.appendChild(icon(g.icon));
      h.appendChild(el("span", "gn", g.name));
      h.appendChild(el("span", "gc", String(list.length)));
      grp.appendChild(h);
      const flow = el("div", "devflow");
      for (const eid of list) flow.appendChild(this._devEl(room, eid, rc));
      grp.appendChild(flow);
      box.appendChild(grp);
    }
    return box;
  }

  _devEl(room, eid, rc) {
    const info = this._stateInfo(eid);
    const d = el("div", "dev" + (info.pulse ? " pulse" : info.on ? " on" : "")
      + (this._sel.has(eid) ? " sel" : ""));
    d.dataset.eid = eid;
    d.title = eid;   // entity_id tooltip'te (arama da eid ile çalışır)
    d.appendChild(icon(this._entIcon(eid)));
    d.appendChild(el("span", "dn", this._name(eid)));
    d.appendChild(el("span", "dot"));
    d.appendChild(el("span", "ds", info.text));
    // bilgi — HA more-info penceresini aç
    const inf = el("button", "dev-mv");
    inf.appendChild(icon("mdi:information-outline"));
    inf.title = "Bilgi / kontrol (HA)";
    inf.onclick = (ev) => {
      ev.stopPropagation();
      this.dispatchEvent(new CustomEvent("hass-more-info",
        { bubbles: true, composed: true, detail: { entityId: eid } }));
    };
    inf.draggable = true;
    inf.ondragstart = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
    d.appendChild(inf);
    // bölüme taşı — chip ucundaki küçük klasör
    const mv = el("button", "dev-mv");
    mv.appendChild(icon("mdi:folder-move-outline"));
    mv.title = "Bölüme taşı";
    mv.onclick = (ev) => { ev.stopPropagation(); this._openMove(ev, d, room, eid, rc); };
    d.appendChild(mv);
    // dokun = MOR seç
    d.onclick = () => {
      if (this._sel.has(eid)) this._sel.delete(eid); else this._sel.add(eid);
      d.classList.toggle("sel", this._sel.has(eid));
      this._refreshSelRow();
    };
    // sürükle → bölüme bırak
    d.draggable = true;
    d.ondragstart = (ev) => {
      ev.dataTransfer.setData("text/plain", eid);
      ev.dataTransfer.effectAllowed = "move";
      d.classList.add("drag");
    };
    d.ondragend = () => d.classList.remove("drag");
    return d;
  }

  /* bir bölümü (ya da Bölümsüz'ü) bırakma hedefi yap */
  _dropTarget(secEl, room, rc, target) {
    secEl.ondragover = (ev) => { ev.preventDefault(); ev.dataTransfer.dropEffect = "move"; secEl.classList.add("dropok"); };
    secEl.ondragleave = (ev) => { if (!secEl.contains(ev.relatedTarget)) secEl.classList.remove("dropok"); };
    secEl.ondrop = (ev) => {
      ev.preventDefault();
      secEl.classList.remove("dropok");
      const eid = ev.dataTransfer.getData("text/plain");
      if (!eid || !this._hass.states[eid]) return;
      for (const s of rc.sections) s.entities = (s.entities || []).filter((x) => x !== eid);
      if (target) (target.entities = target.entities || []).push(eid);
      this._save();
      this._flash(target ? `→ ${target.name}` : "Bölümden çıkarıldı");
      this._renderStage();
    };
  }

  /* sol menüdeki odaya/izleme odasına cihaz sürükle-bırak.
     kind="room" -> HA area DEĞİŞİR (resmi oda). kind="vroom" -> sadece izleme odasına eklenir (HA'ya dokunmaz). */
  _railDrop(rowEl, kind, id, name) {
    rowEl.ondragover = (ev) => { ev.preventDefault(); ev.dataTransfer.dropEffect = "move"; rowEl.classList.add("raildrop"); };
    rowEl.ondragleave = (ev) => { if (!rowEl.contains(ev.relatedTarget)) rowEl.classList.remove("raildrop"); };
    rowEl.ondrop = async (ev) => {
      ev.preventDefault();
      rowEl.classList.remove("raildrop");
      const eid = ev.dataTransfer.getData("text/plain");
      if (!eid || (!this._hass.states[eid] && !this._hass.entities[eid])) return;
      if (kind === "mode") {
        // id = "<cihazKey>|<modId>" — ışığı/grubu o modun havuzuna at
        const [devKey, modId] = String(id).split("|");
        const dcRec = (this._cfg.devices || {})[devKey];
        const m = dcRec && (dcRec.modes || []).find((x) => x.id === modId);
        if (!m) return;
        if (!Array.isArray(m.pool)) m.pool = [];
        if (!m.pool.includes(eid)) { m.pool.push(eid); this._save(); }
        this._room = "__dt_" + devKey;
        this._dtModeId = modId;
        this._flash(`${this._name(eid)} → ${name}`);
        this._renderRail(); this._renderStage();
      } else if (kind === "vroom") {
        const v = this._vrooms().find((x) => x.id === id);
        if (v && !v.ents.includes(eid)) { v.ents.push(eid); this._save(); }
        this._flash(`→ ${name} (izleme odası)`);
        this._renderRail(); this._renderStage();
      } else {
        const areaId = id === "__none" ? null : id;   // Diğer'e bırakma = alanı kaldır
        try {
          await this._hass.callWS({ type: "config/entity_registry/update", entity_id: eid, area_id: areaId });
          this._flash(areaId ? `→ ${name} · HA odası da değişti` : "Alan kaldırıldı (Diğer)");
        } catch (e) { this._flash("Oda değiştirilemedi (yetki?)", true); return; }
        // bölümlerden temizle + HA güncellemesi yayılınca yenile
        this._renderRail(); this._renderStage();
        setTimeout(() => { this._renderRail(); this._renderStage(); }, 1200);
      }
    };
  }

  /* cihaza dokun → bölüme taşı popover'ı */
  _openMove(ev, chip, room, eid, rc) {
    this._closePop();
    const stage = this.shadowRoot.getElementById("stage");
    const pop = el("div", "pop");
    pop.appendChild(el("div", "pop-t", this._name(eid)));
    const cur = rc.sections.find((s) => (s.entities || []).includes(eid));
    const move = (target) => {
      for (const s of rc.sections) s.entities = (s.entities || []).filter((x) => x !== eid);
      if (target) (target.entities = target.entities || []).push(eid);
      this._save();
      this._closePop();
      this._renderStage();
    };
    for (const s of rc.sections) {
      if (!s.name) continue;
      const it = el("div", "pop-item" + (s === cur ? " cur" : ""));
      it.appendChild(icon(s === cur ? "mdi:check" : "mdi:arrow-right-thin"));
      it.appendChild(document.createTextNode(s.name));
      it.onclick = () => move(s === cur ? null : s);
      pop.appendChild(it);
    }
    if (cur) {
      const it = el("div", "pop-item");
      it.appendChild(icon("mdi:undo-variant"));
      it.appendChild(document.createTextNode("Bölümsüze al"));
      it.onclick = () => move(null);
      pop.appendChild(it);
    }
    if (!rc.sections.filter((s) => s.name).length)
      pop.appendChild(el("div", "pop-t", "Önce sağ üstten “+ Bölüm” ekle"));

    stage.appendChild(pop);
    const sr = stage.getBoundingClientRect();
    const cr = chip.getBoundingClientRect();
    let left = cr.left - sr.left;
    const maxLeft = stage.clientWidth - pop.offsetWidth - 4;
    if (left > maxLeft) left = Math.max(0, maxLeft);
    pop.style.left = left + "px";
    pop.style.top = (cr.bottom - sr.top + 8) + "px";

    const close = (e) => {
      if (pop.contains(e.composedPath ? e.composedPath()[0] : e.target)) return;
      this._closePop();
    };
    setTimeout(() => document.addEventListener("click", close, true), 0);
    this._popCloser = () => { document.removeEventListener("click", close, true); pop.remove(); };
    ev.stopPropagation();
  }

  _closePop() {
    if (this._popCloser) { this._popCloser(); this._popCloser = null; }
  }

  /* otomasyon satırındaki 📁 → kategoriye taşı popover'ı (Genel; yeni kategori de açılır) */
  _openAutoCat(ev, anchor, a, rc) {
    this._closePop();
    if (!Array.isArray(rc.autoCats)) rc.autoCats = [];
    const stage = this.shadowRoot.getElementById("stage");
    const pop = el("div", "pop");
    pop.appendChild(el("div", "pop-t", "Kategoriye taşı"));
    const move = (catId) => { a.cat = catId; this._save(); this._closePop(); this._renderStage(); };
    for (const c of rc.autoCats) {
      const it = el("div", "pop-item" + (a.cat === c.id ? " cur" : ""));
      it.appendChild(icon(a.cat === c.id ? "mdi:check" : "mdi:arrow-right-thin"));
      it.appendChild(document.createTextNode(c.name));
      it.onclick = () => move(a.cat === c.id ? null : c.id);
      pop.appendChild(it);
    }
    if (a.cat) {
      const geri = el("div", "pop-item");
      geri.appendChild(icon("mdi:undo-variant"));
      geri.appendChild(document.createTextNode("Genel'e al"));
      geri.onclick = () => move(null);
      pop.appendChild(geri);
    }
    const nr = el("div", "pop-new");
    const inp = el("input", "pop-in");
    inp.placeholder = "Yeni kategori…";
    const add = el("button", "pop-add");
    add.appendChild(icon("mdi:plus"));
    add.title = "Kategori aç ve bu otomasyonu taşı";
    const yap = () => {
      const v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      const c = { id: uid(), name: v.slice(0, 30) };
      rc.autoCats.push(c);
      move(c.id);
    };
    add.onclick = yap;
    inp.onkeydown = (e) => { if (e.key === "Enter") yap(); e.stopPropagation(); };
    inp.onclick = (e) => e.stopPropagation();
    nr.appendChild(inp);
    nr.appendChild(add);
    pop.appendChild(nr);

    stage.appendChild(pop);
    const sr = stage.getBoundingClientRect();
    const cr = anchor.getBoundingClientRect();
    let left = cr.left - sr.left;
    const maxLeft = stage.clientWidth - pop.offsetWidth - 4;
    if (left > maxLeft) left = Math.max(0, maxLeft);
    pop.style.left = left + "px";
    pop.style.top = (cr.bottom - sr.top + 8) + "px";
    const close = (e) => {
      if (pop.contains(e.composedPath ? e.composedPath()[0] : e.target)) return;
      this._closePop();
    };
    setTimeout(() => document.addEventListener("click", close, true), 0);
    this._popCloser = () => { document.removeEventListener("click", close, true); pop.remove(); };
    ev.stopPropagation();
    setTimeout(() => inp.focus(), 50);
  }


  _refreshSelRow() {
    const row = this.shadowRoot.getElementById("selrow");
    if (!row) return;
    row.innerHTML = "";
    if (!this._sel.size) {
      row.appendChild(el("span", "cmp-hint", "İpucu: cihaza dokun → <b>mor</b> seçilir."));
      return;
    }
    for (const eid of this._sel) {
      const c = el("span", "cmp-selchip");
      c.appendChild(icon(this._entIcon(eid)));
      c.appendChild(document.createTextNode(this._name(eid)));
      row.appendChild(c);
    }
  }

  _fmtDur(sec) {
    if (!sec) return "hemen";
    if (sec % 60 === 0) return (sec / 60) + " dk";
    return sec + " sn";
  }

  _autoSummary(a) {
    if (a.freeform) return "✦ " + (esc(a.summary) || esc(this._haAutoName(a) || a.name)) + ` <i>(${this._L("serbest mod", "free mode")})</i>`;
    const names = (ids) => ids.map((e) => `<b>${this._name(e)}</b>`).join(", ");
    let s = `${names(a.on)} algılayınca → ${names(a.lights)} <i>aç</i>`;
    if (a.off) {
      const offL = (a.off_lights && a.off_lights.length) ? ` ${names(a.off_lights)}` : "";
      s += ` · <b>${this._name(a.off)}</b> ${this._fmtDur(a.delay)} boş kalınca${offL} <i>kapat</i>`;
    }
    if (a.cond === "lux") s += ` · sadece karanlıkken (&lt;${a.lux_below} lx)`;
    if (a.cond === "sun") s += " · sadece güneş battıktan sonra";
    if (a.cond === "time") s += ` · sadece ${a.after}–${a.before}`;
    if (a.guard && a.guard.entity)
      s += ` · <b>${this._name(a.guard.entity)}</b> ${(a.guard.blocked || []).join("/")} iken <i>açılmaz</i>`;
    return s;
  }

  /* HA'da otomasyonun CANLI adı — kullanıcı HA otomasyon editöründen adı değiştirdiyse
     panel de onu göstersin. Entity, attributes.id === "oto_<a.id>" ile bulunur.
     Panelin yazdığı "[Oto] Oda — Ad" öneki temizlenir. Bulunamazsa null. */
  _haAutoName(a) {
    if (!this._hass || !a || a.id == null) return null;
    const uid = "oto_" + a.id;
    for (const eid in this._hass.states) {
      if (!eid.startsWith("automation.")) continue;
      const st = this._hass.states[eid];
      if (st && st.attributes && st.attributes.id === uid) {
        const fn = (st.attributes.friendly_name || "").trim();
        if (!fn) return null;
        const m = fn.match(/^\[[^\]]+\]\s*.*?—\s*(.+)$/);   // "[Presto] Oda — Ad" -> "Ad"
        return ((m ? m[1] : fn).trim()) || null;
      }
    }
    return null;
  }

  _autoRow(room, a, rc) {
    const aeid = "automation.oto_" + a.id;
    const asel = this._sel.has(aeid);
    const row = el("div", "auto" + (a.enabled ? "" : " paused") + (asel ? " selx" : ""));
    const ic = el("div", "auto-ic");
    ic.appendChild(icon(a.enabled ? "mdi:motion-sensor" : "mdi:pause"));
    row.appendChild(ic);
    const b = el("div", "auto-b");
    b.style.cursor = "pointer";
    b.title = asel ? "Seçimi kaldır" : "Seç";
    b.appendChild(el("div", "auto-n", this._haAutoName(a) || a.name));
    b.appendChild(el("div", "auto-s", asel ? "✓ seçildi" : this._autoSummary(a)));
    b.onclick = () => {
      if (this._sel.has(aeid)) this._sel.delete(aeid); else this._sel.add(aeid);
      this._renderStage();
    };
    row.appendChild(b);

    const tgl = el("div", "tgl" + (a.enabled ? " on" : ""));
    tgl.appendChild(el("span", "k"));
    tgl.title = a.enabled ? "Duraklat (HA'dan kaldırılır, tanım kalır)" : "Sürdür";
    tgl.onclick = async () => {
      try {
        if (a.enabled) { await this._removeAutoHA(a); a.enabled = false; this._flash("Duraklatıldı"); }
        else { await this._pushAuto(room, a); a.enabled = true; this._flash("Çalışıyor"); }
        this._save();
      } catch (e) { this._flash("HA'ya yazılamadı", true); }
      this._renderStage();
    };
    row.appendChild(tgl);

    const ed = el("button", "auto-act");
    ed.appendChild(icon("mdi:pencil-outline"));
    ed.title = "Düzenle";
    ed.onclick = () => this._openAutoEditor(room, rc, a);
    row.appendChild(ed);

    if (room.id === "__genel") {
      const mv = el("button", "auto-act");
      mv.appendChild(icon("mdi:folder-move-outline"));
      mv.title = "Kategoriye taşı";
      mv.onclick = (ev) => this._openAutoCat(ev, mv, a, rc);
      row.appendChild(mv);
    }

    const haEd = el("button", "auto-act");
    haEd.appendChild(icon("mdi:home-assistant"));
    haEd.title = "HA otomasyon editöründe aç (ham YAML)";
    haEd.onclick = () => this._openInHA(a);
    row.appendChild(haEd);

    const del = el("button", "auto-act");
    del.appendChild(icon("mdi:trash-can-outline"));
    del.title = "Sil";
    del.onclick = async () => {
      try { await this._removeAutoHA(a); } catch (e) { /* zaten yoksa sorun değil */ }
      rc.autos = rc.autos.filter((x) => x !== a);
      this._save();
      this._flash("Otomasyon silindi");
      this._renderStage();
    };
    row.appendChild(del);
    return row;
  }

  /* ==================================================== PRESTO */

  /* --- cihaz keşfi: z2m ve Hue Bridge yollarını ayırt eder ---
     Hue  : event.<p>_rotary  (event_types = clock_wise / counter_clock_wise)
     Z2M  : sensor.<p>_action_step_size  (RDM002'ye özgü expose)
     İsme/dile BAKILMAZ — HACS'te başka dillerde de çalışsın diye. */
  _dtDevices() {
    const h = this._hass;
    if (!h) return [];
    const out = [];
    const st = h.states || {};

    for (const [eid, s] of Object.entries(st)) {
      const a = s.attributes || {};

      // --- Hue Bridge yolu ---
      if (eid.startsWith("event.") && eid.endsWith("_rotary")) {
        const et = a.event_types || [];
        if (et.includes("clock_wise") && et.includes("counter_clock_wise")) {
          const p = eid.slice(6, -7);
          const buttons = {};
          let n = 0;
          for (let i = 1; i <= 4; i++) {
            const be = `event.${p}_button_${i}`;
            if (st[be]) { buttons[i] = be; n++; }
          }
          if (n === 4) {
            out.push({
              key: eid, path: "hue", type: "dial", buttons, dialEntity: eid,
              name: this._dtStripName(a.friendly_name || p, "Rotary"),
              battery: st[`sensor.${p}_battery`] ? `sensor.${p}_battery` : null,
            });
          }
        }
        continue;
      }

      // --- Hue Dimmer / Akıllı Anahtar (4 tuş, dial YOK) ---
      // İmza: event.<p>_button_1..4 var, ama event.<p>_rotary YOK (o tap dial olurdu).
      if (eid.startsWith("event.") && eid.endsWith("_button_1")) {
        const p = eid.slice(6, -9);
        if (st[`event.${p}_rotary`]) continue;   // tap dial, dimmer değil
        const buttons = {};
        let n = 0;
        for (let i = 1; i <= 4; i++) {
          const be = `event.${p}_button_${i}`;
          if (st[be]) { buttons[i] = be; n++; }
        }
        if (n >= 2) {   // dimmer 4, akıllı buton 1 (min 2 tuş → dimmer say)
          out.push({
            key: eid.slice(0, -9), path: "hue", type: "dimmer", buttons, btnCount: n,
            name: this._dtStripName(a.friendly_name || p, "Button 1"),
            battery: st[`sensor.${p}_battery`] ? `sensor.${p}_battery` : null,
          });
        }
        continue;
      }

      // --- Zigbee2MQTT yolu ---
      if (eid.startsWith("sensor.") && eid.endsWith("_action_step_size")) {
        const p = eid.slice(7, -17);
        const ent = (h.entities || {})[eid];
        const devId = ent && ent.device_id ? ent.device_id : null;
        out.push({
          key: eid, path: "z2m", type: "dial", device_id: devId, buttons: { 1: 1, 2: 2, 3: 3, 4: 4 },
          name: this._dtStripName(a.friendly_name || p, "Action step size"),
          battery: st[`sensor.${p}_battery`] ? `sensor.${p}_battery` : null,
        });
        continue;
      }

      // --- Z2M dimmer / buton (OTOMATİK): action sensörü YOK, butonlar sadece MQTT device trigger.
      // sensor.<p>_action ya da _action_duration → cihazı bul, gerçek tetiklerini lazy çek (callWS).
      if (eid.startsWith("sensor.") && (eid.endsWith("_action") || eid.endsWith("_action_duration"))) {
        const p = eid.endsWith("_action_duration") ? eid.slice(7, -16) : eid.slice(7, -7);
        if (st[`sensor.${p}_action_step_size`]) continue;   // tap dial (yukarıda ele alındı)
        const ent = (h.entities || {})[eid];
        const devId = ent && ent.device_id ? ent.device_id : null;
        if (!devId || out.some((o) => o.device_id === devId)) continue;
        const cached = (this._dtTrigCache || {})[devId];
        if (!cached) this._dtEnsureTrigs(devId);
        const dev = (h.devices || {})[devId];
        out.push({
          key: "z2md:" + devId, path: "z2m-manual", type: "dimmer", device_id: devId, auto: true,
          name: (dev && (dev.name_by_user || dev.name)) || this._dtStripName(a.friendly_name || p, "Action"),
          buttons: { 1: 1, 2: 2, 3: 3, 4: 4 }, btnCount: 4, trigMap: cached || {},
          battery: st[`sensor.${p}_battery`] ? `sensor.${p}_battery` : null,
        });
        continue;
      }
    }
    // --- MANUEL eklenen cihazlar (otomatik bulunamayanlar) ---
    // Her biri {key,device_id,name,trigMap,allTrigs}; cihazın GERÇEK z2m tetikleriyle çalışır.
    for (const m of (Array.isArray(this._cfg.manual_devices) ? this._cfg.manual_devices : [])) {
      if (!m || !m.device_id) continue;
      if (out.some((o) => o.device_id === m.device_id)) continue;   // otomatik de bulunduysa çift ekleme
      out.push({ key: m.key || ("man:" + m.device_id), path: "z2m-manual", type: "dimmer", manual: true,
        device_id: m.device_id, name: m.name || "Manuel cihaz", buttons: { 1: 1, 2: 2, 3: 3, 4: 4 },
        btnCount: 4, trigMap: m.trigMap || {}, battery: m.battery || null });
    }
    out.sort((x, y) => x.name.localeCompare(y.name, "tr"));
    return out;
  }

  /* "Dial Tap - Salon Action step size" -> "Dial Tap - Salon" */
  _dtStripName(full, suffix) {
    const s = String(full || "");
    const low = s.toLowerCase(), suf = String(suffix).toLowerCase();
    if (low.endsWith(" " + suf)) return s.slice(0, s.length - suf.length - 1);
    return s;
  }

  /* Cihazın GERÇEK tetiklerini 4 tuşa (on/up/down/off) otomatik eşle. */
  _dtAutoMap(trigs) {
    const norm = (t) => ((t.subtype || "") + " " + (t.type || "")).toLowerCase();
    const isHold = (t) => { const s = norm(t); return s.includes("hold") || s.includes("long"); };
    const isPress = (t) => { const s = norm(t); return !isHold(t) && (s.includes("press") || s.includes("release") || s.includes("short") || s.includes("click") || s.includes("single")); };
    const pick = (keys, hold) => trigs.find((t) => { const s = norm(t); return keys.some((k) => s.includes(k)) && (hold ? isHold(t) : isPress(t)); });
    const GROUPS = { "1": ["on"], "2": ["up", "dim_up", "move_up", "brightness_up", "bright"], "3": ["down", "dim_down", "move_down", "brightness_down"], "4": ["off"] };
    const map = {};
    for (const n of ["1", "2", "3", "4"]) {
      const p = pick(GROUPS[n], false), hd = pick(GROUPS[n], true);
      const m = {}; if (p) m.press = { type: p.type, subtype: p.subtype }; if (hd) m.hold = { type: hd.type, subtype: hd.subtype };
      if (m.press || m.hold) map[n] = m;
    }
    if (!Object.keys(map).length) { trigs.slice(0, 4).forEach((t, i) => { map[String(i + 1)] = { press: { type: t.type, subtype: t.subtype } }; }); }
    return map;
  }
  /* Otomatik bulunan z2m dimmer'ın gerçek tetiklerini bir kez çek + önbelleğe al, sonra yeniden çiz. */
  async _dtEnsureTrigs(devId) {
    if (!this._dtTrigCache) this._dtTrigCache = {};
    if (!this._dtTrigFetching) this._dtTrigFetching = {};
    if (this._dtTrigCache[devId] || this._dtTrigFetching[devId]) return;
    this._dtTrigFetching[devId] = true;
    try {
      const trigs = (await this._hass.callWS({ type: "device_automation/trigger/list", device_id: devId })) || [];
      this._dtTrigCache[devId] = this._dtAutoMap(trigs);
    } catch (e) { this._dtTrigCache[devId] = {}; }
    this._dtTrigFetching[devId] = false;
    try { this._renderRail(); this._renderStage(); } catch (e) { /* yoksay */ }
  }
  _dtRemoveManual(d) {
    if (!Array.isArray(this._cfg.manual_devices)) return;
    this._cfg.manual_devices = this._cfg.manual_devices.filter((m) => (m.key || ("man:" + m.device_id)) !== d.key && m.device_id !== d.device_id);
    if (this._cfg.devices) delete this._cfg.devices[d.key];
    if (this._room === "__dt_" + d.key) this._room = null;
    this._save(); this._renderRail(); this._renderStage();
  }
  async _dtManualAdd() {
    const h = this._hass; if (!h) return;
    const devices = h.devices || {};
    const opts = Object.keys(devices).map((id) => ({ id, name: (devices[id].name_by_user || devices[id].name || id) })).filter((o) => o.name).sort((a, b) => a.name.localeCompare(b.name, "tr"));
    const ov = el("div"); ov.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(3,4,10,.72);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;font-family:'Inter',system-ui,sans-serif;";
    const box = el("div"); box.style.cssText = "width:100%;max-width:460px;background:#16121c;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:20px;color:#f0e9f2;box-shadow:0 30px 80px rgba(0,0,0,.6);";
    box.appendChild(el("div", null, "<b style='font-size:18px'>Manuel cihaz ekle</b>"));
    box.appendChild(el("div", null, "<div style='color:#9a90a0;font-size:13px;margin:6px 0 14px;line-height:1.5'>Otomatik bulunamayan bir düğme (Hue Dimmer, Ikea, Aqara…) ekle. Cihazı seç → panel HA'daki <b>gerçek tetiklerini</b> çekip tuşlara otomatik eşler.</div>"));
    const sel = document.createElement("select"); sel.style.cssText = "width:100%;padding:11px;border-radius:10px;background:#0e0b12;border:1px solid rgba(255,255,255,.14);color:#fff;font:inherit;font-size:14px;margin-bottom:12px;";
    const ph = document.createElement("option"); ph.value = ""; ph.textContent = "— Cihaz seç —"; sel.appendChild(ph);
    opts.forEach((o) => { const op = document.createElement("option"); op.value = o.id; op.textContent = o.name; sel.appendChild(op); });
    box.appendChild(sel);
    const info = el("div"); info.style.cssText = "font-size:13px;color:#cbb9cf;min-height:20px;margin-bottom:12px;line-height:1.5;";
    box.appendChild(info);
    const btnRow = el("div"); btnRow.style.cssText = "display:flex;gap:10px;justify-content:flex-end;";
    const cancel = el("button", null, "İptal"); cancel.style.cssText = "padding:10px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#cbb9cf;cursor:pointer;font:inherit;";
    const add = el("button", null, "Ekle"); add.style.cssText = "padding:10px 18px;border-radius:10px;border:none;background:linear-gradient(95deg,#c94b8f,#8a4bd6);color:#fff;cursor:pointer;font:inherit;font-weight:600;";
    cancel.onclick = () => ov.remove();
    ov.onclick = (e) => { if (e.target === ov) ov.remove(); };
    add.onclick = async () => {
      const did = sel.value; if (!did) { info.textContent = "Önce bir cihaz seç."; return; }
      add.disabled = true; info.textContent = "Tetikler çekiliyor…";
      let trigs = [];
      try { trigs = (await h.callWS({ type: "device_automation/trigger/list", device_id: did })) || []; }
      catch (e) { info.textContent = "Tetik alınamadı: " + ((e && e.message) || e); add.disabled = false; return; }
      if (!trigs.length) { info.textContent = "Bu cihazın tetiği yok. (Z2M'de düğmenin 'action' sensörü kapalı olabilir — Z2M'de aktifleştir.)"; add.disabled = false; return; }
      const trigMap = this._dtAutoMap(trigs);
      const dev = devices[did]; const name = dev.name_by_user || dev.name || "Manuel cihaz";
      if (!Array.isArray(this._cfg.manual_devices)) this._cfg.manual_devices = [];
      this._cfg.manual_devices = this._cfg.manual_devices.filter((m) => m.device_id !== did);
      this._cfg.manual_devices.push({ key: "man:" + did, device_id: did, name, trigMap, allTrigs: trigs.map((t) => ({ type: t.type, subtype: t.subtype })) });
      this._save();
      ov.remove();
      this._renderRail(); this._renderStage();
    };
    btnRow.appendChild(cancel); btnRow.appendChild(add); box.appendChild(btnRow);
    ov.appendChild(box); this.shadowRoot.appendChild(ov);
  }

  /* cihazın panel kaydı (modlar burada yaşar) */
  _dtCfg(key) {
    if (!this._cfg.devices || typeof this._cfg.devices !== "object") this._cfg.devices = {};
    const d = this._cfg.devices;
    if (!d[key] || typeof d[key] !== "object") d[key] = {};
    if (!Array.isArray(d[key].modes)) d[key].modes = [];
    this._dtMigrate(d[key]);
    return d[key];
  }

  /* Eski kayıt onarımı: tek hedefi sahne/script olan on/off/toggle atamaları
     yanlış — sahne toggle edilemez. Doğru tipe çevir (görünüm + üretim düzelir). */
  _dtMigrate(dc) {
    let degisti = false;
    for (const m of dc.modes || []) {
      // 1) tek hedefi sahne/script olan on/off/toggle → doğru tipe çevir
      for (const [slot, a] of Object.entries(m.btns || {})) {
        if (!a || !["on", "off", "toggle"].includes(a.kind)) continue;
        const ents = Array.isArray(a.entities) ? a.entities : [];
        if (ents.length !== 1) continue;
        const eid = ents[0];
        if (eid.startsWith("scene.")) { m.btns[slot] = { kind: "scene", entities: [eid], smart: false }; degisti = true; }
        else if (eid.startsWith("script.")) { m.btns[slot] = { kind: "script", entity: eid }; degisti = true; }
      }
      // 2) Sahne artık ÇOKLU seçilebiliyor: eski tek 'entity' kaydını listeye taşı
      for (const a of Object.values(m.btns || {})) {
        if (a && a.kind === "scene" && a.entity && !(a.entities || []).length) {
          a.entities = [a.entity];
          delete a.entity;
          degisti = true;
        }
      }
    }
    if (degisti) this._save();
  }

  /* "light.turn_on" HA'da GERÇEKTEN var mı? */
  _dtServiceOk(id) {
    const s = String(id || "");
    const i = s.indexOf(".");
    if (i < 1) return false;
    const svcs = (this._hass && this._hass.services) || {};
    return !!(svcs[s.slice(0, i)] && svcs[s.slice(0, i)][s.slice(i + 1)]);
  }

  /* Kurmadan önce atamaları denetle — HA'ya bozuk config göndermeyelim.
     [{yer, mesaj}] döner; boşsa her şey yolunda. */
  _dtValidate(dc) {
    const sorunlar = [];
    const trigAd = (slot) => slot.endsWith("_double") ? "çift bas"
      : slot.endsWith("_hold") ? "uzun bas" : "tek bas";
    for (const m of dc.modes) {
      for (const [slot, ana] of Object.entries(m.btns || {})) {
        if (!ana || !ana.kind || ana.kind === "none") continue;
        // 1. işlem + ek işlemler (act.extra) hepsi ayrı ayrı denetlenir
        const hepsi = [ana, ...(Array.isArray(ana.extra) ? ana.extra : [])];
        hepsi.forEach((a, sira) => {
        if (!a || !a.kind || a.kind === "none") return;
        const yer = `${m.name} · Tuş ${slot[1]} · ${trigAd(slot)}`
          + (sira ? ` · ${sira + 1}. işlem` : "");
        // git: hata satırına tıklayınca doğrudan bu tuşun O sekmesine atla
        const git = { modeId: m.id, slot: "b" + slot[1], trig: slot };
        const ekle = (mesaj) => sorunlar.push({ yer, mesaj, git });
        if (a.kind === "service") {
          if (!a.service) ekle("Servis alanı boş.");
          else if (!this._dtServiceOk(a.service))
            ekle(`“${esc(a.service)}” diye bir servis yok. Kutuya yazıp <b>açılan listeden seç</b> (ör. input_boolean.toggle).`);
          else {
            // light.turn_on bir switch'e uygulanamaz — HA sessizce hiçbir şey yapar
            const sd = a.service.split(".")[0];
            const yanlis = (a.entities || []).filter((e) => e.split(".")[0] !== sd);
            if (yanlis.length && !DT_UNIVERSAL.includes(sd))
              ekle(`<b>${esc(a.service)}</b> sadece <code>${esc(sd)}.*</code> cihazlarda çalışır, ` +
                   `ama hedef <code>${esc(yanlis[0])}</code>. Bu sessizce hiçbir şey yapmaz — ` +
                   `<b>homeassistant.turn_on</b> gibi genel bir servis seç ya da doğru hedefi ver.`);
          }
        }
        if (a.kind === "scene" && !((a.entities || []).length || a.entity)) ekle("Sahne seçilmemiş.");
        if (["on", "off", "toggle"].includes(a.kind) && !(a.entities || []).length)
          ekle("Hedef cihaz seçilmemiş.");
        if (a.kind === "media" && !a.entity) ekle("Oynatıcı seçilmemiş.");
        if (a.kind === "script" && !a.entity) ekle("Script seçilmemiş.");
        });
      }
      const d = m.dial;
      if (d && d.kind && d.kind !== "none" && !(d.entities || []).length)
        sorunlar.push({ yer: `${m.name} · Dial`, mesaj: "Hedef cihaz seçilmemiş.",
          git: { modeId: m.id, slot: "dial", trig: null } });


    }
    // Aynı tuşta hem tek bas hem çift bas "Mod değiştir" ise: tek basış da modu
    // değiştirir (çift basmayı beklerken). Genelde istenmez — uyar.
    if (dc.modes.length > 1) {
      const glob = this._dtGlobalSwitches(dc);
      for (const n of [1, 2, 3, 4]) {
        if (glob["b" + n] && glob["b" + n + "_double"])
          sorunlar.push({ yer: `Tuş ${n} · mod geçişi`, uyari: true,
            mesaj: "Hem <b>tek bas</b> hem <b>çift bas</b> “Mod değiştir” atanmış. " +
                   "İkisi de modu değiştirir; tek basış ayrıca " +
                   "<b>çift bas penceresi kadar gecikir</b>. Sadece çift bas istiyorsan " +
                   "tek bas atamasını temizle.",
            git: { modeId: (dc.modes[0] || {}).id, slot: "b" + n, trig: "b" + n } });
      }
    }

    // 2 mod var ama hiçbir yerde geçiş tuşu yoksa: UYARI (engel değil).
    // Modu Alexa'dan, dashboard'dan ya da başka bir otomasyondan da değiştirebilirsin.
    if (dc.modes.length > 1 && !Object.keys(this._dtGlobalSwitches(dc)).length)
      sorunlar.push({ yer: "Mod geçişi", uyari: true,
        mesaj: "Hiçbir tuşa <b>“Mod değiştir”</b> atanmamış — cihazdaki tuşlarla mod değiştiremezsin. " +
               "Sorun değilse geç: modu <code>select.*_mod</code> entity'sinden (Alexa, dashboard, " +
               "başka bir otomasyon) da değiştirebilirsin.",
        git: { modeId: (dc.modes[0] || {}).id, slot: "b4", trig: "b4" } });
    return sorunlar;
  }

  /* HA'nın hata gövdesinden okunur mesaj çıkar (callApi düz Error atmıyor) */
  _dtErrText(e) {
    if (!e) return "bilinmeyen hata";
    if (typeof e === "string") return e;
    const b = e.body;
    if (b && typeof b === "object" && b.message) return b.message;
    if (typeof b === "string" && b) return b;
    if (e.message) return e.message;
    if (e.error) return String(e.error);
    if (e.status_code) return "HTTP " + e.status_code;
    try { return JSON.stringify(e).slice(0, 200); } catch (x) { return "bilinmeyen hata"; }
  }

  /* mod sayısını SADECE okur — kayıt oluşturmaz (rail her çizimde boş cihaz
     kaydı yaratmasın diye; _dtCfg çağırmak config'i kirletiyordu) */
  _dtModeCount(key) {
    const d = this._cfg.devices;
    const rec = d && d[key];
    return rec && Array.isArray(rec.modes) ? rec.modes.length : 0;
  }

  /* bu cihazın mod seçici entity'si (entegrasyonun kendi ürettiği select) */
  _dtModeEntity(key) {
    for (const [eid, s] of Object.entries(this._hass.states || {})) {
      if (!eid.startsWith("select.")) continue;
      if (s.attributes && s.attributes.dial_tap_key === key) return eid;
    }
    return null;
  }

  /* bu cihazın ses takip entity'si (number) — Alexa/tablet gibi sesi gecikmeli
     bildiren cihazlarda dial'ın düzgün birikmesi için kullanılır */
  _dtVolEntity(key) {
    for (const [eid, s] of Object.entries(this._hass.states || {})) {
      if (!eid.startsWith("number.")) continue;
      if (s.attributes && s.attributes.dial_tap_key === key) return eid;
    }
    return null;
  }

  async _dtWaitVolEntity(key, tries) {
    for (let i = 0; i < (tries || 6); i++) {
      const e = this._dtVolEntity(key);
      if (e) return e;
      await new Promise((r) => setTimeout(r, 700));
    }
    return null;
  }

  _dtMode(dc) {
    if (!dc.modes.length) return null;
    let i = dc.modes.findIndex((m) => m.id === this._dtModeId);
    if (i < 0) i = 0;
    return dc.modes[i];
  }

  /* ---------------------------------------------------------- görünüm */
  _renderDialTap(stage, key) {
    stage.innerHTML = "";
    stage.appendChild(el("div", "glow"));
    stage.appendChild(this._dtStyle());

    const dev = this._dtDevices().find((d) => d.key === key);
    if (!dev) {
      stage.appendChild(el("div", "empty", "Bu cihaz artık bulunamıyor. HA'dan kaldırılmış olabilir."));
      return;
    }
    const dc = this._dtCfg(key);
    dc.name = dev.name;
    dc.path = dev.path;
    if (dev.device_id) dc.device_id = dev.device_id;
    if (dev.buttons) dc.buttons = dev.buttons;

    const mode = this._dtMode(dc);
    const modeEnt = this._dtModeEntity(key);
    const aktif = modeEnt ? this._hass.states[modeEnt].state : null;
    this._dtLiveMode = aktif;   // canlı takip için taban değer

    // ---- başlık ----
    const head = el("div", "stage-h");
    head.appendChild(el("div", "room-title", dev.name));
    const bat = dev.battery && this._hass.states[dev.battery]
      ? ` · ${this._L("pil", "battery")} <b>${this._L("%" + this._hass.states[dev.battery].state, this._hass.states[dev.battery].state + "%")}</b>` : "";
    head.appendChild(el("div", "room-meta",
      `${dev.path === "hue" ? "Hue Bridge" : "Zigbee2MQTT"}${bat}${aktif ? ` · ${this._L("aktif mod", "active mode")} <b>${esc(aktif)}</b>` : ""}`));
    const yed = el("button", "addsec");
    yed.style.marginLeft = "auto";
    yed.appendChild(icon("mdi:content-save-outline"));
    yed.appendChild(document.createTextNode("Yedekler"));
    yed.onclick = () => this._dtBackups();
    head.appendChild(yed);
    const test = el("button", "addsec");
    test.appendChild(icon("mdi:gesture-tap-button"));
    test.appendChild(document.createTextNode("Tuş Testi"));
    test.onclick = () => this._dtTest(dev);
    head.appendChild(test);
    // panelde değişiklik yapıldı ama kurulmadıysa bunu göster
    const rcHead = this._roomCfg("__dt_" + key);
    const fark = this._dtKurulumFarki(dev, dc, modeEnt, rcHead);
    const kur = el("button", "addauto" + (fark ? " bekliyor" : ""));
    kur.appendChild(icon("mdi:upload"));
    kur.appendChild(document.createTextNode(this._T("Otomasyonları Kur") + (fark ? " ●" : "")));
    kur.onclick = () => this._dtSync(dev, dc);
    head.appendChild(kur);
    stage.appendChild(head);

    if (fark) {
      const uy = el("div", "dt-bekle");
      uy.appendChild(icon("mdi:content-save-alert-outline"));
      const t = el("div");
      t.innerHTML = fark.yeni === 0
        ? this._L(
            "Tüm atamaları temizledin ama <b>eski otomasyonlar hâlâ HA'da çalışıyor</b>. " +
            "Aşağıdaki liste kurulu olanları gösterir. <b>Otomasyonları Kur</b>'a basınca hepsi kaldırılacak.",
            "You cleared all assignments but <b>the old automations are still running in HA</b>. " +
            "The list below shows what's installed. Pressing <b>Install Automations</b> removes them all.")
        : this._L(
            `Panelde değişiklik yaptın, henüz HA'ya yazılmadı. Şu an <b>${fark.kurulu}</b> otomasyon kurulu; ` +
            `kurulunca <b>${fark.yeni}</b> olacak. Tuşların hâlâ <b>eski ayarla</b> çalışıyor.`,
            `You changed the panel; it isn't written to HA yet. <b>${fark.kurulu}</b> automations are installed now; ` +
            `after installing there will be <b>${fark.yeni}</b>. The buttons still run with the <b>old setup</b>.`);
      uy.appendChild(t);
      stage.appendChild(uy);
    }

    // ---- moda sürüklenen ışıklar/gruplar (havuz) ----
    // Boşken kutu gizlenir; içinde geçerli bir şey varsa görünür.
    if (mode) {
      if (!Array.isArray(mode.pool)) mode.pool = [];
      const gecerli = mode.pool.filter((e) => this._hass.states[e]);
      mode.pool = gecerli;   // silinmiş entity'leri sessizce ayıkla
      if (gecerli.length) {
      const hv = el("div", "dt-pool");
      const hh = el("div", "dt-poolh");
      hh.appendChild(icon("mdi:tray-arrow-down"));
      hh.appendChild(el("span", null, `MODA EKLENENLER — ${mode.name}`));
      const clr = el("button", "dt-poolclr");
      clr.appendChild(icon("mdi:close"));
      clr.appendChild(document.createTextNode("Tümünü temizle"));
      clr.title = "Havuzu boşalt (tuşlara/dial'a atadıkların KALIR)";
      clr.onclick = () => { mode.pool = []; this._save(); this._renderStage(); };
      hh.appendChild(clr);
      hv.appendChild(hh);
      const pf = el("div", "dt-poolflow");
      for (const eid of mode.pool) {
        if (!this._hass.states[eid]) continue;
        const c = el("div", "dt-poolchip");
        c.appendChild(icon(this._isLightGroup(eid) ? "mdi:lightbulb-group-outline" : this._entIcon(eid)));
        c.appendChild(el("span", null, this._name(eid)));
        c.draggable = true;
        c.ondragstart = (ev) => {
          ev.dataTransfer.setData("text/plain", eid);
          ev.dataTransfer.effectAllowed = "copy";
          c.classList.add("drag");
          // dial'a "sürükleme başladı" de → tuşlarda bırakma bölgeleri görünsün
          const dl = this.shadowRoot.querySelector(".dt-dial, .dt-rem");
          if (dl) dl.classList.add("dtdrag");
        };
        c.ondragend = () => {
          c.classList.remove("drag");
          const dl = this.shadowRoot.querySelector(".dt-dial, .dt-rem");
          if (dl) dl.classList.remove("dtdrag");
        };
        const x = el("button", "dt-chip-x");
        x.appendChild(icon("mdi:close"));
        x.title = "Havuzdan çıkar";
        x.onclick = (ev) => {
          ev.stopPropagation();
          mode.pool = mode.pool.filter((e) => e !== eid);
          this._save(); this._renderStage();
        };
        c.appendChild(x);
        pf.appendChild(c);
      }
      hv.appendChild(pf);
      stage.appendChild(hv);
      }
    }

    // ---- hata kutusu: neyin nerede eksik olduğunu açıkça söyle ----
    if (this._dtErrors && this._dtErrors.length) {
      // hepsi uyarıysa kurulum YAPILMIŞTIR — kutu sarı ve bilgilendirici olsun
      const engelVar = this._dtErrors.some((s) => !s.uyari);
      const eb = el("div", "dt-err" + (engelVar ? "" : " sari"));
      const eh = el("div", "dt-errh");
      eh.appendChild(icon(engelVar ? "mdi:alert-circle-outline" : "mdi:information-outline"));
      eh.appendChild(el("span", null, engelVar
        ? "Kurulmadı — önce şunları düzelt"
        : "Kuruldu — bilmen gerekenler"));
      const x = el("button", "dev-mv");
      x.appendChild(icon("mdi:close"));
      x.onclick = () => { this._dtErrors = null; this._renderStage(); };
      eh.appendChild(x);
      eb.appendChild(eh);
      for (const s of this._dtErrors) {
        const r = el("div", "dt-errrow" + (s.git ? " go" : ""));
        r.appendChild(el("b", null, esc(s.yer)));
        r.appendChild(el("span", null, " — " + s.mesaj));
        if (s.git) {
          r.appendChild(el("span", "dt-errgo", "düzelt →"));
          r.onclick = () => {
            this._dtModeId = s.git.modeId;
            this._dtSlot = s.git.slot;
            if (s.git.trig) this._dtTrig = s.git.trig;
            this._renderStage();
          };
        }
        eb.appendChild(r);
      }
      stage.appendChild(eb);
    }

    // ---- modlar + dial ----
    const grid = el("div", "dt-wrap");

    // sol: mod listesi
    const left = el("div", "dt-modes");
    const mh = el("div", "dt-mh");
    mh.appendChild(el("span", "dt-lbl", "MODLAR"));
    if (dc.modes.length < DT_MAX_MODE) {
      const addM = el("button", "dt-mini");
      addM.appendChild(icon("mdi:plus"));
      addM.appendChild(document.createTextNode("Mod"));
      addM.onclick = () => this._dtAddMode(dc);
      mh.appendChild(addM);
    } else {
      mh.appendChild(el("span", "dt-lbl", `${this._L("EN FAZLA", "MAX")} ${DT_MAX_MODE}`));
    }
    left.appendChild(mh);

    if (!dc.modes.length)
      left.appendChild(el("div", "gb-empty", "Henüz mod yok. “+ Mod” ile başla — ör. “Işıklar”."));

    dc.modes.forEach((m, i) => {
      const row = el("div", "dt-mode" + (mode && m.id === mode.id ? " on" : ""));
      const d = el("span", "dt-dot" + (aktif && aktif === m.name ? " live" : ""));
      row.appendChild(d);
      row.appendChild(icon(m.icon || "mdi:knob"));
      const tb = el("div", "dt-mt");
      tb.appendChild(el("div", "dt-mn", `Mod ${i + 1} · ${m.name}`));
      tb.appendChild(el("div", "dt-ms", this._dtModeSummary(m)));
      row.appendChild(tb);
      row.onclick = () => { this._dtModeId = m.id; this._dtSlot = null; this._renderStage(); };
      // panelden aktif modu değiştir — cihazdan çıkamadığın durumda kurtarıcı
      if (modeEnt && aktif !== m.name) {
        const go = el("button", "dev-mv");
        go.appendChild(icon("mdi:play-circle-outline"));
        go.title = "Bu moda geç (cihaza dokunmadan)";
        go.onclick = (e) => {
          e.stopPropagation();
          this._hass.callService("select", "select_option",
            { option: m.name }, { entity_id: modeEnt });
          this._flash(`${m.name} moduna geçildi`);
        };
        row.appendChild(go);
      }
      const rm = el("button", "dev-mv");
      rm.appendChild(icon("mdi:trash-can-outline"));
      rm.title = "Modu sil";
      rm.onclick = (e) => {
        e.stopPropagation();
        if (!confirm(`"${m.name}" modu silinsin mi? (bu moda ait otomasyon HA'dan kaldırılır)`)) return;
        dc.modes = dc.modes.filter((x) => x !== m);
        this._save();
        this._dtSync(dev, dc, true);
        this._renderStage();
      };
      row.appendChild(rm);
      left.appendChild(row);
    });

    // Gelişmiş ayarlar KAPALI gelir — mod seçince ekran kalabalık görünmesin
    if (dc.modes.length > 1) {
      const acik = !!this._dtAdvOpen;
      const tgl = el("button", "dt-adv" + (acik ? " on" : ""));
      tgl.appendChild(icon(acik ? "mdi:chevron-down" : "mdi:chevron-right"));
      tgl.appendChild(el("span", null, "Gelişmiş ayarlar"));
      tgl.onclick = () => { this._dtAdvOpen = !this._dtAdvOpen; this._renderStage(); };
      left.appendChild(tgl);
      if (acik) {
        const kutu = el("div", "dt-advbox");
        kutu.appendChild(el("div", "dt-note",
          "Mod değiştirmek için istediğin tuşa <b>“Mod değiştir”</b> ata — tek, uzun ya da çift bas, sen seç. " +
          "<b>Bir kez tanımlaman yeterli: her modda çalışır</b> (⟳ işaretli görünür). " +
          "Geçince 4 tuş ve dial komple diğer modun düzenine döner."));
        kutu.appendChild(this._dtIndicatorEl(dc));
        kutu.appendChild(el("div", "dt-note",
          modeEnt ? `Mod durumu: <code>${esc(modeEnt)}</code> — entegrasyonun kendi entity'si, helper yok.`
                  : "Mod entity'si otomasyonları kurunca oluşur."));
        left.appendChild(kutu);
      }
    }
    grid.appendChild(left);

    // sağ: dial görseli + seçili tuşun ayarı
    const right = el("div", "dt-right");
    if (!mode) {
      right.appendChild(el("div", "empty", "Soldan bir mod ekle — sonra tuşları buradan atarsın."));
    } else {
      right.appendChild(dev.type === "dimmer"
        ? this._dtDimmerEl(dev, dc, mode)
        : this._dtDialEl(dev, dc, mode));
      right.appendChild(this._dtInspector(dev, dc, mode));
    }
    grid.appendChild(right);
    stage.appendChild(grid);

    // ---- üretilen otomasyonlar ----
    const rc = this._roomCfg("__dt_" + key);
    const wrap = el("div", "secwrap");
    stage.appendChild(wrap);
    if (rc.autos.length) {
      const asec = el("div", "sec autos");
      const ah = el("div", "sec-h");
      ah.appendChild(el("span", "sec-name", "HA'da Çalışan Otomasyonlar"));
      ah.appendChild(el("span", "sec-count", String(rc.autos.length)));
      asec.appendChild(ah);
      asec.appendChild(el("div", "gb-empty", this._L(
        "Bunlar şu an HA'da <b>canlı</b> — panel kapalıyken de çalışırlar. " +
        "Panelde yaptığın değişiklik ancak <b>Otomasyonları Kur</b>'a basınca buraya yansır.",
        "These are <b>live</b> in HA now — they run even when the panel is closed. " +
        "Panel changes only appear here after you press <b>Install Automations</b>.")));
      const room = { id: "__dt_" + key, name: dev.name };
      for (const a of rc.autos) asec.appendChild(this._autoRow(room, a, rc));
      wrap.appendChild(asec);
    } else {
      wrap.appendChild(el("div", "gb-empty", this._L(
        "Henüz otomasyon kurulmadı. Tuşları atadıktan sonra üstteki <b>Otomasyonları Kur</b>'a bas.",
        "No automations installed yet. After assigning buttons, press <b>Install Automations</b> above.")));
    }
  }

  /* yeni mod — en fazla DT_MAX_MODE tane */
  _dtAddMode(dc) {
    if (dc.modes.length >= DT_MAX_MODE) { this._flash(`En fazla ${DT_MAX_MODE} mod olabilir`, true); return; }
    const varsayilan = dc.modes.length === 0 ? "Mod 1" : "Mod 2";
    const nm = (prompt("Mod adı (ör. Işıklar, TV):", varsayilan) || "").trim();
    if (!nm) return;
    if (dc.modes.some((m) => m.name.toLowerCase() === nm.toLowerCase())) {
      this._flash("Bu adda mod zaten var", true); return;
    }
    const m = { id: uid(), name: nm.slice(0, 24), icon: "mdi:knob", btns: {}, dial: { kind: "none" },
      color: DT_MODE_COLORS[dc.modes.length] || DT_MODE_COLORS[0] };
    dc.modes.push(m);
    this._dtModeId = m.id;
    this._dtSlot = null;
    this._save();
    this._renderStage();
    this._renderRail();
  }

  /* MOD GÖSTERGESİ: geçişte bir ışık modun rengini gösterir.
     "flash" = yanıp eski haline döner (odanın ışığını bozmaz)
     "hold"  = o renkte kalır (bir bakışta belli) */
  _dtIndicatorEl(dc) {
    if (!dc.indicator) dc.indicator = { kind: "none", secs: 1.5 };
    const ind = dc.indicator;
    const box = el("div", "dt-sw");
    box.appendChild(el("div", "dt-lbl", "MOD GÖSTERGESİ"));
    box.appendChild(el("div", "dt-note",
      "Mod değişince hangi moda geçtiğini ışıkla anla. İsteğe bağlı."));

    const opts = [
      { id: "none", label: "Kapalı" },
      { id: "flash", label: "Yanıp sönsün, sonra eski haline dönsün" },
      { id: "hold", label: "O modun renginde kalsın" },
    ];
    const seg = el("div", "dt-vseg");
    for (const o of opts) {
      const p = el("div", "dt-pick" + (ind.kind === o.id ? " on" : ""), o.label);
      p.onclick = () => { ind.kind = o.id; this._save(); this._renderStage(); };
      seg.appendChild(p);
    }
    box.appendChild(seg);

    if (ind.kind && ind.kind !== "none") {
      box.appendChild(this._dtField("Varsayılan gösterge ışığı",
        this._dtEntPicker(ind, "entity", "light", false)));
      box.appendChild(el("div", "dt-note",
        "Bu ışık, kendi ışığı seçilmemiş modlar için kullanılır. " +
        "Aşağıda <b>her moda ayrı ışık</b> verebilirsin."));
      if (ind.kind === "flash") {
        const num = (val, step, min, max, unit, set) => {
          const w = el("div", "dt-num");
          const i = document.createElement("input");
          i.className = "dt-inp"; i.type = "number";
          i.step = step; i.min = min; i.max = max; i.value = val;
          i.oninput = () => { const v = parseFloat(i.value); if (!isNaN(v) && v >= min && v <= max) { set(v); this._save(); } };
          w.appendChild(i);
          w.appendChild(el("span", "dt-unit", unit));
          return w;
        };
        const row = el("div", "dt-2col");
        row.appendChild(this._dtField("Kaç kez",
          num(ind.times || DT_BLINK_TIMES, "1", 1, 10, "kez", (v) => { ind.times = Math.round(v); })));
        row.appendChild(this._dtField("Yanış süresi",
          num(ind.secs != null ? ind.secs : DT_BLINK_SECS, "0.1", 0.1, 5, "sn", (v) => { ind.secs = v; })));
        box.appendChild(row);
        const kez = ind.times || DT_BLINK_TIMES, sn = ind.secs != null ? ind.secs : DT_BLINK_SECS;
        box.appendChild(el("div", "dt-note",
          `Toplam ${(kez * sn * 2).toFixed(1)} sn sürer (${kez} kez yanıp sönme).`));
      }
      // her modun rengi
      // Her modun KENDİ rengi ve KENDİ ışığı olabilir.
      // Işık seçilmezse yukarıdaki varsayılan gösterge ışığı kullanılır.
      const cw = el("div", "dt-colors");
      dc.modes.forEach((m, i) => {
        const blok = el("div", "dt-modind");
        const r = el("div", "dt-colrow");
        const ci = document.createElement("input");
        ci.type = "color";
        ci.className = "dt-col";
        ci.value = m.color || DT_MODE_COLORS[i] || "#3b82f6";
        ci.oninput = () => { m.color = ci.value; this._save(); };
        r.appendChild(ci);
        // ad zaten "Mod 2" ise "Mod 2 · Mod 2" yazmayalım
        const ad = /^mod\s*\d+$/i.test(m.name) ? esc(m.name) : `Mod ${i + 1} · ${esc(m.name)}`;
        r.appendChild(el("span", "dt-colname", ad));
        blok.appendChild(r);
        const isikSatiri = el("div", "dt-modisik");
        isikSatiri.appendChild(el("span", "dt-modisikl",
          m.indEntity ? "bu modun ışığı:" : "ışık seçilmedi → varsayılan"));
        isikSatiri.appendChild(this._dtEntPicker(m, "indEntity", "light", false));
        blok.appendChild(isikSatiri);
        cw.appendChild(blok);
      });
      box.appendChild(this._dtField("Her mod için renk ve ışık", cw));
      if (ind.kind === "flash")
        box.appendChild(el("div", "dt-note",
          "Işığın o anki hali kaydedilir, yanıp söndükten sonra <b>aynen geri yüklenir</b> — " +
          "kapalıysa kapanır, açıksa eski rengine döner."));
    }
    return box;
  }

  _dtModeSummary(m) {
    const n = Object.keys(m.btns || {}).filter((k) => m.btns[k] && m.btns[k].kind && m.btns[k].kind !== "none").length;
    const d = m.dial && m.dial.kind && m.dial.kind !== "none" ? this._T(DT_DIAL[m.dial.kind].label).toLowerCase() : this._L("boş", "empty");
    return `${n} ${this._L("atama", "assignments")} · dial: ${d}`;
  }

  /* --- dial görseli: 4 köşe tuş + ortada çevirme --- */
  _dtDialEl(dev, dc, mode) {
    const glob = this._dtGlobalSwitches(dc);   // her modda geçerli geçiş tuşu
    const dimmer = dev.type === "dimmer";      // dial YOK, sadece 4 tuş
    const box = el("div", "dt-dial" + (dimmer ? " dt-nodial" : ""));
    // Dekoratif halka: tap dial'da "ÇEVİR" etiketli (döner), dimmer'da etiketsiz.
    const ring = el("div", "dt-ring" + (dimmer ? " dt-ring-d" : ""));
    if (!dimmer) ring.appendChild(el("span", "dt-ringl", "ÇEVİR"));
    box.appendChild(ring);

    for (let i = 1; i <= 4; i++) {
      const slot = "b" + i;
      const pad = el("div", `dt-pad dt-p${i}` + (this._dtSlot === slot ? " sel" : ""));
      pad.appendChild(el("b", null, this._L("TUŞ", "BUTTON") + " " + i));
      this._dtPadDoldur(pad, mode, glob, slot);
      box.appendChild(pad);
    }

    if (!dimmer) {
      const knob = el("div", "dt-knob" + (this._dtSlot === "dial" ? " sel" : ""));
      knob.appendChild(el("b", null, "DIAL"));
      const dk = mode.dial && mode.dial.kind ? mode.dial.kind : "none";
      knob.appendChild(el("span", null, dk === "none" ? "— boş —" : DT_DIAL[dk].label));
      knob.onclick = () => { this._dtSlot = "dial"; this._renderStage(); };
      this._dtDropTarget(knob, mode, "dial");   // dial'a bırak → parlaklık hedefi olur
      box.appendChild(knob);
    } else {
      // Dimmer'da çevirme yok → ortada dekoratif hub: cihaz kimliği (ikon + tuş sayısı).
      const hub = el("div", "dt-hub");
      hub.appendChild(icon(dev.path === "hue" ? "mdi:remote" : "mdi:gesture-tap-button"));
      hub.appendChild(el("b", null, (dev.btnCount || 4) + " " + this._L("TUŞ", "BUTTONS")));
      box.appendChild(hub);
    }
    return box;
  }

  /* Bir tuş kartının içeriği: atama metinleri + 3 bırakma bölgesi.
     Hem Tap Dial (2x2 köşe) hem Dimmer (dikey kumanda) görünümü bunu kullanır. */
  _dtPadDoldur(pad, mode, glob, slot) {
    // bu modda tanımlı değilse bile geçiş tuşunu göster — her modda çalışıyor.
    // DİKKAT: temizlenmiş atama {kind:"none"} olarak kalır — onu "tanımlı" sayma.
    const dolu = (k) => { const a = (mode.btns || {})[k]; return a && a.kind && a.kind !== "none"; };
    const al = (k) => dolu(k) ? mode.btns[k] : (glob[k] ? glob[k].act : null);
    const genel = (k) => !dolu(k) && !!glob[k];
    const single = al(slot), hold = al(slot + "_hold"), dbl = al(slot + "_double");
    const et = (a, k, on) => {
      const t = this._dtActLabel(a);
      if (!t) return null;
      // aynı basışta çalışan ek işlem varsa "+N işlem" diye göster
      const ek = (a && Array.isArray(a.extra) ? a.extra.filter((x) => x && x.kind && x.kind !== "none").length : 0);
      return (on || "") + t + (ek ? ` +${ek} ${this._L("işlem", "action")}` : "") + (genel(k) ? " ⟳" : "");
    };
    pad.appendChild(el("span", null, et(single, slot) || this._L("— boş —", "— empty —")));
    if (dbl && dbl.kind && dbl.kind !== "none")
      pad.appendChild(el("i", null, et(dbl, slot + "_double", this._L("çift: ", "double: "))));
    if (hold && hold.kind && hold.kind !== "none")
      pad.appendChild(el("i", null, et(hold, slot + "_hold", this._L("uzun: ", "hold: "))));
    pad.onclick = () => { this._dtSlot = slot; this._renderStage(); };
    // Sürükleme başlayınca tuşun üstünde 3 bırakma bölgesi belirir:
    // hangi tetikleyiciye atanacağını sen seçersin (hep tek basmaya gitmesin).
    const zn = el("div", "dt-zones");
    for (const z of [{ k: slot, t: this._L("Tek bas", "Single") },
                     { k: slot + "_hold", t: this._L("Uzun bas", "Hold") },
                     { k: slot + "_double", t: this._L("Çift bas", "Double") }]) {
      const zone = el("div", "dt-zone", z.t);
      zone.ondragover = (ev) => { ev.preventDefault(); ev.dataTransfer.dropEffect = "copy"; zone.classList.add("on"); };
      zone.ondragleave = () => zone.classList.remove("on");
      zone.ondrop = (ev) => {
        ev.preventDefault(); ev.stopPropagation();
        zone.classList.remove("on");
        const eid = ev.dataTransfer.getData("text/plain");
        if (eid && this._hass.states[eid]) this._dtAssignDrop(mode, z.k, eid);
      };
      zn.appendChild(zone);
    }
    pad.appendChild(zn);
  }

  /* DIMMER GÖRÜNÜMÜ — Hue Dimmer Switch fiziksel olarak DİKEY 4 tuşlu kumanda:
     AÇ / parlaklık artır / parlaklık azalt / KAPAT. Tap Dial'ın 2x2 düzeni değil. */
  _dtDimmerEl(dev, dc, mode) {
    const glob = this._dtGlobalSwitches(dc);
    const box = el("div", "dt-rem");
    const TUSLAR = [
      { n: 1, ad: this._L("AÇ", "ON"),           ic: "mdi:power" },
      { n: 2, ad: this._L("PARLAKLIK +", "BRIGHTNESS +"), ic: "mdi:brightness-7" },
      { n: 3, ad: this._L("PARLAKLIK −", "BRIGHTNESS −"), ic: "mdi:brightness-5" },
      { n: 4, ad: this._L("KAPAT", "OFF"),       ic: "mdi:power-off" },
    ];
    const kac = dev.btnCount || 4;
    for (const t of TUSLAR) {
      if (t.n > kac) continue;   // 2 tuşlu akıllı butonda alt tuşlar yok
      const slot = "b" + t.n;
      const pad = el("div", "dt-rembtn" + (this._dtSlot === slot ? " sel" : ""));
      const h = el("div", "dt-remh");
      h.appendChild(icon(t.ic));
      h.appendChild(el("b", null, `${this._L("TUŞ", "BUTTON")} ${t.n} · ${t.ad}`));
      pad.appendChild(h);
      this._dtPadDoldur(pad, mode, glob, slot);
      box.appendChild(pad);
    }
    return box;
  }

  /* Havuzdan sürüklenen ışığı tuşa/dial'a bırakma.
     Tuş  -> tek basmaya "Aç / kapat (toggle)" olarak eklenir
     Dial -> parlaklık hedefi olarak eklenir
     Zaten bir atama varsa hedef listesine EKLENİR, üzerine yazılmaz. */
  _dtDropTarget(elm, mode, slot) {
    elm.ondragover = (ev) => { ev.preventDefault(); ev.dataTransfer.dropEffect = "copy"; elm.classList.add("dropok"); };
    elm.ondragleave = (ev) => { if (!elm.contains(ev.relatedTarget)) elm.classList.remove("dropok"); };
    elm.ondrop = (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      elm.classList.remove("dropok");
      const eid = ev.dataTransfer.getData("text/plain");
      if (!eid || !this._hass.states[eid]) return;
      this._dtAssignDrop(mode, slot, eid);
    };
  }

  /* Sürüklenen cihazı belirli bir yuvaya ata.
     slot: "dial" | "b1" | "b1_hold" | "b1_double" ... */
  _dtAssignDrop(mode, slot, eid) {
    {
      if (slot === "dial") {
        if (!mode.dial || !mode.dial.kind || mode.dial.kind === "none")
          mode.dial = { kind: "brightness", entities: [], slow: DT_DIAL.brightness.slow, fast: DT_DIAL.brightness.fast };
        if (!Array.isArray(mode.dial.entities)) mode.dial.entities = [];
        if (!mode.dial.entities.includes(eid)) mode.dial.entities.push(eid);
        this._dtSlot = "dial";
        this._flash(`${this._name(eid)} → dial (parlaklık)`);
      } else {
        if (!mode.btns) mode.btns = {};
        const cur = mode.btns[slot];
        // Mod değiştir tuşunu ASLA ezme — ezilirse modlar arası geçiş sessizce kaybolur
        if (cur && (cur.kind === "mode_next" || cur.kind === "mode_set")) {
          this._flash("Bu tuş “Mod değiştir” — üzerine atanmaz, başka tuş seç", true);
          return;
        }
        // sahne sürüklendiyse "Sahne çalıştır", script'se "Script çalıştır" olarak koy
        if (eid.startsWith("scene.") && (!cur || !cur.kind || cur.kind === "none")) {
          mode.btns[slot] = { kind: "scene", entities: [eid], smart: false };
        } else if (eid.startsWith("script.") && (!cur || !cur.kind || cur.kind === "none")) {
          mode.btns[slot] = { kind: "script", entity: eid };
        } else if (!cur || !cur.kind || cur.kind === "none")
          mode.btns[slot] = { kind: "toggle", entities: [eid] };
        else if (Array.isArray(cur.entities)) {
          if (!cur.entities.includes(eid)) cur.entities.push(eid);
        } else if ("entity" in cur || cur.kind === "scene" || cur.kind === "script" || cur.kind === "media") {
          this._flash("Bu tuşta tek hedefli bir atama var — önce onu temizle", true);
          return;
        } else {
          mode.btns[slot] = { kind: "toggle", entities: [eid] };
        }
        this._dtSlot = "b" + slot[1];
        this._dtTrig = slot;
        const trigAd = slot.endsWith("_double") ? "çift bas"
          : slot.endsWith("_hold") ? "uzun bas" : "tek bas";
        this._flash(`${this._name(eid)} → Tuş ${slot[1]} (${trigAd})`);
      }
      this._save();
      this._renderStage();
    }
  }

  _dtActLabel(act) {
    if (!act || !act.kind || act.kind === "none") return "";
    const def = DT_ACT[act.kind];
    if (!def) return "";
    if (act.kind === "mode_next") return this._T("Sonraki mod");
    if (act.kind === "mode_set") return this._L("Mod: ", "Mode: ") + (act.mode || "?");
    const t = act.entity || (act.entities || [])[0];
    if (!t) return this._T(def.label);
    const nm = this._name(t);
    if (act.kind === "scene") { const c = (act.entities || []).length; return this._L("Sahne: ", "Scene: ") + nm + (c > 1 ? " +" + (c - 1) : ""); }
    if (act.kind === "media") return this._T(DT_MEDIA[act.cmd] || "Medya") + ": " + nm;
    if (act.kind === "service") return (act.service || "servis") + " → " + nm;
    return this._T(def.label) + ": " + nm;
  }

  /* --- seçili tuşun / dial'ın ayar paneli --- */
  _dtInspector(dev, dc, mode) {
    const box = el("div", "dt-insp");
    const slot = this._dtSlot;
    if (!slot) {
      box.appendChild(el("div", "gb-empty", dev.type === "dimmer"
        ? "Yukarıdan bir tuşa dokun — ne yapacağını burada seçersin."
        : "Yukarıdan bir tuşa ya da ortadaki dial'a dokun — ne yapacağını burada seçersin."));
      return box;
    }
    if (!mode.btns) mode.btns = {};

    if (slot === "dial") {
      box.appendChild(el("div", "dt-ih", "Dial — çevirme"));
      if (!mode.dial) mode.dial = { kind: "none" };
      const d = mode.dial;
      box.appendChild(this._dtField("Ne kontrol etsin", this._dtSelect(
        Object.entries(DT_DIAL).map(([k, v]) => [k, v.label]), d.kind || "none",
        (v) => { d.kind = v; d.entities = []; this._save(); this._renderStage(); })));
      if (d.kind && d.kind !== "none") {
        const def = DT_DIAL[d.kind];
        box.appendChild(this._dtField("Hedef cihaz",
          this._dtEntPicker(d, "entities", def.domain, true, def.filtre)));
        if (def.filtre === "ses")
          box.appendChild(el("div", "dt-note",
            "Listede <b>sadece sesi değiştirilebilen</b> cihazlar var — HA'daki tüm medya " +
            "oynatıcıları tarandı. Echo/Alexa gibi adım desteklemeyen cihazlarda ses seviyesi " +
            "doğrudan hesaplanıp yazılır, panel farkı senin için hallediyor."));
        // ışık kısarken kapalıları da yakmasın diye süzme seçeneği
        if (d.kind === "brightness" || d.kind === "color_temp") {
          const seg = el("div", "dt-vseg");
          const mk = (v, label, aciklama) => {
            const p = el("div", "dt-pick" + ((d.sadeceAcik !== false) === v ? " on" : ""), label);
            p.title = aciklama;
            p.onclick = () => { d.sadeceAcik = v; this._save(); this._renderStage(); };
            return p;
          };
          seg.appendChild(mk(true, "Sadece açık olan ışıkları etkile",
            "Kapalı ışıklara dokunmaz — bölgesel açtığında sadece yananları kısar"));
          seg.appendChild(mk(false, "Hepsini etkile (kapalıları da açar)",
            "Grubun tamamını hedefler, kapalı olanlar yanar"));
          box.appendChild(this._dtField("Hangi ışıklar", seg));
          box.appendChild(el("div", "dt-note", d.sadeceAcik !== false
            ? "Işık grubu seçtiysen grup <b>üyelerine kadar açılır</b> ve sadece o an yanan ışıklar kısılır. Hiçbiri açık değilse dial bir şey yapmaz."
            : "Dikkat: kapalı ışıklar da <b>yanar</b>."));
        }
        if (d.slow == null) d.slow = def.slow;
        if (d.fast == null) d.fast = def.fast;
        const row = el("div", "dt-2col");
        row.appendChild(this._dtField("Yavaş çevirme adımı",
          this._dtNumber(d.slow, def.unit, (v) => { d.slow = v; this._save(); })));
        row.appendChild(this._dtField("Hızlı çevirme adımı",
          this._dtNumber(d.fast, def.unit, (v) => { d.fast = v; this._save(); })));
        box.appendChild(row);
        box.appendChild(el("div", "dt-note", dev.path === "hue"
          ? "Hue Bridge hız bilgisini <code>steps</code> olarak verir; panel 30 adımın üstünü “hızlı” sayar."
          : "Tap Dial hızlı/yavaş çevirmeyi kendi ayırt eder — z2m ayrı sinyal gönderir."));
      }
      return box;
    }

    // --- tuş ---
    const n = slot.slice(1);
    box.appendChild(el("div", "dt-ih", `Tuş ${n}`));

    const trigs = [
      { id: slot, label: "Tek bas" },
      { id: slot + "_hold", label: "Uzun bas" },
      { id: slot + "_double", label: "Çift bas" },
    ];
    if (!this._dtTrig || !trigs.some((t) => t.id === this._dtTrig)) this._dtTrig = slot;
    const seg = el("div", "dt-seg");
    for (const t of trigs) {
      const dolu = mode.btns[t.id] && mode.btns[t.id].kind && mode.btns[t.id].kind !== "none";
      const p = el("div", "dt-pick" + (this._dtTrig === t.id ? " on" : "") + (dolu ? " dolu" : ""), t.label);
      // dolu sekmede nokta: "burada atama var" — gözden kaçmasın
      if (dolu) p.appendChild(el("span", "dt-tdot"));
      p.title = dolu ? "Bu tetikleyicide atama var" : "Boş";
      p.onclick = () => { this._dtTrig = t.id; this._renderStage(); };
      seg.appendChild(p);
    }
    box.appendChild(this._dtField("Tetikleyici", seg));

    // bu slotta başka modda tanımlı GLOBAL geçiş tuşu varsa söyle — "boş" sanılmasın
    {
      const globAll = this._dtGlobalSwitches(dc);
      const g = globAll[this._dtTrig];
      const buradaki = mode.btns[this._dtTrig];
      if (g && g.modeId !== mode.id && !(buradaki && buradaki.kind && buradaki.kind !== "none")) {
        const sahibi = dc.modes.find((m) => m.id === g.modeId);
        box.appendChild(el("div", "dt-note",
          `⟳ Bu tuşta <b>Mod değiştir</b> zaten tanımlı (${esc((sahibi || {}).name || "diğer mod")} içinde) — ` +
          "geçiş tuşu <b>her modda çalışır</b>, buraya tekrar atamana gerek yok."));
      }
    }
    if (this._dtTrig.endsWith("_double")) {
      const dblAct = (mode.btns[this._dtTrig] = mode.btns[this._dtTrig] || { kind: "none" });
      const win = dblAct.win || DT_DBL_WIN;
      box.appendChild(el("div", "dt-warn",
        "⚠ Tap Dial donanımı çift basmayı <b>üretmez</b> — panel bunu otomasyonun içinde bekleyerek taklit eder " +
        `(yardımcı/helper kurulmaz). Bedeli: bu tuşta <b>tek basma ${win} ms gecikir</b>. İstemiyorsan boş bırak.`));
      const wbox = el("div", "dt-num");
      const wi = document.createElement("input");
      wi.className = "dt-inp"; wi.type = "number"; wi.step = "50"; wi.min = "200"; wi.max = "1500";
      wi.value = win;
      wi.oninput = () => {
        const v = parseInt(wi.value, 10);
        if (!isNaN(v) && v >= 200 && v <= 1500) { dblAct.win = v; this._save(); }
      };
      wbox.appendChild(wi);
      wbox.appendChild(el("span", "dt-unit", "ms"));
      box.appendChild(this._dtField("Çift bas penceresi", wbox));
      box.appendChild(el("div", "dt-note",
        "İki basış arası bu süreden UZUN olursa sistem bunu <b>iki ayrı tek basış</b> sayar. " +
        "Çift basman algılanmıyorsa süreyi artır (600-700 ms); tek basma çok gecikiyorsa azalt."));
    }

    const act = mode.btns[this._dtTrig] || { kind: "none" };
    mode.btns[this._dtTrig] = act;

    // --- 1. işlem ---
    this._dtAksiyonAlanlari(box, act, dc, (yeni) => { mode.btns[this._dtTrig] = yeni; });

    // --- EK İŞLEMLER: aynı tuşa basınca sırayla hepsi çalışır ---
    if (act.kind && act.kind !== "none") {
      if (!Array.isArray(act.extra)) act.extra = [];
      act.extra.forEach((ex, i) => {
        const kutu = el("div", "dt-ek");
        const bas = el("div", "dt-ekh");
        bas.appendChild(icon("mdi:plus-circle-outline"));
        bas.appendChild(el("span", null, `${i + 2}. İŞLEM`));
        const sil = el("button", "dev-mv");
        sil.appendChild(icon("mdi:close"));
        sil.title = "Bu işlemi kaldır";
        sil.onclick = () => { act.extra.splice(i, 1); this._save(); this._renderStage(); };
        bas.appendChild(sil);
        kutu.appendChild(bas);
        this._dtAksiyonAlanlari(kutu, ex, dc, (yeni) => { act.extra[i] = yeni; });
        box.appendChild(kutu);
      });
      const ekle = el("button", "dt-mini");
      ekle.appendChild(icon("mdi:plus"));
      ekle.appendChild(document.createTextNode("İşlem ekle (aynı anda çalışır)"));
      ekle.onclick = () => { act.extra.push({ kind: "none" }); this._save(); this._renderStage(); };
      box.appendChild(ekle);
    }

    if (act.kind && act.kind !== "none") {
      const clr = el("button", "dt-mini");
      clr.appendChild(icon("mdi:close"));
      // hangi sekmeyi sildiğini AÇIKÇA yaz — "temizledim ama duruyor" kafa karışıklığı olmasın
      const trigAdi = (trigs.find((t) => t.id === this._dtTrig) || {}).label || "";
      clr.appendChild(document.createTextNode(`“${trigAdi}” atamasını temizle`));
      clr.onclick = () => { delete mode.btns[this._dtTrig]; this._save(); this._renderStage(); };
      box.appendChild(clr);
    }
    return box;
  }

  /* Bir işlemin ayar alanları: "Ne yapsın?" + hedef + tipe özel alanlar.
     Hem 1. işlem hem de ek işlemler (act.extra) bunu kullanır.
     setAct(yeniObje): kind değişince nesneyi yerine koyar (ana/ek fark eder). */
  _dtAksiyonAlanlari(box, act, dc, setAct) {
    box.appendChild(this._dtField("Ne yapsın?", this._dtSelect(
      Object.entries(DT_ACT).map(([k, v]) => [k, v.label]), act.kind || "none",
      (v) => {
        // Aç / Kapat / Toggle aynı hedef tipini (entities) kullanır — kind değişince
        // seçili cihazları KORU, sadece uyuşmayan tiplerde sıfırla.
        const listeliler = ["on", "off", "toggle", "service"];
        const yeni = { kind: v };
        if (listeliler.includes(v) && Array.isArray(act.entities)) yeni.entities = act.entities;
        if (Array.isArray(act.extra) && act.extra.length) yeni.extra = act.extra;  // ek işlemler kaybolmasın
        setAct(yeni);
        this._save();
        this._renderStage();
      })));

    const def = DT_ACT[act.kind];
    if (def && def.domain)
      box.appendChild(this._dtField(def.pick || "Hedef",
        this._dtEntPicker(act, def.multi ? "entities" : "entity", def.domain, !!def.multi)));

    if (act.kind === "media")
      box.appendChild(this._dtField("Komut", this._dtSelect(
        Object.entries(DT_MEDIA), act.cmd || "play_pause",
        (v) => { act.cmd = v; this._save(); this._renderStage(); })));

    if (act.kind === "mode_set")
      box.appendChild(this._dtField("Hangi mod", this._dtSelect(
        dc.modes.map((m) => [m.name, m.name]), act.mode || (dc.modes[0] || {}).name,
        (v) => { act.mode = v; this._save(); })));

    if (act.kind === "service")
      box.appendChild(this._dtField("Servis", this._dtServiceField(act)));

    if (act.kind === "scene") {
      const sw = el("div", "dt-seg");
      const mk = (v, label) => {
        const p = el("div", "dt-pick" + ((act.smart !== false) === v ? " on" : ""), label);
        p.onclick = () => { act.smart = v; this._save(); this._renderStage(); };
        return p;
      };
      sw.appendChild(mk(true, "Zaten açıksa kapat"));
      sw.appendChild(mk(false, "Her zaman aç"));
      box.appendChild(this._dtField("Akıllı davranış", sw));
      if (act.smart !== false)
        box.appendChild(this._dtField("Kapanacak ışıklar",
          this._dtEntPicker(act, "off_entities", "light", true)));
    }
  }

  /* ---------------------------------------------------------- küçük parçalar */
  _dtField(label, node) {
    const f = el("div", "dt-fld");
    f.appendChild(el("label", null, label));
    f.appendChild(node);
    return f;
  }

  /* HA'daki GERÇEK servisleri arayan alan. "boolean toggle" yazınca
     input_boolean.toggle çıkar — kelimeler sırasız eşleşir. */
  _dtServiceField(act) {
    const w = el("div", "dt-svc");
    const inp = el("input", "dt-inp");
    inp.placeholder = "ör. ışık aç, boolean toggle, light.turn_on";
    inp.value = act.service || "";
    inp.autocomplete = "off";
    w.appendChild(inp);
    const list = el("div", "dt-svclist");
    w.appendChild(list);
    const uyari = el("div", "dt-svcbad");
    w.appendChild(uyari);
    const uyariGuncelle = () => {
      const v = (act.service || "").trim();
      if (!v) { uyari.style.display = "none"; return; }
      const ok = this._dtServiceOk(v);
      uyari.style.display = ok ? "none" : "";
      uyari.innerHTML = ok ? "" :
        "⚠ Böyle bir servis yok — <b>listeden seçmelisin</b>, elle yazılan metin çalışmaz.";
      inp.classList.toggle("bad", !ok);
    };

    // hedef cihazın domain'i — o domain'in servisleri üste çıkar
    const ents = Array.isArray(act.entities) ? act.entities : (act.entity ? [act.entity] : []);
    const tercih = ents.length ? ents[0].split(".")[0] : null;

    // tüm servisler: {id, hay(aranan metin), name}
    const all = [];
    const svcs = (this._hass && this._hass.services) || {};
    for (const dom of Object.keys(svcs)) {
      for (const s of Object.keys(svcs[dom] || {})) {
        const meta = svcs[dom][s] || {};
        const id = dom + "." + s;
        all.push({
          id, dom,
          name: meta.name || s.replace(/_/g, " "),
          hay: _dtNorm(id + " " + (meta.name || "") + " " + (meta.description || "")),
        });
      }
    }
    all.sort((a, b) => a.id.localeCompare(b.id));

    const render = () => {
      const ham = inp.value.trim();
      const q = _dtNorm(ham);
      list.innerHTML = "";
      if (!q) { list.style.display = "none"; return; }
      list.style.display = "";
      // her kelime geçmeli (sıra önemsiz) — "boolean toggle" → input_boolean.toggle
      const kelimeler = q.split(/\s+/);
      let hits = all.filter((s) => kelimeler.every((k) => s.hay.includes(k)));
      // tam eşleşme ve hedef domain öne
      hits.sort((a, b) => {
        const ta = (a.id === ham ? 0 : 1) - (b.id === ham ? 0 : 1);
        if (ta) return ta;
        const da = (tercih && a.dom === tercih ? 0 : 1) - (tercih && b.dom === tercih ? 0 : 1);
        if (da) return da;
        return a.id.localeCompare(b.id);
      });
      if (!hits.length) { list.appendChild(el("div", "gb-empty", "Eşleşen servis yok.")); return; }
      for (const s of hits.slice(0, 60)) {
        const r = el("div", "dt-svcrow" + (s.id === act.service ? " on" : ""));
        r.appendChild(el("div", "dt-svcid", esc(s.id)));
        r.appendChild(el("div", "dt-svcn", esc(s.name)));
        if (tercih && s.dom === tercih) r.appendChild(el("span", "dt-svctag", "hedefe uygun"));
        r.onclick = () => {
          act.service = s.id;
          inp.value = s.id;
          this._save();
          list.style.display = "none";
          uyariGuncelle();
          this._flash("Servis seçildi: " + s.id);
        };
        list.appendChild(r);
      }
    };

    inp.oninput = () => { act.service = inp.value.trim(); this._save(); render(); uyariGuncelle(); };
    inp.onfocus = () => render();
    render();
    uyariGuncelle();
    return w;
  }

  _dtSelect(pairs, value, onChange) {
    const s = document.createElement("select");
    s.className = "dt-inp";
    for (const [v, label] of pairs) {
      const o = document.createElement("option");
      o.value = v; o.textContent = label;
      if (v === value) o.selected = true;
      s.appendChild(o);
    }
    s.onchange = () => onChange(s.value);
    return s;
  }

  _dtNumber(value, unit, onChange) {
    const w = el("div", "dt-num");
    const i = document.createElement("input");
    i.className = "dt-inp";
    i.type = "number";
    i.value = value;
    i.oninput = () => { const v = parseFloat(i.value); if (!isNaN(v)) onChange(v); };
    w.appendChild(i);
    if (unit) w.appendChild(el("span", "dt-unit", unit));
    return w;
  }

  /* entity seçici — odalara göre gruplu, aramalı */
  _dtEntPicker(obj, field, domain, multi, filtre) {
    const w = el("div", "dt-pick-wrap");
    const cur = () => {
      const v = obj[field];
      return multi ? (Array.isArray(v) ? v : []) : (v ? [v] : []);
    };
    for (const eid of cur()) {
      const c = el("span", "dt-chip");
      c.appendChild(icon(this._entIcon(eid)));
      c.appendChild(document.createTextNode(this._name(eid)));
      const x = el("button", "dt-chip-x");
      x.appendChild(icon("mdi:close"));
      x.onclick = () => {
        if (multi) obj[field] = cur().filter((e) => e !== eid);
        else obj[field] = null;
        this._save(); this._renderStage();
      };
      c.appendChild(x);
      w.appendChild(c);
    }
    const add = el("button", "dt-mini");
    add.appendChild(icon("mdi:plus"));
    add.appendChild(document.createTextNode(cur().length && !multi ? "Değiştir" : "Seç"));
    add.onclick = (ev) => this._dtOpenPicker(ev, domain, (eid) => {
      if (multi) { const a = cur(); if (!a.includes(eid)) a.push(eid); obj[field] = a; }
      else obj[field] = eid;
      this._save(); this._renderStage();
    }, filtre);
    w.appendChild(add);
    return w;
  }

  /* filtre: "ses" -> yalnızca sesi değiştirilebilen cihazlar.
     Yetenek HA'dan (supported_features) okunur — hangi sistemde kurulursa
     o sistemdeki cihazlara göre çalışır, sabit liste YOKTUR. */
  _dtOpenPicker(ev, domain, onPick, filtre) {
    this._closePop();
    const doms = String(domain).split("|");
    const uygun = (eid) => filtre === "ses" ? this._dtSesVar(eid) : true;
    const pop = el("div", "pop dt-pop");
    const inp = el("input", "set-search");
    inp.placeholder = "Ara… (isim ya da entity_id)";
    pop.appendChild(inp);
    const list = el("div", "dt-poplist");
    pop.appendChild(list);

    const all = Object.keys(this._hass.states)
      .filter((e) => doms.includes(e.split(".")[0]) && uygun(e))
      .sort((a, b) => this._name(a).localeCompare(this._name(b), "tr"));
    if (filtre === "ses")
      pop.insertBefore(el("div", "dt-note",
        `Sesi değiştirilebilen <b>${all.length}</b> cihaz bulundu.`), list);

    const render = () => {
      const q = inp.value.trim().toLowerCase();
      list.innerHTML = "";
      let n = 0;
      for (const eid of all) {
        if (q && !(this._name(eid) + " " + eid).toLowerCase().includes(q)) continue;
        if (++n > 200) break;
        const r = el("div", "pop-item");
        r.appendChild(icon(this._entIcon(eid)));
        const t = el("div", "dt-pi");
        t.appendChild(el("div", "dt-pin", this._name(eid)));
        t.appendChild(el("div", "dt-pie", eid));
        r.appendChild(t);
        r.onclick = () => { this._closePop(); onPick(eid); };
        list.appendChild(r);
      }
      if (!n) list.appendChild(el("div", "gb-empty", "Eşleşen cihaz yok."));
    };
    inp.oninput = render;
    render();

    const host = ev.target.getRootNode().host ? this.shadowRoot : this.shadowRoot;
    host.appendChild(pop);
    const r = ev.target.getBoundingClientRect();
    const hr = this.getBoundingClientRect();
    pop.style.left = Math.max(8, Math.min(r.left - hr.left, hr.width - 340)) + "px";
    pop.style.top = (r.bottom - hr.top + 6) + "px";
    const close = (e) => { if (!pop.contains(e.composedPath ? e.composedPath()[0] : e.target)) this._closePop(); };
    setTimeout(() => document.addEventListener("click", close, true), 0);
    this._popCloser = () => { document.removeEventListener("click", close, true); pop.remove(); };
    ev.stopPropagation();
    setTimeout(() => inp.focus(), 50);
  }

  /* --- tuş testi: gelen sinyali canlı göster --- */
  /* YEDEKLER — tüm panel yapılandırmasının anlık kopyaları.
     Al / geri yükle / sil. Config tek gerçek kaynak olduğu için bir yedeği
     geri yüklemek tüm cihazları/modları/tuşları o ana döndürür. */
  async _dtBackups() {
    this._closePop();
    const pop = el("div", "pop dt-test dt-bpop");
    pop.appendChild(el("div", "dt-ih", "Yedekler"));
    pop.appendChild(el("div", "dt-note",
      "Tüm Presto ayarlarının (cihazlar, modlar, tuşlar) anlık kopyası. " +
      "Bir yedeği geri yüklersen her şey o ana döner. En yeni 30 yedek tutulur."));

    const alRow = el("div", "dt-brow");
    const note = el("input", "dt-inp");
    note.placeholder = "Not (ör. 'otomasyonları silmeden önce')";
    alRow.appendChild(note);
    const alBtn = el("button", "btn");
    alBtn.appendChild(icon("mdi:content-save-plus-outline"));
    alBtn.appendChild(document.createTextNode("Şimdi yedekle"));
    alRow.appendChild(alBtn);
    pop.appendChild(alRow);

    // --- bilgisayara indir / dosyadan yükle ---
    const indir = (obj, ad) => {
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = ad;
      document.body.appendChild(a); a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    };
    const dosyaRow = el("div", "dt-brow");
    const inBtn = el("button", "dt-mini");
    inBtn.appendChild(icon("mdi:download"));
    inBtn.appendChild(document.createTextNode("Mevcut hali bilgisayara indir"));
    inBtn.onclick = async () => {
      try {
        const cfg = await this._hass.callApi("GET", "dial_tap/config");
        const t = new Date();
        indir(cfg, `presto-yedek-${t.getFullYear()}${String(t.getMonth() + 1).padStart(2, "0")}${String(t.getDate()).padStart(2, "0")}-${String(t.getHours()).padStart(2, "0")}${String(t.getMinutes()).padStart(2, "0")}.json`);
        this._flash("İndirildi ✓");
      } catch (e) { this._flash("İndirilemedi", true); }
    };
    dosyaRow.appendChild(inBtn);
    const ykBtn = el("button", "dt-mini");
    ykBtn.appendChild(icon("mdi:upload"));
    ykBtn.appendChild(document.createTextNode("Dosyadan geri yükle"));
    ykBtn.onclick = () => {
      const inp = document.createElement("input");
      inp.type = "file"; inp.accept = "application/json,.json";
      inp.onchange = async () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        try {
          const cfg = JSON.parse(await f.text());
          if (!cfg || typeof cfg !== "object") throw new Error("geçersiz");
          if (!confirm("Bu dosyayı geri yükle? Şu anki tüm Presto ayarların DEĞİŞECEK.")) return;
          await this._hass.callApi("POST", "dial_tap/backups", { action: "import", config: cfg });
          this._flash("Dosyadan yüklendi — sayfa yenileniyor");
          setTimeout(() => location.reload(), 900);
        } catch (e) { this._flash("Dosya okunamadı ya da geçersiz", true); }
      };
      inp.click();
    };
    dosyaRow.appendChild(ykBtn);
    pop.appendChild(dosyaRow);

    const list = el("div", "dt-blist");
    pop.appendChild(list);

    const fmt = (iso) => {
      try { const d = new Date(iso);
        return d.toLocaleDateString("tr") + " " + d.toLocaleTimeString("tr", { hour: "2-digit", minute: "2-digit" });
      } catch (e) { return iso; }
    };
    const ciz = (items) => {
      list.innerHTML = "";
      if (!items || !items.length) { list.appendChild(el("div", "gb-empty", "Henüz yedek yok.")); return; }
      for (const s of items) {
        const r = el("div", "dt-brow2");
        const t = el("div", "dt-binfo");
        t.appendChild(el("div", "dt-bt", fmt(s.ts) + (s.note ? " · " + esc(s.note) : "")));
        t.appendChild(el("div", "dt-bs", `${s.devices} cihaz`));
        r.appendChild(t);
        const geri = el("button", "dt-mini");
        geri.appendChild(icon("mdi:history"));
        geri.appendChild(document.createTextNode("Geri yükle"));
        geri.onclick = async () => {
          if (!confirm("Bu yedeği geri yükle? Şu anki tüm Presto ayarların bununla DEĞİŞECEK.")) return;
          try {
            await this._hass.callApi("POST", "dial_tap/backups", { action: "restore", id: s.id });
            this._flash("Yedek geri yüklendi — sayfa yenileniyor");
            setTimeout(() => location.reload(), 900);
          } catch (e) { this._flash("Geri yüklenemedi", true); }
        };
        r.appendChild(geri);
        const ind = el("button", "dt-mini");
        ind.appendChild(icon("mdi:download"));
        ind.title = "Bu yedeği bilgisayara indir";
        ind.onclick = async () => {
          try {
            const res = await this._hass.callApi("POST", "dial_tap/backups", { action: "export", id: s.id });
            indir(res.config, `presto-yedek-${s.id}.json`);
            this._flash("İndirildi ✓");
          } catch (e) { this._flash("İndirilemedi", true); }
        };
        r.appendChild(ind);
        const sil = el("button", "dt-mini");
        sil.appendChild(icon("mdi:close"));
        sil.title = "Yedeği sil";
        sil.onclick = async () => {
          try {
            const res = await this._hass.callApi("POST", "dial_tap/backups", { action: "delete", id: s.id });
            ciz(res.items);
          } catch (e) { this._flash("Silinemedi", true); }
        };
        r.appendChild(sil);
        list.appendChild(r);
      }
    };

    alBtn.onclick = async () => {
      try {
        const res = await this._hass.callApi("POST", "dial_tap/backups", { action: "create", note: note.value.trim() });
        note.value = "";
        this._flash("Yedek alındı ✓");
        ciz(res.items);
      } catch (e) { this._flash("Yedek alınamadı", true); }
    };

    const cls = el("button", "dt-mini");
    cls.appendChild(icon("mdi:close"));
    cls.appendChild(document.createTextNode("Kapat"));
    cls.onclick = () => this._closePop();
    pop.appendChild(cls);

    this.shadowRoot.appendChild(pop);
    pop.style.left = "50%"; pop.style.top = "80px"; pop.style.transform = "translateX(-50%)";
    this._popCloser = () => pop.remove();

    try { ciz((await this._hass.callApi("GET", "dial_tap/backups")).items); }
    catch (e) { list.appendChild(el("div", "gb-empty", "Yedekler okunamadı.")); }
  }

  _dtTest(dev) {
    this._closePop();
    const pop = el("div", "pop dt-test");
    pop.appendChild(el("div", "dt-ih", "Tuş Testi"));
    pop.appendChild(el("div", "dt-note", "Cihazdaki tuşlara bas / dial'ı çevir — gelen sinyal burada görünür."));
    const log = el("div", "dt-log");
    log.appendChild(el("div", "gb-empty", "Bekleniyor…"));
    pop.appendChild(log);

    // ÖNEMLİ: tuş basışları HA'da entity DEĞİL — z2m onları sadece MQTT device
    // trigger olarak yayınlar. Bu yüzden state izlemek işe yaramaz; otomasyonun
    // kullandığı tetikleyicilerin AYNISINA canlı abone oluyoruz (subscribe_trigger).
    const trigs = [];
    for (let n = 1; n <= 4; n++) {
      trigs.push(this._dtBtnTrigger(dev, n, "single", `Tuş ${n} — tek bas`));
      trigs.push(this._dtBtnTrigger(dev, n, "hold", `Tuş ${n} — uzun bas`));
    }
    const dialAd = { cw_s: "Dial → sağa yavaş", cw_f: "Dial → sağa HIZLI",
      ccw_s: "Dial → sola yavaş", ccw_f: "Dial → sola HIZLI",
      cw: "Dial → saat yönü", ccw: "Dial → ters yön" };
    if (dev.type !== "dimmer")   // dimmer'da dial yok
      for (const t of this._dtDialTriggers(dev)) trigs.push(Object.assign({}, t, { id: dialAd[t.id] || t.id }));

    let first = true;
    const yaz = (etiket) => {
      if (first) { log.innerHTML = ""; first = false; }
      const row = el("div", "dt-logrow", esc(etiket));
      log.insertBefore(row, log.firstChild);
      while (log.childElementCount > 12) log.removeChild(log.lastChild);
    };

    let unsub = null;
    this._hass.connection.subscribeMessage(
      (msg) => {
        const t = msg && msg.variables && msg.variables.trigger;
        yaz((t && t.id) || "sinyal geldi");
      },
      { type: "subscribe_trigger", trigger: trigs }
    ).then((u) => { unsub = u; })
     .catch((err) => {
       log.innerHTML = "";
       log.appendChild(el("div", "gb-empty",
         "Dinleme başlatılamadı: " + esc(this._dtErrText(err))));
     });

    const cls = el("button", "dt-mini");
    cls.appendChild(icon("mdi:close"));
    cls.appendChild(document.createTextNode("Kapat"));
    cls.onclick = () => this._closePop();
    pop.appendChild(cls);

    this.shadowRoot.appendChild(pop);
    pop.style.left = "50%"; pop.style.top = "120px"; pop.style.transform = "translateX(-50%)";
    this._popCloser = () => { try { if (unsub) unsub(); } catch (e) {} pop.remove(); };
  }

  /* ============================================ OTOMASYON ÜRETİMİ
     Hedef: panel kapalıyken de çalışan GERÇEK HA otomasyonu.
     Yardımcı (helper) kurulmaz: mod durumu entegrasyonun kendi select
     entity'sinde, çift basma ise otomasyonun içindeki wait_for_trigger'da. */

  /* debounce'suz kayıt — select entity'sinin hemen oluşması için */
  async _dtSaveNow() {
    clearTimeout(this._saveTimer);
    await this._hass.callApi("POST", "dial_tap/config", this._cfg);
  }

  /* mod select entity'si oluşana kadar kısa süre bekle */
  async _dtWaitModeEntity(key, tries) {
    for (let i = 0; i < (tries || 6); i++) {
      const e = this._dtModeEntity(key);
      if (e) return e;
      await new Promise((r) => setTimeout(r, 700));
    }
    return null;
  }

  /* --- tetikleyiciler --- */
  _dtBtnTrigger(dev, n, kind, id) {
    if (dev.path === "z2m-manual") {
      const tm = (dev.trigMap || {})[n]; const tr = tm && tm[kind === "hold" ? "hold" : "press"];
      if (!tr) return null;
      const t = { trigger: "device", domain: "mqtt", device_id: dev.device_id, type: tr.type, subtype: tr.subtype };
      if (id) t.id = id;
      return t;
    }
    if (dev.path === "hue") {
      const t = { trigger: "state", entity_id: dev.buttons[n], attribute: "event_type",
        to: kind === "hold" ? "long_press" : "short_release" };
      if (id) t.id = id;
      return t;
    }
    const t = { trigger: "device", domain: "mqtt", device_id: dev.device_id, type: "action",
      subtype: kind === "hold" ? `button_${n}_hold` : `button_${n}_press_release` };
    if (id) t.id = id;
    return t;
  }

  _dtDialTriggers(dev) {
    if (dev.path === "hue") {
      return [
        { trigger: "state", entity_id: dev.dialEntity, attribute: "event_type", to: "clock_wise", id: "cw" },
        { trigger: "state", entity_id: dev.dialEntity, attribute: "event_type", to: "counter_clock_wise", id: "ccw" },
      ];
    }
    const mk = (sub, id) => ({ trigger: "device", domain: "mqtt", device_id: dev.device_id,
      type: "action", subtype: sub, id });
    return [
      mk("dial_rotate_right_slow", "cw_s"), mk("dial_rotate_right_fast", "cw_f"),
      mk("dial_rotate_left_slow", "ccw_s"), mk("dial_rotate_left_fast", "ccw_f"),
    ];
  }

  /* --- bir atamanın HA aksiyon listesi --- */
  /* Bir tetikleyicinin TÜM aksiyonları: 1. işlem + varsa ek işlemler (act.extra).
     Tuşa basınca hepsi sırayla çalışır. */
  _dtActions(act, modeEnt) {
    const out = this._dtTekAksiyon(act, modeEnt);
    if (!out.length) return out;   // 1. işlem boşsa ekler de anlamsız
    for (const ex of (act.extra || [])) out.push(...this._dtTekAksiyon(ex, modeEnt));
    return out;
  }

  _dtTekAksiyon(act, modeEnt) {
    if (!act || !act.kind || act.kind === "none") return [];
    const ents = Array.isArray(act.entities) ? act.entities : (act.entity ? [act.entity] : []);
    switch (act.kind) {
      case "scene": {
        // Birden çok sahne seçilebilir — scene.turn_on hepsini birden uygular.
        // Eski kayıtlarda tek 'entity' vardı, geriye dönük destekleniyor.
        const sahneler = Array.isArray(act.entities) ? act.entities : (act.entity ? [act.entity] : []);
        if (!sahneler.length) return [];
        const scene = [{ action: "scene.turn_on", target: { entity_id: sahneler } }];
        const off = Array.isArray(act.off_entities) ? act.off_entities : [];
        if (act.smart === false || !off.length) return scene;
        // "zaten açıksa kapat" — sahne ışıkları yanıyorsa ikinci basış söndürür
        return [{
          choose: [{
            conditions: [{ condition: "state", entity_id: off, state: "on" }],
            sequence: [{ action: "homeassistant.turn_off", target: { entity_id: off } }],
          }],
          default: scene,
        }];
      }
      case "on": case "off": case "toggle": {
        if (!ents.length) return [];
        // Sahneler açılıp kapanmaz — hedef ne olursa olsun scene.turn_on ile çalışır.
        // scene.* ve script.* hedeflerini ayır, gerisine normal servisi uygula.
        const sahne = ents.filter((e) => e.startsWith("scene."));
        const skript = ents.filter((e) => e.startsWith("script."));
        const diger = ents.filter((e) => !e.startsWith("scene.") && !e.startsWith("script."));
        const svc = { on: "homeassistant.turn_on", off: "homeassistant.turn_off", toggle: "homeassistant.toggle" }[act.kind];
        const out = [];
        if (diger.length) out.push({ action: svc, target: { entity_id: diger } });
        // scene: her zaman turn_on (kapatılamaz). script: on/toggle=çalıştır, off=durdur.
        for (const e of sahne) out.push({ action: "scene.turn_on", target: { entity_id: e } });
        for (const e of skript) out.push({
          action: act.kind === "off" ? "script.turn_off" : "script.turn_on", target: { entity_id: e } });
        return out;
      }
      case "script":
        return act.entity ? [{ action: "script.turn_on", target: { entity_id: act.entity } }] : [];
      case "media": {
        if (!act.entity) return [];
        const svc = { play_pause: "media_play_pause", next: "media_next_track",
          prev: "media_previous_track", stop: "media_stop" }[act.cmd || "play_pause"];
        return [{ action: "media_player." + svc, target: { entity_id: act.entity } }];
      }
      case "mode_next":
        return modeEnt ? [{ action: "select.select_next", target: { entity_id: modeEnt }, data: { cycle: true } }] : [];
      case "mode_set":
        return modeEnt && act.mode
          ? [{ action: "select.select_option", target: { entity_id: modeEnt }, data: { option: act.mode } }] : [];
      case "service":
        if (!act.service) return [];
        return [ents.length
          ? { action: act.service, target: { entity_id: ents } }
          : { action: act.service }];
      default:
        return [];
    }
  }

  /* --- dial adımının aksiyonu (yön işareti step ile gelir) --- */
  /* "sadece açık ışıklar" hedef şablonu.
     expand() Hue/HA ışık gruplarını AÇMAZ (grubun kendisini döndürür), bu yüzden
     grubun entity_id özniteliğini elle okuyup üyelere iniyoruz; sonra o an açık
     olanları süzüyoruz. Böylece dial kapalı ışıkları yakmaz. */
  _dtAcikTpl(ents) {
    return `{% set ns = namespace(l=[]) %}` +
      `{% for t in ${JSON.stringify(ents)} %}` +
      `{% set u = state_attr(t,'entity_id') %}` +
      `{% set ns.l = ns.l + (u | list if u else [t]) %}` +
      `{% endfor %}` +
      `{{ ns.l | select('is_state','on') | list }}`;
  }

  _dtDialAction(d, step, volEnt) {
    const ents = Array.isArray(d.entities) ? d.entities : [];
    if (!ents.length) return [];
    // ışık hedefi: "sadece açık olanlar" seçiliyse şablonla süz (varsayılan açık)
    const sadeceAcik = d.sadeceAcik !== false;
    const isikHedef = sadeceAcik ? this._dtAcikTpl(ents) : ents;
    switch (d.kind) {
      case "brightness":
        return [{ action: "light.turn_on", target: { entity_id: isikHedef },
          data: { brightness_step_pct: step } }];
      case "volume": {
        // step YÜZDE cinsinden.
        const stepEnts = ents.filter((e) => this._dtSesStep(e));
        const setEnts = ents.filter((e) => !this._dtSesStep(e));
        const out = [];
        // 1) volume_up/down destekleyenler: doğrudan kademe — okuma gerekmez
        if (stepEnts.length) {
          const kez = Math.max(1, Math.round(Math.abs(step) / 5));
          out.push({ repeat: { count: kez, sequence: [
            { action: step > 0 ? "media_player.volume_up" : "media_player.volume_down",
              target: { entity_id: stepEnts } }] } });
        }
        // 2) sadece volume_set destekleyenler (Alexa, tablet, cast...):
        //    cihazın sesini OKUMUYORUZ — o değer gecikmeli gelir ve hızlı çevirmede
        //    her komut aynı bayat değeri okuyup ses tek adımda takılır.
        //    Bunun yerine entegrasyonun kendi number entity'sinde tutuyoruz:
        //    önce orayı güncelle (anında), sonra o değeri cihaza yaz.
        //    Cihaza YAZMA burada YAPILMAZ: Alexa/cast komutları buluta gider
        //    (~100 ms). Hızlı çevirmede 30+ komut sıraya girer, ses sen bıraktıktan
        //    saniyeler sonra hâlâ değişir. Bunun yerine sadece takipçiyi güncelliyoruz;
        //    cihaza yazma işini "ses aynalama" otomasyonu, çevirme bitince TEK
        //    komutla yapıyor.
        if (setEnts.length && volEnt) {
          out.push({ action: "number.set_value", target: { entity_id: volEnt },
            data: { value: `{{ [[ (states('${volEnt}') | float(30)) + (${step}), 0 ] | max, 100 ] | min }}` } });
        }
        return out;
      }
      case "temperature":
        return [{ repeat: { for_each: ents, sequence: [
          { action: "climate.set_temperature", target: { entity_id: "{{ repeat.item }}" },
            data: { temperature: `{{ (state_attr(repeat.item, 'temperature') | float(20)) + (${step}) }}` } }] } }];
      case "color_temp":
        // renk sıcaklığı her ışık için ayrı hesaplanır; hedef listesi de süzülebilir
        return [{ repeat: { for_each: isikHedef, sequence: [
          { action: "light.turn_on", target: { entity_id: "{{ repeat.item }}" },
            data: { color_temp_kelvin:
              `{{ [[ (state_attr(repeat.item, 'color_temp_kelvin') | int(3000)) + (${step}), 2000 ] | max, 6500 ] | min }}` } }] } }];
      default:
        return [];
    }
  }

  /* --- bir mod için tuş otomasyonu --- */
  _dtButtonAuto(dev, dc, mode, modeEnt) {
    const triggers = [];
    const branches = [];
    let hasDouble = false;

    for (let n = 1; n <= 4; n++) {
      const slot = "b" + n;
      const single = mode.btns[slot];
      const dbl = mode.btns[slot + "_double"];
      const hold = mode.btns[slot + "_hold"];
      // Mod değiştir atamaları buraya GİRMEZ — mod koşulsuz ayrı otomasyona gider
      // (aksi halde iki mod otomasyonu aynı tuşta yarışır, mod anında geri döner)
      const gec = (a) => a && (a.kind === "mode_next" || a.kind === "mode_set");
      const sAct = gec(single) ? [] : this._dtActions(single, modeEnt);
      const dAct = gec(dbl) ? [] : this._dtActions(dbl, modeEnt);
      const hAct = gec(hold) ? [] : this._dtActions(hold, modeEnt);

      if (sAct.length || dAct.length) {
        triggers.push(this._dtBtnTrigger(dev, n, "single", slot));
        if (dAct.length) {
          hasDouble = true;
          branches.push({
            conditions: [{ condition: "trigger", id: slot }],
            sequence: [
              { wait_for_trigger: [this._dtBtnTrigger(dev, n, "single", null)],
                timeout: { milliseconds: (dbl && dbl.win) || DT_DBL_WIN }, continue_on_timeout: true },
              { if: [{ condition: "template", value_template: "{{ wait.trigger is not none }}" }],
                then: dAct, else: sAct },
            ],
          });
        } else {
          branches.push({ conditions: [{ condition: "trigger", id: slot }], sequence: sAct });
        }
      }
      if (hAct.length) {
        triggers.push(this._dtBtnTrigger(dev, n, "hold", slot + "h"));
        branches.push({ conditions: [{ condition: "trigger", id: slot + "h" }], sequence: hAct });
      }
    }
    if (!triggers.length) return null;

    const conditions = [];
    if (modeEnt && dc.modes.length > 1)
      conditions.push({ condition: "state", entity_id: modeEnt, state: mode.name });

    const ha = { triggers, conditions, actions: [{ choose: branches }] };
    // çift basma beklerken ikinci basışın YENİ bir çalışma başlatmaması gerekir
    if (hasDouble) { ha.mode = "single"; ha.max_exceeded = "silent"; }
    else { ha.mode = "queued"; ha.max = 10; }

    return {
      id: `dt_${_dtSlug(dev.key)}_${mode.id}_btn`,
      name: `${dc.name} · ${mode.name} · Tuşlar`,
      enabled: true, freeform: true, ha,
      summary: `${dc.name} — ${mode.name}: ${branches.length} tuş ataması`,
    };
  }

  /* --- bir mod için dial otomasyonu --- */
  _dtDialAuto(dev, dc, mode, modeEnt) {
    const d = mode.dial;
    if (!d || !d.kind || d.kind === "none") return null;
    if (!(d.entities || []).length) return null;
    const slow = d.slow != null ? d.slow : DT_DIAL[d.kind].slow;
    const fast = d.fast != null ? d.fast : DT_DIAL[d.kind].fast;
    // ses için entegrasyonun kendi takip entity'si (cihazın gecikmeli değeri yerine)
    const volEnt = d.kind === "volume" ? this._dtVolEntity(dev.key) : null;

    let branches;
    if (dev.path === "hue") {
      const hizli = { condition: "template",
        value_template: "{{ (trigger.to_state.attributes.steps | int(0)) > 30 }}" };
      branches = [
        { conditions: [{ condition: "trigger", id: "cw" }, hizli], sequence: this._dtDialAction(d, fast, volEnt) },
        { conditions: [{ condition: "trigger", id: "cw" }], sequence: this._dtDialAction(d, slow, volEnt) },
        { conditions: [{ condition: "trigger", id: "ccw" }, hizli], sequence: this._dtDialAction(d, -fast, volEnt) },
        { conditions: [{ condition: "trigger", id: "ccw" }], sequence: this._dtDialAction(d, -slow, volEnt) },
      ];
    } else {
      branches = [
        { conditions: [{ condition: "trigger", id: "cw_s" }], sequence: this._dtDialAction(d, slow, volEnt) },
        { conditions: [{ condition: "trigger", id: "cw_f" }], sequence: this._dtDialAction(d, fast, volEnt) },
        { conditions: [{ condition: "trigger", id: "ccw_s" }], sequence: this._dtDialAction(d, -slow, volEnt) },
        { conditions: [{ condition: "trigger", id: "ccw_f" }], sequence: this._dtDialAction(d, -fast, volEnt) },
      ];
    }

    const conditions = [];
    if (modeEnt && dc.modes.length > 1)
      conditions.push({ condition: "state", entity_id: modeEnt, state: mode.name });

    return {
      id: `dt_${_dtSlug(dev.key)}_${mode.id}_dial`,
      name: `${dc.name} · ${mode.name} · Dial`,
      enabled: true, freeform: true,
      ha: { triggers: this._dtDialTriggers(dev), conditions,
        actions: [{ choose: branches }], mode: "queued", max: 25 },
      summary: `${dc.name} — ${mode.name}: çevirme → ${DT_DIAL[d.kind].label.toLowerCase()} ±${slow}/${fast}`,
    };
  }

  /* --- SES AYNALAMA ---
     Dial çevirirken takipçi (number) anında güncellenir — ekranda ve mantıkta
     gecikme yok. Ama Alexa/cast cihazlarına her adımda komut göndermek buluta
     30+ istek demek; ses sen bıraktıktan saniyeler sonra hâlâ oynar.
     Bu otomasyon takipçinin DURULMASINI bekler (for: 400ms) ve cihaza TEK
     komut yazar. volume_up destekleyen cihazlar buraya girmez, onlar anında. */
  _dtVolMirrorAuto(dev, dc, modeEnt, volEnt) {
    if (!volEnt) return null;
    const branches = [];
    for (const m of dc.modes) {
      const d = m.dial;
      if (!d || d.kind !== "volume") continue;
      const setEnts = (d.entities || []).filter((e) => !this._dtSesStep(e));
      if (!setEnts.length) continue;
      const seq = [{ action: "media_player.volume_set", target: { entity_id: setEnts },
        data: { volume_level: `{{ (states('${volEnt}') | float(30)) / 100 }}` } }];
      branches.push(modeEnt && dc.modes.length > 1
        ? { conditions: [{ condition: "state", entity_id: modeEnt, state: m.name }], sequence: seq }
        : { conditions: [], sequence: seq });
    }
    if (!branches.length) return null;

    return {
      id: `dt_${_dtSlug(dev.key)}_volmirror`,
      name: `${dc.name} · Ses aynalama`,
      enabled: true, freeform: true,
      ha: {
        triggers: [{ trigger: "state", entity_id: volEnt, for: { milliseconds: 400 } }],
        conditions: [],
        actions: [{ choose: branches }],
        mode: "restart",
      },
      summary: "Çevirme bitince ses cihaza tek komutla yazılır (bulut cihazlarını yormaz)",
    };
  }

  /* --- mod göstergesi: select değişince ışık modun rengini gösterir ---
     "flash"da ışığın o anki hali scene.create ile anlık kaydedilir, sonra
     scene.turn_on ile aynen geri yüklenir — helper/scene dosyası gerekmez. */
  _dtIndicatorAuto(dev, dc, modeEnt) {
    const ind = dc.indicator;
    if (!ind || !ind.kind || ind.kind === "none") return null;
    if (!modeEnt || dc.modes.length < 2) return null;
    // her modun kendi ışığı olabilir; yoksa varsayılana düşer
    const isikOf = (m) => m.indEntity || ind.entity || null;
    if (!dc.modes.some((m) => isikOf(m))) return null;

    const hex2rgb = (h) => {
      const s = String(h || "#3b82f6").replace("#", "");
      return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    };
    const snapId = "dt_ind_" + _dtSlug(dev.key);
    const kez = Math.max(1, Math.min(10, ind.times || DT_BLINK_TIMES));
    const sure = ind.secs != null ? ind.secs : DT_BLINK_SECS;
    const branches = [];
    dc.modes.forEach((m, i) => {
      const isik = isikOf(m);
      if (!isik) return;   // bu moda ışık verilmemiş, atla
      const renk = hex2rgb(m.color || DT_MODE_COLORS[i]);
      const yak = { action: "light.turn_on", target: { entity_id: isik },
        data: { rgb_color: renk, brightness_pct: 90 } };
      const seq = ind.kind === "hold" ? [yak] : [
        // ışığın o anki halini anlık kaydet (helper/scene dosyası gerekmez)
        { action: "scene.create", data: { scene_id: snapId, snapshot_entities: [isik] } },
        { repeat: { count: kez, sequence: [
          yak,
          { delay: { seconds: sure } },
          { action: "light.turn_off", target: { entity_id: isik } },
          { delay: { seconds: sure } },
        ] } },
        { action: "scene.turn_on", target: { entity_id: "scene." + snapId } },
      ];
      branches.push({ conditions: [{ condition: "state", entity_id: modeEnt, state: m.name }], sequence: seq });
    });
    if (!branches.length) return null;

    return {
      id: `dt_${_dtSlug(dev.key)}_ind`,
      name: `${dc.name} · Mod göstergesi`,
      enabled: true, freeform: true,
      ha: {
        triggers: [{ trigger: "state", entity_id: modeEnt }],
        conditions: [{ condition: "template",
          value_template: "{{ trigger.from_state.state != trigger.to_state.state }}" }],
        actions: [{ choose: branches }],
        mode: "restart",
      },
      summary: `Mod değişince ${this._name(ind.entity)} ${ind.kind === "hold" ? "modun renginde kalır" : "kısa yanıp eski haline döner"}`,
    };
  }

  /* --- mod değiştirici --- */
  /* MOD DEĞİŞTİR atamaları GLOBAL olmak ZORUNDA.
     Neden: mod otomasyonları aynı fiziksel tuşu dinler. Geçiş tuşu her modun
     içinde ayrı ayrı tanımlanırsa tek basışta İKİSİ birden tetiklenir; ikincisi
     koşulunu yeni moda göre değerlendirip bir kez daha geçiş yapar ve mod anında
     geri döner. Bu yüzden geçiş TEK ve mod koşulsuz bir otomasyona çıkar.
     -> { "b4_hold": {act, modeId}, ... } */
  _dtGlobalSwitches(dc) {
    const out = {};
    for (const m of dc.modes || []) {
      for (const [slot, a] of Object.entries(m.btns || {})) {
        if (a && (a.kind === "mode_next" || a.kind === "mode_set") && !out[slot])
          out[slot] = { act: a, modeId: m.id };
      }
    }
    return out;
  }

  _dtModeSwitchAuto(dev, dc, modeEnt) {
    if (!modeEnt || dc.modes.length < 2) return null;
    const glob = this._dtGlobalSwitches(dc);
    const slots = Object.keys(glob);
    if (!slots.length) return null;

    const aksiyonOf = (act) => act.kind === "mode_set" && act.mode
      ? [{ action: "select.select_option", target: { entity_id: modeEnt }, data: { option: act.mode } }]
      : [{ action: "select.select_next", target: { entity_id: modeEnt }, data: { cycle: true } }];

    const triggers = [];
    const branches = [];
    const etiketler = [];
    // FİZİKSEL TUŞ BAŞINA GRUPLA. Tek bas ve çift bas AYNI sinyali kullanır
    // (button_N_press_release). İkisini ayrı tetikleyici yaparsak tek basışta
    // otomasyon iki kez tetiklenir → mod iki kez değişip başa döner.
    const tusNo = [...new Set(slots.map((s) => s[1]))];
    for (const n of tusNo) {
      const uzun = glob["b" + n + "_hold"];
      if (uzun) {
        triggers.push(this._dtBtnTrigger(dev, n, "hold", "b" + n + "h"));
        branches.push({ conditions: [{ condition: "trigger", id: "b" + n + "h" }], sequence: aksiyonOf(uzun.act) });
        etiketler.push(`Tuş ${n} uzun bas`);
      }
      const tek = glob["b" + n], cift = glob["b" + n + "_double"];
      if (!tek && !cift) continue;
      const id = "b" + n;
      triggers.push(this._dtBtnTrigger(dev, n, "single", id));
      if (cift) {
        // çift bas: ikinci basışı bekle. Tek bas da atanmışsa "else" dalında çalışır.
        branches.push({ conditions: [{ condition: "trigger", id }], sequence: [
          { wait_for_trigger: [this._dtBtnTrigger(dev, n, "single", null)],
            timeout: { milliseconds: cift.act.win || DT_DBL_WIN }, continue_on_timeout: true },
          { if: [{ condition: "template", value_template: "{{ wait.trigger is not none }}" }],
            then: aksiyonOf(cift.act), else: tek ? aksiyonOf(tek.act) : [] },
        ] });
        etiketler.push(`Tuş ${n} çift bas` + (tek ? " (+ tek bas)" : ""));
      } else {
        branches.push({ conditions: [{ condition: "trigger", id }], sequence: aksiyonOf(tek.act) });
        etiketler.push(`Tuş ${n} tek bas`);
      }
    }

    // tek geçiş tuşu varsa choose'a gerek yok — düz aksiyon
    // (elle "çalıştır" denince de çalışır; choose, trigger id'siz boş geçerdi)
    const tekDal = branches.length === 1
      && !JSON.stringify(branches[0].sequence).includes("wait_for_trigger");
    const actions = tekDal ? branches[0].sequence : [{ choose: branches }];
    return {
      id: `dt_${_dtSlug(dev.key)}_modesw`,
      name: `${dc.name} · Mod değiştirici (tüm modlar)`,
      enabled: true, freeform: true,
      ha: { triggers, conditions: [], actions,
        mode: "single", max_exceeded: "silent" },
      summary: `${etiketler.join(", ")} → modlar arası geçiş (her modda çalışır)`,
    };
  }

  /* Bu ayarlardan ÜRETİLECEK otomasyon listesi (HA'ya yazmadan).
     Hem kurulum hem de "kurulmamış değişiklik var mı" karşılaştırması bunu kullanır. */
  _dtWanted(dev, dc, modeEnt) {
    const wanted = [];
    for (const m of dc.modes) {
      const b = this._dtButtonAuto(dev, dc, m, modeEnt);
      if (b) wanted.push(b);
      const d = this._dtDialAuto(dev, dc, m, modeEnt);
      if (d) wanted.push(d);
    }
    const sw = this._dtModeSwitchAuto(dev, dc, modeEnt);
    if (sw) wanted.push(sw);
    const ind = this._dtIndicatorAuto(dev, dc, modeEnt);
    if (ind) wanted.push(ind);
    const vm = this._dtVolMirrorAuto(dev, dc, modeEnt, this._dtVolEntity(dev.key));
    if (vm) wanted.push(vm);
    return wanted;
  }

  /* Panelde yaptığın değişiklikler HA'ya yazıldı mı?
     Yazılmadıysa alttaki liste GERÇEĞİ göstermez — kullanıcı "temizledim ama
     otomasyonlar duruyor" der. Bunu açıkça söylemek gerekiyor. */
  _dtKurulumFarki(dev, dc, modeEnt, rc) {
    const imza = (list) => JSON.stringify((list || []).map((a) => [a.id, a.ha]));
    const wanted = this._dtWanted(dev, dc, modeEnt);
    if (imza(wanted) === imza(rc.autos)) return null;
    return { yeni: wanted.length, kurulu: (rc.autos || []).length };
  }

  /* --- hepsini üret + HA'ya yaz --- */
  async _dtSync(dev, dc, silent) {
    const room = { id: "__dt_" + dev.key, name: dc.name };
    const rc = this._roomCfg(room.id);
    try {
      // ÖNCE denetle. Sadece GERÇEK hatalar kurulumu durdurur; uyarılar (ör. cihazda
      // mod geçiş tuşu yok — modu Alexa'dan da değiştirebilirsin) engel değildir.
      const sorunlar = this._dtValidate(dc);
      const engeller = sorunlar.filter((s) => !s.uyari);
      if (engeller.length && !silent) {
        this._dtErrors = sorunlar;
        this._flash(`${engeller.length} hatalı atama — kurulmadı`, true);
        this._renderStage();
        return;
      }
      this._dtErrors = sorunlar.length ? sorunlar : null;
      if (!silent) this._flash("Kuruluyor…");
      await this._dtSaveNow();

      let modeEnt = this._dtModeEntity(dev.key);
      if (!modeEnt && dc.modes.length) modeEnt = await this._dtWaitModeEntity(dev.key);
      // ses kullanan bir mod varsa number entity'si oluşana kadar bekle
      const sesVar = dc.modes.some((m) => m.dial && m.dial.kind === "volume");
      if (sesVar && !this._dtVolEntity(dev.key)) await this._dtWaitVolEntity(dev.key);

      const wanted = this._dtWanted(dev, dc, modeEnt);
      const oncekiDurum = {};
      for (const a of rc.autos) oncekiDurum[a.id] = a.enabled;
      for (const a of wanted) if (oncekiDurum[a.id] === false) a.enabled = false;

      // Üret, HA'ya yaz, istenmeyenleri kaldır.
      const wantIds = new Set(wanted.map((a) => a.id));
      for (const old of rc.autos) {
        if (!wantIds.has(old.id)) {
          try { await this._removeAutoHA(old); } catch (e) { /* zaten yoksa sorun değil */ }
        }
      }
      for (const a of wanted) {
        if (a.enabled === false) continue;
        await this._pushAuto(room, a);
      }
      rc.autos = wanted;
      this._save();

      if (!silent) {
        this._flash(wanted.length ? `${wanted.length} otomasyon kuruldu ✓` : "Kurulacak atama yok");
        this._renderStage();
      }
    } catch (e) {
      const msg = this._dtErrText(e);
      this._dtErrors = [{ yer: "Kurarken", mesaj: esc(msg) }];
      this._flash("Kurulamadı — " + msg, true);
      this._renderStage();
    }
  }

  /* ---------------------------------------------------------- stil */
  _dtStyle() {
    const s = document.createElement("style");
    s.textContent = `
      .dt-wrap{display:grid;grid-template-columns:280px 1fr;gap:18px;margin:16px 0 22px;}
      @media(max-width:1000px){.dt-wrap{grid-template-columns:1fr;}}
      .dt-lbl{font:700 10px/1 ui-monospace,monospace;letter-spacing:.16em;color:#7a7290;}
      .dt-mh{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
      .dt-mini{display:inline-flex;align-items:center;gap:5px;padding:6px 11px;border-radius:9px;
        background:#1c1924;color:#c9c2d6;border:1px solid #2e2839;font-size:12px;font-weight:600;cursor:pointer;}
      .dt-mini:hover{background:#262030;}
      .dt-mode{display:flex;align-items:center;gap:9px;padding:10px 11px;border-radius:12px;
        background:#15131a;border:1px solid #262130;margin-bottom:7px;cursor:pointer;}
      .dt-mode.on{border-color:#ec4b88;background:#1b1220;}
      .dt-dot{width:8px;height:8px;border-radius:50%;background:#3a3248;flex:0 0 8px;}
      .dt-dot.live{background:#4ade80;box-shadow:0 0 9px #4ade80;}
      .dt-mt{flex:1;min-width:0;}
      .dt-mn{font-size:13px;font-weight:650;}
      .dt-ms{font-size:11px;color:#8b839c;}
      /* gelişmiş ayarlar aç/kapa */
      .dt-adv{display:flex;align-items:center;gap:7px;width:100%;margin-top:14px;padding:9px 11px;
        border-radius:11px;background:#15131a;border:1px solid #262130;color:#9a92ab;
        font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;text-align:left;}
      .dt-adv:hover{background:#1b1824;color:#e8e4ee;}
      .dt-adv.on{color:#fff;border-color:#3a3248;}
      .dt-adv ha-icon{--mdc-icon-size:17px;}
      .dt-advbox{margin-top:4px;}
      /* moda sürüklenenler havuzu */
      .dt-pool{background:#131118;border:1px dashed #332c40;border-radius:14px;
        padding:13px 15px;margin:14px 0 4px;}
      .dt-poolh{display:flex;align-items:center;gap:8px;font:700 10.5px/1 ui-monospace,monospace;
        letter-spacing:.13em;color:#8b839c;margin-bottom:10px;}
      .dt-poolh ha-icon{--mdc-icon-size:16px;color:#ec4b88;}
      .dt-poolclr{margin-left:auto;display:inline-flex;align-items:center;gap:5px;
        padding:5px 10px;border-radius:8px;background:#1c1924;border:1px solid #322b3d;
        color:#9a92ab;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;letter-spacing:0;}
      .dt-poolclr:hover{border-color:#ec4b88;color:#ff9cc1;}
      .dt-poolclr ha-icon{--mdc-icon-size:14px;color:inherit;}
      .dt-poolempty{font-size:12px;line-height:1.6;color:#7d7590;}
      .dt-poolflow{display:flex;flex-wrap:wrap;gap:7px;}
      .dt-poolchip{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:10px;
        background:#1c1924;border:1px solid #322b3d;font-size:12.5px;cursor:grab;}
      .dt-poolchip:hover{border-color:#ec4b88;}
      .dt-poolchip.drag{opacity:.45;}
      .dt-poolchip ha-icon{--mdc-icon-size:16px;color:#c9a0ff;}
      /* sürükleyip bırakma hedefi */
      .dt-pad.dropok,.dt-knob.dropok{border-color:#4ade80 !important;
        box-shadow:0 0 0 3px rgba(74,222,128,.22) !important;}
      /* tuş üstündeki 3 bırakma bölgesi — sadece sürükleme sırasında görünür */
      .dt-zones{position:absolute;inset:0;display:none;flex-direction:column;
        border-radius:18px;overflow:hidden;z-index:3;}
      .dt-dial.dtdrag .dt-zones{display:flex;}
      .dt-zone{flex:1;display:flex;align-items:center;justify-content:center;
        font:700 10.5px/1 ui-monospace,monospace;letter-spacing:.08em;
        color:#cfc6da;background:rgba(12,10,16,.92);
        border-bottom:1px dashed rgba(255,255,255,.14);}
      .dt-zone:last-child{border-bottom:0;}
      .dt-zone.on{background:#14532d;color:#fff;box-shadow:inset 0 0 0 2px #4ade80;}
      .dt-sw{margin-top:16px;padding-top:14px;border-top:1px solid #221e2b;}
      .dt-colors{display:flex;flex-direction:column;gap:7px;}
      .dt-colrow{display:flex;align-items:center;gap:9px;font-size:12.5px;min-width:0;}
      .dt-colname{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
      .dt-col{width:34px;height:26px;flex:0 0 34px;padding:0;border:1px solid #2e2839;
        border-radius:7px;background:#0f0d14;cursor:pointer;}
      /* her mod için ayrı gösterge ışığı */
      .dt-modind{background:#100e15;border:1px solid #262130;border-radius:11px;padding:9px 10px;}
      .dt-modisik{display:flex;flex-direction:column;gap:5px;margin-top:7px;
        padding-top:7px;border-top:1px solid #221e2b;}
      .dt-modisikl{font:700 9.5px/1 ui-monospace,monospace;letter-spacing:.1em;
        text-transform:uppercase;color:#6f6883;}
      /* dikey seçenek listesi — taşmasın, hepsi aynı genişlikte olsun */
      .dt-vseg{display:flex;flex-direction:column;gap:6px;margin:0 0 14px;}
      .dt-vseg .dt-pick{margin-top:0;width:100%;line-height:1.35;white-space:normal;}
      .dt-modes{min-width:0;}
      .dt-sw .dt-fld{margin-bottom:12px;}
      .dt-num{min-width:0;}
      .dt-num .dt-inp{flex:1;min-width:0;}
      .dt-unit{flex:0 0 auto;}
      .dt-2col{min-width:0;}
      .dt-2col > *{min-width:0;}
      .dt-pick{padding:7px 11px;border-radius:9px;background:#0f0d14;border:1px solid #2e2839;
        font-size:12px;color:#9a92ab;cursor:pointer;margin-top:6px;}
      .dt-pick.on{background:#ec4b88;border-color:#ec4b88;color:#fff;font-weight:650;}
      .dt-seg{display:flex;gap:6px;flex-wrap:wrap;}
      .dt-seg .dt-pick{margin-top:0;}
      .dt-note{font-size:11.5px;color:#7d7590;margin-top:9px;line-height:1.5;}
      .dt-note code{background:#0f0d14;padding:1px 5px;border-radius:4px;font-size:11px;}
      .dt-warn{font-size:11.5px;line-height:1.5;color:#fbbf24;background:#241a0c;
        border:1px solid #4a3512;border-radius:10px;padding:9px 11px;margin-bottom:12px;}
      .dt-right{display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap;}
      .dt-dial{position:relative;width:330px;height:330px;flex:0 0 330px;}
      .dt-ring{position:absolute;inset:0;border-radius:50%;background:#1d1a24;
        border:2px solid #2e2839;box-shadow:inset 0 0 40px #000;}
      .dt-ringl{position:absolute;left:50%;top:-8px;transform:translateX(-50%);background:#0c0a10;
        padding:0 9px;font:700 9px/1 ui-monospace,monospace;letter-spacing:.14em;color:#ec4b88;}
      .dt-pad{position:absolute;width:132px;height:132px;background:#15131a;border:1px solid #2e2839;
        border-radius:18px;padding:10px;cursor:pointer;overflow:hidden;}
      .dt-pad:hover{border-color:#4a4159;}
      .dt-pad.sel{border-color:#ec4b88;box-shadow:0 0 0 3px rgba(236,75,136,.18);}
      .dt-pad b{display:block;font:700 9px/1 ui-monospace,monospace;letter-spacing:.12em;color:#6f6883;}
      .dt-pad span{display:block;font-size:12px;font-weight:650;margin-top:5px;line-height:1.3;}
      .dt-pad i{display:block;font-size:10.5px;color:#8b839c;font-style:normal;margin-top:3px;}
      .dt-p1{left:20px;top:20px;} .dt-p2{right:20px;top:20px;}
      .dt-p3{left:20px;bottom:20px;} .dt-p4{right:20px;bottom:20px;}
      /* DIMMER: gerçek cihaz gibi DİKEY kumanda (ON / ☀+ / ☀− / OFF) */
      .dt-rem{width:262px;flex:0 0 262px;background:#141118;border:1px solid #2e2839;
        border-radius:30px;padding:11px;display:flex;flex-direction:column;gap:9px;
        box-shadow:0 14px 40px rgba(0,0,0,.45);}
      .dt-rembtn{position:relative;border-radius:19px;background:#1b1822;border:1px solid #2e2839;
        padding:12px 14px;cursor:pointer;overflow:hidden;min-height:80px;transition:.14s;}
      .dt-rembtn:hover{border-color:#4a4159;background:#201c29;}
      .dt-rembtn.sel{border-color:#ec4b88;box-shadow:0 0 0 3px rgba(236,75,136,.18);}
      .dt-remh{display:flex;align-items:center;gap:7px;margin-bottom:5px;}
      .dt-remh ha-icon{--mdc-icon-size:17px;color:#c9a0ff;}
      .dt-remh b{font:700 9px/1 ui-monospace,monospace;letter-spacing:.11em;color:#8b839c;}
      .dt-rembtn > span{display:block;font-size:12.5px;font-weight:650;line-height:1.35;}
      .dt-rembtn i{display:block;font-size:10.5px;color:#8b839c;font-style:normal;margin-top:3px;}
      .dt-rembtn.dropok{border-color:#4ade80 !important;box-shadow:0 0 0 3px rgba(74,222,128,.22) !important;}
      .dt-rem.dtdrag .dt-zones{display:flex;}
      .dt-rem .dt-zones{border-radius:19px;}
      /* dimmer (eski 2x2 hub düzeni — artık kullanılmıyor, geriye dönük) */
      .dt-ring.dt-ring-d{border-style:solid;border-color:#2a2533;
        background:radial-gradient(circle at 50% 45%,#1a1722,#100e16);}
      .dt-hub{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:98px;height:98px;
        border-radius:50%;background:radial-gradient(circle at 35% 30%,#241f2e,#131019);
        border:1px solid #352d45;display:flex;align-items:center;justify-content:center;flex-direction:column;
        text-align:center;pointer-events:none;box-shadow:inset 0 0 26px #000,0 6px 16px rgba(0,0,0,.45);}
      .dt-hub ha-icon{--mdc-icon-size:28px;width:28px;height:28px;color:#ec4b88;}
      .dt-hub b{font:700 9px/1 ui-monospace,monospace;letter-spacing:.12em;color:#9a90a8;margin-top:6px;}
      .dt-knob{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:96px;height:96px;
        border-radius:50%;background:radial-gradient(circle at 35% 30%,#2a2434,#14121a);
        border:1px solid #3a3248;display:flex;align-items:center;justify-content:center;
        flex-direction:column;text-align:center;cursor:pointer;padding:0 8px;}
      .dt-knob.sel{border-color:#ec4b88;box-shadow:0 0 0 3px rgba(236,75,136,.18);}
      .dt-knob b{font:700 9px/1 ui-monospace,monospace;letter-spacing:.1em;color:#6f6883;}
      .dt-knob span{font-size:11px;font-weight:650;margin-top:3px;}
      .dt-insp{flex:1;min-width:300px;background:#15131a;border:1px solid #262130;
        border-radius:16px;padding:16px;}
      .dt-ih{font-size:14px;font-weight:700;margin-bottom:12px;}
      .dt-fld{margin-bottom:13px;}
      .dt-fld label{display:block;font:700 10px/1 ui-monospace,monospace;letter-spacing:.1em;
        text-transform:uppercase;color:#6f6883;margin-bottom:6px;}
      .dt-inp{width:100%;padding:9px 11px;border-radius:10px;background:#0f0d14;border:1px solid #2e2839;
        color:#e8e4ee;font-size:13px;font-family:inherit;}
      .dt-2col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
      .dt-num{display:flex;align-items:center;gap:7px;}
      .dt-unit{font-size:12px;color:#8b839c;}
      .dt-pick-wrap{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
      .dt-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:9px;
        background:#0f0d14;border:1px solid #2e2839;font-size:12px;}
      .dt-chip ha-icon{--mdc-icon-size:15px;}
      .dt-chip-x{background:none;border:0;color:#8b839c;cursor:pointer;padding:0;display:flex;}
      .dt-chip-x ha-icon{--mdc-icon-size:14px;}
      .dt-pop{position:absolute;z-index:40;width:330px;max-height:420px;overflow:auto;
        background:#15131a;border:1px solid #332c40;border-radius:14px;padding:10px;
        box-shadow:0 18px 50px rgba(0,0,0,.6);}
      .dt-poplist{margin-top:8px;}
      .dt-pi{flex:1;min-width:0;}
      .dt-pin{font-size:12.5px;font-weight:600;}
      .dt-pie{font:10.5px/1.3 ui-monospace,monospace;color:#7d7590;overflow:hidden;text-overflow:ellipsis;}
      .dt-test{position:absolute;z-index:40;width:420px;background:#15131a;border:1px solid #332c40;
        border-radius:16px;padding:16px;box-shadow:0 18px 50px rgba(0,0,0,.6);}
      .dt-err{background:#2a1116;border:1px solid #6b2030;border-radius:14px;
        padding:13px 15px;margin:14px 0 4px;}
      .dt-errh{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:700;
        color:#ff8fa3;margin-bottom:8px;}
      .dt-errh ha-icon{--mdc-icon-size:18px;}
      .dt-errh .dev-mv{margin-left:auto;}
      .dt-errrow{font-size:12.5px;line-height:1.6;color:#e8d5d9;padding:3px 0;}
      .dt-errrow b{color:#fff;}
      .dt-errrow code{background:rgba(0,0,0,.35);padding:1px 5px;border-radius:4px;font-size:11px;}
      /* kurulmamış değişiklik uyarısı */
      .addauto.bekliyor{animation:dtpulse 1.6s ease-in-out infinite;}
      @keyframes dtpulse{0%,100%{box-shadow:0 0 0 0 rgba(236,75,136,.5);}50%{box-shadow:0 0 0 6px rgba(236,75,136,0);}}
      .dt-bekle{display:flex;gap:10px;align-items:flex-start;margin:0 0 14px;padding:12px 15px;
        border-radius:13px;background:#241a0c;border:1px solid #5a3a17;color:#e8ddc9;
        font-size:12.5px;line-height:1.6;}
      .dt-bekle ha-icon{--mdc-icon-size:19px;color:#fbbf24;flex:0 0 auto;margin-top:1px;}
      .dt-bekle b{color:#fff;}
      /* uyarı (engel değil) — kuruldu ama bilmen gerekenler */
      .dt-err.sari{background:#241a0c;border-color:#5a3a17;}
      .dt-err.sari .dt-errh{color:#fbbf24;}
      .dt-err.sari .dt-errrow{color:#e8ddc9;}
      .dt-err.sari .dt-errgo{color:#fbbf24;}
      .dt-errrow.go{cursor:pointer;border-radius:8px;padding:5px 8px;margin:2px -8px;}
      .dt-errrow.go:hover{background:rgba(255,255,255,.06);}
      .dt-errgo{color:#ff8fa3;font-weight:700;margin-left:8px;white-space:nowrap;}
      .dt-pick.dolu{border-color:#5a4a6e;}
      .dt-tdot{display:inline-block;width:6px;height:6px;border-radius:50%;
        background:#ec4b88;margin-left:6px;vertical-align:middle;}
      .dt-pick.on .dt-tdot{background:#fff;}
      /* ek işlem kutusu — aynı basışta çalışan 2., 3. ... işlem */
      .dt-ek{background:#100e15;border:1px solid #2a2435;border-left:3px solid #ec4b88;
        border-radius:12px;padding:12px 13px;margin:4px 0 12px;}
      .dt-ekh{display:flex;align-items:center;gap:7px;margin-bottom:10px;
        font:700 10px/1 ui-monospace,monospace;letter-spacing:.13em;color:#ec4b88;}
      .dt-ekh ha-icon{--mdc-icon-size:15px;}
      .dt-ekh .dev-mv{margin-left:auto;}
      .dt-svcbad{font-size:11.5px;line-height:1.5;color:#ff8fa3;margin-top:6px;}
      .dt-inp.bad{border-color:#6b2030;}
      .dt-svc{position:relative;}
      .dt-svclist{margin-top:6px;max-height:230px;overflow:auto;background:#0f0d14;
        border:1px solid #2e2839;border-radius:11px;}
      .dt-svcrow{display:flex;align-items:baseline;gap:8px;padding:8px 11px;cursor:pointer;
        border-bottom:1px solid #1a1721;}
      .dt-svcrow:last-child{border-bottom:0;}
      .dt-svcrow:hover{background:#1b1824;}
      .dt-svcrow.on{background:#2a1522;}
      .dt-svcid{font:12px/1.4 ui-monospace,monospace;color:#e8e4ee;flex:0 0 auto;}
      .dt-svcn{font-size:11.5px;color:#8b839c;flex:1;min-width:0;overflow:hidden;
        text-overflow:ellipsis;white-space:nowrap;}
      .dt-svctag{font-size:10px;color:#ec4b88;border:1px solid #4a2136;border-radius:6px;
        padding:1px 6px;flex:0 0 auto;}
      /* yedekler penceresi */
      .dt-bpop{width:520px;max-height:80vh;overflow:auto;}
      .dt-brow{display:flex;gap:8px;margin:12px 0;}
      .dt-brow .dt-inp{flex:1;}
      .dt-blist{margin-top:6px;display:flex;flex-direction:column;gap:6px;}
      .dt-brow2{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:11px;
        background:#15131a;border:1px solid #262130;}
      .dt-binfo{flex:1;min-width:0;}
      .dt-bt{font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
      .dt-bs{font-size:11px;color:#8b839c;}
      .dt-log{margin:10px 0;max-height:260px;overflow:auto;}
      .dt-logrow{font:11.5px/1.6 ui-monospace,monospace;color:#5fe39a;padding:5px 9px;
        background:#0f0d14;border-radius:8px;margin-bottom:5px;}
    `;
    return s;
  }

  /* ============================================ HA'YA YAZMA (gerçek otomasyon) */

  /* tanım → HA otomasyon konfigürasyonu.
     a.ha varsa (Presto editörü / serbest) ham config; yoksa chip editörü kalıbı. */
  _compileAuto(room, a) {
    if (a.ha) {
      return {
        alias: this._haAutoName(a) || `[Presto] ${room.name} — ${a.name}`,
        description: a.desc || "Presto panelinden üretildi. Elle düzenleme — panel yeniden kaydedince ezilir.",
        mode: a.ha.mode || "restart",
        triggers: a.ha.triggers,
        conditions: a.ha.conditions || [],
        actions: a.ha.actions,
      };
    }
    const triggers = [];
    for (const e of (a.on || []))
      triggers.push({ trigger: "state", entity_id: e, to: "on", id: "giris" });
    if (a.off) {
      const t = { trigger: "state", entity_id: a.off, to: "off", id: "cikis" };
      if (a.delay > 0) t.for = { seconds: a.delay };
      triggers.push(t);
    }
    const entryCond = [{ condition: "trigger", id: "giris" }];
    if (a.cond === "lux" && a.lux_entity)
      entryCond.push({ condition: "numeric_state", entity_id: a.lux_entity, below: a.lux_below || 15 });
    if (a.cond === "sun")
      entryCond.push({ condition: "sun", after: "sunset", before: "sunrise" });
    if (a.cond === "time")
      entryCond.push({ condition: "time", after: (a.after || "22:00") + ":00", before: (a.before || "07:00") + ":00" });
    if (a.guard && a.guard.entity && (a.guard.blocked || []).length)
      entryCond.push({ condition: "not", conditions: [
        { condition: "state", entity_id: a.guard.entity, state: a.guard.blocked },
      ] });
    const branches = [{
      conditions: entryCond,
      sequence: [{ action: "homeassistant.turn_on", target: { entity_id: a.lights } }],
    }];
    if (a.off) branches.push({
      conditions: [{ condition: "trigger", id: "cikis" }],
      sequence: [{ action: "homeassistant.turn_off",
        target: { entity_id: (a.off_lights && a.off_lights.length) ? a.off_lights : a.lights } }],
    });
    return {
      alias: `[Presto] ${room.name} — ${a.name}`,
      description: "Presto panelinden üretildi. Elle düzenleme — panel yeniden kaydedince ezilir.",
      mode: "restart",
      triggers,
      conditions: [],
      actions: [{ choose: branches }],
    };
  }

  async _pushAuto(room, a) {
    const cfg = this._compileAuto(room, a);
    await this._hass.callApi("POST", "config/automation/config/oto_" + a.id, cfg);
    try { await this._tagAuto(room, a); } catch (e) { /* etiket başarısız olsa da otomasyon dursun */ }
  }

  async _removeAutoHA(a) {
    try { await this._hass.callApi("DELETE", "config/automation/config/oto_" + a.id); }
    catch (e) { /* HA'da yoksa sessiz geç */ }
  }

  /* uygulanacak etiket adları: autoLabel açıksa 'Presto' + varsa özel etiket */
  _labelNames(opLabel) {
    const names = [];
    if (this._cfg.autoLabel !== false) names.push("Presto");
    if (opLabel && String(opLabel).trim()) names.push(String(opLabel).trim());
    return names;
  }

  /* etiket adlarını bul/oluştur → label_id dizisi */
  async _ensureLabelIds(names) {
    const ws = (msg) => this._hass.callWS(msg);
    const out = [];
    let labels = [];
    try { labels = await ws({ type: "config/label_registry/list" }); } catch (e) { labels = []; }
    for (const nm of names) {
      const name = String(nm || "").trim();
      if (!name) continue;
      let hit = (labels || []).find((l) => (l.name || "").toLowerCase() === name.toLowerCase());
      if (!hit) {
        const own = name.toLowerCase() === "presto";
        try {
          hit = await ws({ type: "config/label_registry/create", name,
            color: own ? "purple" : "indigo", icon: own ? "mdi:knob" : "mdi:label-outline" });
          if (hit) labels.push(hit);
        } catch (e) { hit = null; }
      }
      if (hit && hit.label_id) out.push(hit.label_id);
    }
    return out;
  }

  /* bir entity'ye etiketleri uygula (mevcutları koruyarak ekler) */
  async _applyLabels(entId, opLabel) {
    if (!entId) return;
    const names = this._labelNames(opLabel);
    if (!names.length) return;
    try {
      const ids = await this._ensureLabelIds(names);
      if (!ids.length) return;
      const ents = await this._hass.callWS({ type: "config/entity_registry/list" });
      const cur = (ents || []).find((e) => e.entity_id === entId);
      const merged = Array.from(new Set([...((cur && cur.labels) || []), ...ids]));
      await this._hass.callWS({ type: "config/entity_registry/update", entity_id: entId, labels: merged });
    } catch (e) { /* sessiz */ }
  }

  /* otomasyon entity'sini bul → etiket + oda alanını yaz. Best-effort, 6 deneme. */
  async _tagAuto(room, a) {
    const ws = (msg) => this._hass.callWS(msg);
    let entId = null;
    for (let i = 0; i < 6 && !entId; i++) {
      if (i) await new Promise((r) => setTimeout(r, 1000));
      const ents = await ws({ type: "config/entity_registry/list" });
      const hit = (ents || []).find((e) => e.platform === "automation" && e.unique_id === "oto_" + a.id);
      if (hit) entId = hit.entity_id;
    }
    if (!entId) return;
    await this._applyLabels(entId, a.label);
    if (room.id && !room.id.startsWith("__"))
      await ws({ type: "config/entity_registry/update", entity_id: entId, area_id: room.id });
  }

  _openInHA(a) {
    this._goHA("/config/automation/edit/oto_" + a.id);
  }

  /* HA içinde herhangi bir sayfaya yumuşak geçiş (sayfa yenilenmez); olmazsa tam gezinme */
  _goHA(url) {
    try {
      history.pushState(null, "", url);
      this.dispatchEvent(new CustomEvent("location-changed",
        { bubbles: true, composed: true, detail: { replace: false } }));
    } catch (e) {
      window.location.assign(url);
    }
  }

  /* -------------------------------------------------- tarif editörü */
  _openAutoEditor(room, rc, existing) {
    this._closePop();
    // taslak: mevcut tarifin kopyası ya da akıllı varsayılanlar
    const bsens = room.ents.filter((e) => e.startsWith("binary_sensor."));
    const lights = room.ents.filter((e) => e.startsWith("light.") || e.startsWith("switch."));
    const luxAll = Object.keys(this._hass.states).filter((e) =>
      e.startsWith("sensor.") && this._hass.states[e].attributes.device_class === "illuminance");
    const luxRoom = room.ents.filter((e) => luxAll.includes(e));
    const luxOpts = luxRoom.length ? luxRoom : luxAll;

    const d = existing ? JSON.parse(JSON.stringify(existing)) : {
      id: uid(), name: "Varlıkla ışık", enabled: true,
      on: [], lights: [], off: null, delay: 60,
      cond: "none", lux_entity: luxOpts[0] || null, lux_below: 15,
      after: "22:00", before: "07:00",
    };
    if (!Array.isArray(d.off_lights)) d.off_lights = d.off_lights || [];

    const ov = el("div", "ov");
    const ed = el("div", "ed");
    ov.appendChild(ed);
    const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);

    ed.appendChild(el("div", "ed-t", existing ? "Otomasyonu Düzenle" : "Yeni Otomasyon"));
    ed.appendChild(el("div", "ed-s", room.name + " · cümleyi kur, gerisini ben hallederim"));

    const label = (txt, mdi, first) => {
      const l = el("div", "ed-l" + (first ? " first" : ""));
      l.appendChild(icon(mdi));
      l.appendChild(document.createTextNode(txt));
      ed.appendChild(l);
    };

    /* çoklu/tekli chip seçici */
    const picker = (list, isOn, onTap, emptyTxt) => {
      const box = el("div", "picks");
      if (!list.length) box.appendChild(el("div", "ed-hint", emptyTxt || "Bu odada uygun cihaz yok."));
      for (const eid of list) {
        const p = el("div", "pick" + (isOn(eid) ? " on" : ""));
        p.appendChild(icon(this._entIcon(eid)));
        p.appendChild(document.createTextNode(this._name(eid)));
        p.onclick = () => { onTap(eid); p.classList.toggle("on", isOn(eid)); refreshSave(); };
        box.appendChild(p);
      }
      ed.appendChild(box);
      return box;
    };

    label("Bunlar algılayınca…", "mdi:motion-sensor", true);
    picker(bsens, (e) => d.on.includes(e),
      (e) => { d.on = d.on.includes(e) ? d.on.filter((x) => x !== e) : [...d.on, e]; },
      "Bu odada hareket/varlık sensörü yok.");
    ed.appendChild(el("div", "ed-hint", "Birden fazla seçebilirsin — herhangi biri algılayınca tetiklenir. (Giriş için hızlı olan hareket sensörünü seç.)"));

    label("…bunlar açılsın", "mdi:lightbulb-on-outline");
    picker(lights, (e) => d.lights.includes(e),
      (e) => { d.lights = d.lights.includes(e) ? d.lights.filter((x) => x !== e) : [...d.lights, e]; },
      "Bu odada ışık/anahtar yok.");

    label("Kapatma — bu sensör boş deyince", "mdi:motion-sensor-off");
    let offBox;
    const renderOff = () => {
      if (offBox) offBox.remove();
      offBox = picker(bsens, (e) => d.off === e,
        (e) => {
          d.off = d.off === e ? null : e;
          renderOff(); // tekli seçim: hepsini tazele
        },
        "Sensör yok — kapatma adımı atlanır.");
      durRow.before(offBox);
    };

    const durRow = el("div", "ed-row");
    durRow.style.marginTop = "12px";
    durRow.appendChild(el("span", "lbl", "Şu kadar boş kalınca kapat:"));
    const durPicks = el("div", "picks");
    const durs = [[0, "Hemen"], [10, "10 sn"], [30, "30 sn"], [60, "1 dk"], [120, "2 dk"], [300, "5 dk"], [600, "10 dk"]];
    const renderDurs = () => {
      durPicks.innerHTML = "";
      for (const [s, t] of durs) {
        const p = el("div", "pick" + (d.delay === s ? " on" : ""), t);
        p.onclick = () => { d.delay = s; renderDurs(); };
        durPicks.appendChild(p);
      }
    };
    renderDurs();
    durRow.appendChild(durPicks);
    ed.appendChild(durRow);
    renderOff();
    ed.appendChild(el("div", "ed-hint", "Çıkış için gerçek varlık (presence) sensörünü seç — süre dolmadan geri gelirsen sayaç sıfırlanır, ışık kapanmaz. Sensör seçmezsen otomasyon sadece açar."));

    label("Kapanacaklar — boş bırakırsan açılanlarla aynı", "mdi:lightbulb-off-outline");
    picker(lights, (e) => d.off_lights.includes(e),
      (e) => { d.off_lights = d.off_lights.includes(e) ? d.off_lights.filter((x) => x !== e) : [...d.off_lights, e]; },
      "Bu odada ışık/anahtar yok.");
    ed.appendChild(el("div", "ed-hint", "Örn: varlıkta sadece <b>Ark Zone</b> açılsın ama boşalınca <b>ofis komple</b> kapansın — buraya kapanacakları seç."));

    label("Şart", "mdi:filter-outline");
    const condPicks = el("div", "picks");
    const conds = [["none", "Her zaman", "mdi:infinity"], ["lux", "Karanlıkken (lux)", "mdi:brightness-4"],
      ["sun", "Güneş batınca", "mdi:weather-sunset-down"], ["time", "Saat aralığı", "mdi:clock-outline"]];
    const condExtra = el("div");
    const renderCondExtra = () => {
      condExtra.innerHTML = "";
      if (d.cond === "lux") {
        const r = el("div", "ed-row");
        r.style.marginTop = "10px";
        r.appendChild(el("span", "lbl", "Işık sensörü:"));
        const lp = el("div", "picks");
        for (const eid of luxOpts) {
          const p = el("div", "pick" + (d.lux_entity === eid ? " on" : ""));
          p.appendChild(icon("mdi:brightness-5"));
          p.appendChild(document.createTextNode(this._name(eid)));
          p.onclick = () => { d.lux_entity = eid; renderCondExtra(); };
          lp.appendChild(p);
        }
        r.appendChild(lp);
        condExtra.appendChild(r);
        const r2 = el("div", "ed-row");
        r2.style.marginTop = "10px";
        r2.appendChild(el("span", "lbl", "Şundan karanlıksa aç:"));
        const inp = el("input", "ed-in small");
        inp.type = "number"; inp.min = "1"; inp.max = "1000"; inp.value = d.lux_below;
        inp.oninput = () => { d.lux_below = parseInt(inp.value, 10) || 15; };
        r2.appendChild(inp);
        r2.appendChild(el("span", "lbl", "lx altı"));
        condExtra.appendChild(r2);
        if (!luxOpts.length) condExtra.appendChild(el("div", "ed-hint", "Lux sensörü bulunamadı — 'Güneş batınca' seçeneğini kullan."));
      }
      if (d.cond === "time") {
        const r = el("div", "ed-row");
        r.style.marginTop = "10px";
        const t1 = el("input", "ed-in small"); t1.type = "time"; t1.value = d.after;
        const t2 = el("input", "ed-in small"); t2.type = "time"; t2.value = d.before;
        t1.oninput = () => { d.after = t1.value || "22:00"; };
        t2.oninput = () => { d.before = t2.value || "07:00"; };
        r.appendChild(el("span", "lbl", "Sadece"));
        r.appendChild(t1);
        r.appendChild(el("span", "lbl", "ile"));
        r.appendChild(t2);
        r.appendChild(el("span", "lbl", "arası"));
        condExtra.appendChild(r);
      }
    };
    const renderConds = () => {
      condPicks.innerHTML = "";
      for (const [id, t, mdi] of conds) {
        const p = el("div", "pick" + (d.cond === id ? " on" : ""));
        p.appendChild(icon(mdi));
        p.appendChild(document.createTextNode(t));
        p.onclick = () => { d.cond = id; renderConds(); renderCondExtra(); };
        condPicks.appendChild(p);
      }
    };
    renderConds();
    ed.appendChild(condPicks);
    ed.appendChild(condExtra);
    renderCondExtra();
    ed.appendChild(el("div", "ed-hint", "Şart sadece AÇMAYA uygulanır — kapatma her koşulda çalışır (gündüz açık kalmış ışığı da kapatır)."));

    label("İsim", "mdi:tag-outline");
    const nameIn = el("input", "ed-in wide");
    nameIn.value = d.name;
    nameIn.placeholder = "Otomasyon adı";
    nameIn.oninput = () => { d.name = nameIn.value; };
    ed.appendChild(nameIn);

    const foot = el("div", "ed-foot");
    const cancel = el("button", "btn sec2", "Vazgeç");
    cancel.onclick = close;
    const save = el("button", "btn pri", existing ? "Kaydet & HA'ya Yaz" : "Kur & Çalıştır");
    const refreshSave = () => { save.disabled = !(d.on.length && d.lights.length); };
    save.onclick = async () => {
      if (save.disabled) return;
      d.name = (d.name || "").trim() || "Varlıkla ışık";
      if (Array.isArray(d.off_lights) && !d.off_lights.length) d.off_lights = null;
      save.textContent = "Yazılıyor…";
      save.disabled = true;
      try {
        if (d.enabled !== false) { d.enabled = true; await this._pushAuto(room, d); }
        const i = rc.autos.findIndex((x) => x.id === d.id);
        if (i >= 0) rc.autos[i] = d; else rc.autos.push(d);
        this._save();
        this._flash("Otomasyon HA'ya yazıldı ✓");
        close();
        this._renderStage();
      } catch (e) {
        save.textContent = existing ? "Kaydet & HA'ya Yaz" : "Kur & Çalıştır";
        save.disabled = false;
        this._flash("HA'ya yazılamadı — yetki/bağlantı?", true);
      }
    };
    foot.appendChild(cancel);
    foot.appendChild(save);
    ed.appendChild(foot);
    refreshSave();

    this.shadowRoot.appendChild(ov);
    nameIn.blur();
  }

  /* ---------------------------------------------------------- canlı durum */
  _updateLive() {
    if (!this._built) return;
    const stage = this.shadowRoot.getElementById("stage");
    if (!stage) return;
    stage.querySelectorAll(".dev").forEach((d) => {
      const eid = d.dataset.eid;
      if (!eid) return;
      const info = this._stateInfo(eid);
      d.classList.toggle("on", info.on && !info.pulse);
      d.classList.toggle("pulse", info.pulse);
      const ds = d.querySelector(".ds");
      if (ds && ds.textContent !== info.text) ds.textContent = info.text;
    });
    // izleme odası kartları da canlı güncellensin
    stage.querySelectorAll(".vcard").forEach((c) => {
      const eid = c.dataset.eid;
      if (!eid) return;
      const info = this._stateInfo(eid);
      c.classList.toggle("on", info.on && !info.pulse);
      c.classList.toggle("pulse", info.pulse);
      const vs = c.querySelector(".vc-s");
      if (vs && vs.textContent !== info.text) vs.textContent = info.text;
    });
    // PRESTO: cihazdan mod değişince ekran CANLI takip etsin (refresh gerekmesin)
    if (this._room && this._room.startsWith("__dt_")) {
      const key = this._room.slice(5);
      const me = this._dtModeEntity(key);
      const aktif = me && this._hass.states[me] ? this._hass.states[me].state : null;
      if (aktif !== this._dtLiveMode) {
        this._dtLiveMode = aktif;
        // yazı yazarken ya da popup açıkken ekranı ezme — nokta bir sonraki turda güncellenir
        const ae = this.shadowRoot.activeElement;
        const yaziyor = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.tagName === "SELECT");
        const popup = this.shadowRoot.querySelector(".dt-test, .dt-pop");
        if (!yaziyor && !popup) { this._renderStage(); this._renderRail(); }
      }
    }
  }
}

customElements.define("presto-panel", DialTapPanel);
