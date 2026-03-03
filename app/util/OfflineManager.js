/**
 * Offline Data Manager
 * Управление на локалното кеширане на данни
 */
Ext.define('MyApp.util.OfflineManager', {
    singleton: true,
    
    config: {
        dbName: 'TelDb',
        storeName: 'telData',
        expireTime: 24 * 60 * 60 * 1000 // 24 часа
    },

    /**
     * Инициализиране на IndexedDB
     */
    init: function() {
        if (!window.indexedDB) {
            console.warn('[OfflineManager] IndexedDB не е поддържана');
            return false;
        }

        const request = indexedDB.open(this.getDbName(), 1);

        request.onerror = function() {
            console.error('[OfflineManager] Грешка при отваряне на DB');
        };

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('telData')) {
                db.createObjectStore('telData', { keyPath: 'id' });
            }
        };

        request.onsuccess = function() {
            console.log('[OfflineManager] IndexedDB инициализирана');
        };

        return true;
    },

    /**
     * Запазване на данни локално
     */
    saveData: function(key, data, callback) {
        if (!window.indexedDB) {
            localStorage.setItem(key, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
            callback && callback(true);
            return;
        }

        const request = indexedDB.open(this.getDbName());
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['telData'], 'readwrite');
            const store = transaction.objectStore('telData');
            
            store.put({
                id: key,
                data: data,
                timestamp: Date.now()
            });

            transaction.oncomplete = function() {
                console.log('[OfflineManager] Данни запазени:', key);
                callback && callback(true);
            };

            transaction.onerror = function() {
                console.error('[OfflineManager] Грешка при запазване');
                callback && callback(false);
            };
        };
    },

    /**
     * Изтегляне на локални данни
     */
    getData: function(key, callback) {
        if (!window.indexedDB) {
            const cached = localStorage.getItem(key);
            if (cached) {
                const parsed = JSON.parse(cached);
                callback && callback(parsed.data, parsed.timestamp);
            } else {
                callback && callback(null, null);
            }
            return;
        }

        const request = indexedDB.open(this.getDbName());
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['telData'], 'readonly');
            const store = transaction.objectStore('telData');
            const getRequest = store.get(key);

            getRequest.onsuccess = function() {
                const result = getRequest.result;
                if (result) {
                    callback && callback(result.data, result.timestamp);
                } else {
                    callback && callback(null, null);
                }
            };

            getRequest.onerror = function() {
                console.error('[OfflineManager] Грешка при четене');
                callback && callback(null, null);
            };
        };
    },

    /**
     * Проверка дали данните са още валидни
     */
    isDataExpired: function(timestamp) {
        if (!timestamp) return true;
        return (Date.now() - timestamp) > this.getExpireTime();
    },

    /**
     * Изтриване на всички локални данни
     */
    clearData: function(callback) {
        if (!window.indexedDB) {
            localStorage.clear();
            callback && callback(true);
            return;
        }

        const request = indexedDB.open(this.getDbName());
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['telData'], 'readwrite');
            const store = transaction.objectStore('telData');
            const clearRequest = store.clear();

            clearRequest.onsuccess = function() {
                console.log('[OfflineManager] Всички datos изтрити');
                callback && callback(true);
            };

            clearRequest.onerror = function() {
                callback && callback(false);
            };
        };
    }
});
