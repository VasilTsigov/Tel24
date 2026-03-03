# Офлайн поддръжка на Tel24

## 📱 Преглед

Приложението вече има **пълна офлайн поддръжка**, което позволява на потребителите да:
- ✅ Преглеждат кеширани данни дори без интернет
- ✅ Виждат кога няма връзка (червено уведомление вътространката)
- ✅ Автоматично синхронизират при възстановяване на връзката

---

## 🔧 Архитектура на офлайн функцията

### 1. **Service Worker** (`service-worker.js`)
Автоматично кеширане на:
- 📦 Статични активи (JS, CSS, HTML)
- 🖼️ Изображения на служители
- 🌐 API отговори

**Стратегия:**
- API → Network first, fallback to cache
- Изображения → Cache, fallback to network
- Статични активи → Network first

### 2. **OfflineManager** (`app/util/OfflineManager.js`)
Управление на локално кеширане:
- Използва **IndexedDB** (или localStorage като fallback)
- Запазва/изтегля данни локално
- Проверява давност на кеша (24 часа по подразбиране)

### 3. **OfflineStatus** (`app/util/OfflineStatus.js`)
Мониторинг на връзката:
- Следи `online`/`offline` събития
- Показва/скрива офлайн индикатор
- Известява наблюдателите за промени

### 4. **Модифицирани Store-ове**
- `IagStore.js`
- `RdgStore.js`  
- `DpStore.js`

Всеки Store сега:
```javascript
1. Опита да зареди от интернет
2. При успех → кеширане на данни локално
3. При грешка → опит да зареди от cache
4. Ако cache е праз → показва пусто съобщение
```

---

## 🚀 Как работи

### Сценарий 1: Първо посещение ( Online )
```
User opens app (Online)
     ↓
Service Worker регистриран ✓
OfflineManager инициализирана ✓
Store зарежда от API
     ↓
API отговор кеширан локално (IndexedDB)
     ↓
Статични активи кешираниизображения кеширани
     ↓
App готова ✓
```

### Сценарий 2: Повторно посещение ( Online )
```
User opens app (Online)
     ↓
Service Worker проверява за обновления
Store опита мрежата (Network first)
     ↓
Нежнови данни получени & кеширани
Или старите от cache се използват
```

### Сценарий 3: Офлайн режим
```
User lost internet connection
     ↓
"ОФЛАЙН РЕЖИМ" уведомление в страницата ↓
Store грешка при мрежата
     ↓
OfflineManager предоставя локалните данни
     ↓
App показва кеширани служители без проблеми ✓
```

---

## 📊 Технически детайли

### Кеширани данни
| Кеш | Място | Размер | Эксплорация |
|-----|-------|--------|------------|
| Статични активи | ServiceWorker | ~5MB | 24 часа |
| API данни | IndexedDB | ~2MB | 24 часа |
| Изображения | ServiceWorker | ~50MB | По необходимост |

### LocationStorage структура (ако IndexedDB не налична)
```javascript
localStorage:
  - 'iag_data' → {data: [...], timestamp: 1234567890}
  - 'rdg_data' → {data: [...], timestamp: 1234567890}
  - 'dp_data' → {data: [...], timestamp: 1234567890}
```

---

## 🔐 Включване/Изключване

### Автоматично (по подразбиране)
Service Worker се регистрира автоматично в `Application.js`:
```javascript
navigator.serviceWorker.register('/service-worker.js')
```

### За изключване при разработка
В `index.html` коментирайте редът:
```html
<!-- <script src="/service-worker.js"></script> -->
```

Or в `Application.js`:
```javascript
// navigator.serviceWorker.register('/service-worker.js')
```

---

## 🛠️ Разработка & Тестване

### Тестване на офлайн режим

#### Chrome/Edge DevTools:
1. Отворете DevTools (F12)
2. Отидете на **Application** tab
3. Вляво изберете **Service Workers**
4. Чекнете "Offline"
5. Приложението все още работи! ✓

#### Или симулирайте мрежова грешка:
1. DevTools → **Network** tab
2. Намерете dropdown "Throttling"
3. Изберете "Offline"

### Изчистване на кеш:
Ако трябва да очистите всичкото:

**In browser console:**
```javascript
MyApp.util.OfflineManager.clearData(function(success) {
    console.log('Clear:', success);
});

// Или директно:
localStorage.clear();
indexedDB.deleteDatabase('TelDb');
```

**Или в DevTools:**
1. Application → Storage
2. Cache Storage → select all → Delete
3. IndexedDB → TelDb → Delete

---

## 📌 Бъдещи улучшения

- [ ] Background Sync - синхронизиране при възстановяване
- [ ] Push notifications при нови данни
- [ ] Selective sync - потребител да избира що кеш
- [ ] Sync статус dashboard
- [ ] Conflict resolution за локални промени

---

## 🐛 Troubleshooting

### Служителите не се появяват офлайн
✓ Отворете Chrome DevTools → Application → Service Workers
✓ Проверете cache storage - трябва да има `myapp-api-v1`
✓ Отворете console за errors

### Service Worker не се регистрира
- Трябва HTTPS (или localhost)
- Проверете `service-worker.js` синтаксис
- Погледнете console за errors

### IndexedDB не работи
- На някой браузъри е изключена
- Fallback към localStorage (автоматично)
- Проверете storage quota

---

## 📚 Slovenske references

- [MDN: Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN: IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web.dev: Offline PWA](https://web.dev/offline-cookbook/)
- [Ext JS: Store Proxy](https://docs.sencha.com/extjs/6.2.0/classic/Ext.data.proxy.Proxy.html)
