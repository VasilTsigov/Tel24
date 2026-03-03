# Изтегляне и Deploy на Tel24 с Offline поддръжка

## 📋 Контролен списък за deployment

- [ ] Service Worker регистриран и работи
- [ ] IndexedDB достъпна (Devtools > Application > Storage)
- [ ] Offline indicator показва се когда няма връзка
- [ ] API данни кешираниум при офлайн режим
- [ ] Изображения натрьпва се и offline
- [ ] Статични активи кешират се правилно

---

## 🚀 Deployment на Web

### Стъпка 1: Подготовка на сървъра
```bash
# Убедете се че използвате HTTPS!
# (Service Worker работи само на HTTPS или localhost)

# Ако използвате Apache, добавете в .htaccess:
<IfModule mod_headers.c>
    Header always set Service-Worker-Allowed "/"
</IfModule>
```

### Стъпка 2: Build на приложението
```bash
# Използвайте Sencha Cmd
sencha build

# Или npm/yarn
npm run build
```

### Стъпка 3: Deploument
```bash
# Копирайте всички файлове от build/production
scp -r build/production/* user@server:/var/www/tel24/
```

### Стъпка 4: Проверка
```bash
# HTTPS трябва да е включен
https://your-domain.com/tel24/

# F12 > Application > Service Workers
# Трябва да е "activated and running"
```

---

## 📱 Deployment на Cordova (Android)

### Стъпка 1: Обновете Cordova config
```xml
<!-- cordova/config.xml -->
<widget id="com.domain.Tel24" version="1.1.0">
    <name>Tel24</name>
    
    <!-- Разрешави offline -->
    <preference name="DisallowOverscroll" value="true" />
    <preference name="OnLoad" value="on" />

    <!-- ВАЖНО: Разрешения за набиране на номера (tel:) -->
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
</widget>
```

### Стъпка 2: Build за Android
```bash
cd cordova/

# Инсталирайте необходимите пакети
npm install

# Build APK
npm run build:android

# Или ако използвате Cordova CLI
# За Google Play (AAB файл - по подразбиране):
cordova build android --release

# За директна инсталация на телефон (APK файл):
cordova build android --release -- --packageType=apk
```

### Стъпка 3: Sign APK
```bash
# Создаде keystore (само първи път)
keytool -genkey -v -keystore my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore my-release-key.jks \
  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  my-key-alias

# Zipalign (оптимизиране)
zipalign -v 4 \
  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  Tel24.apk
```

### Стъпка 4: Публикуване на Google Play
1. Отворете [Google Play Console](https://play.google.com/console)
2. Create app
3. Upload APK
4. Запълнете описанието и скриншотите
5. Publish

---

## 🔍 Post-Deployment Checklist

### Web Version
```javascript
// В browser console, проверете:

// 1. Service Worker регистриран?
navigator.serviceWorker.getRegistrations().then(r => console.log(r));

// 2. Cache storage съществува?
caches.keys().then(names => console.log('Caches:', names));

// 3. IndexedDB съществува?
indexedDB.databases().then(dbs => console.log('DBs:', dbs));

// 4. Кеша на API?
caches.open('myapp-api-v1').then(cache => {
    cache.keys().then(requests => {
        console.log('Cached requests:', requests.map(r => r.url));
    });
});
```

### Android App
```javascript
// Проверете в DevTools (via USB debugging):
// chrome://inspect/#devices

// Или отворете app в Chrome DevTools:
// Devices > Select device > Inspect
```

---

## 📊 Мониторинг и Отладка

### Браузърни инструменти
- **Chrome/Edge DevTools**
  - Application tab → Service Workers
  - Application tab → Cache Storage
  - Application tab → IndexedDB

### Логване
```javascript
// В Production разрешете логването:
MyApp.util.OfflineConfig.setDebugMode(true);

// Вижте логовете в console
// [OfflineManager] Данни запазени: iag_data
// [ServiceWorker] Връщане от кеше: ...
```

### Проблеми?
```javascript
// Очистете всичко и рестартирайте
caches.keys().then(names => 
    Promise.all(names.map(n => caches.delete(n)))
);

localStorage.clear();

navigator.serviceWorker.getRegistrations().then(rs =>
    rs.forEach(r => r.unregister())
);

// Reload страницата
location.reload();
```

---

## 🔐 Безопасност

### HTTPS е задължителен!
```
❌ http://example.com (Service Worker НЕ работи)
✓ https://example.com (Service Worker работи)
✓ http://localhost (локално тестване е ОК)
```

### Content Security Policy (CSP)
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: gap: content:; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content: https://vasil.iag.bg; script-src 'self' 'unsafe-inline' 'unsafe-eval';">
```

### Защита на персонални данни
- Service Worker кеширпа снимки на служители
- Убедете се че GDPR е спазена
- Добавете privacy policy в приложението

---

## 📈 Performance Optimization

### Намаляване на размера на кеша
```javascript
// Автоматично изтриване на стар кеш
setInterval(function() {
    const maxAge = 24 * 60 * 60 * 1000; // 24 часа
    
    caches.keys().then(names => {
        names.forEach(name => {
            caches.open(name).then(cache => {
                cache.keys().then(requests => {
                    requests.forEach(request => {
                        // Изстрий старите
                    });
                });
            });
        });
    });
}, 60 * 60 * 1000); // Всеки час
```

### Compression
```bash
# На сървъра, компресирайте статични активи
gzip -r /var/www/tel24/

# Или в nginx.conf:
gzip on;
gzip_types text/plain text/css application/json
           application/javascript text/xml application/xml;
```

---

## 🆘 Troubleshooting

| Проблем | Причина | Решение |
|---------|---------|---------|
| Service Worker не се регистрира | HTTP вместо HTTPS | Ползвайте HTTPS |
| Стари данни се показват | Кеша не се обновява | Увеличете CACHE_VERSION |
| Изображения не се показват офлайн | Не са кеширани | Проверете image cache |
| Storage е пълен | Твърде много данни | Намалете expireTime |

---

## 📞 Support

За проблеми или въпроси:
1. Проверете DevTools Application tab
2. Вижте consoleログи
3. Проверете network tab за API отговори
