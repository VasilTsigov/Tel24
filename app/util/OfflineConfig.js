/**
 * Offline Configuration
 * Конфигурационен файл за офлайн функционалност
 */

Ext.define('MyApp.util.OfflineConfig', {
    singleton: true,

    config: {
        // Время за разликата на кеша (в мс)
        cacheExpireTimes: {
            'iag_data': 24 * 60 * 60 * 1000,   // 24 часа
            'rdg_data': 24 * 60 * 60 * 1000,   // 24 часа
            'dp_data': 24 * 60 * 60 * 1000,    // 24 часа
            'search_data': 12 * 60 * 60 * 1000 // 12 часа
        },

        // Максимален размер на кеша (в MB)
        maxCacheSize: {
            'database': 50,  // IndexedDB
            'images': 100,   // Изображения
            'static': 20     // Статични активи
        },

        // API endpoints за кеширане
        cachableEndpoints: [
            'https://vasil.iag.bg/tel/v7/iag_empl',
            'https://vasil.iag.bg/tel/v7/rdg_empl',
            'https://vasil.iag.bg/tel/v7/dp_dgs_empl',
            'https://vasil.iag.bg/tel/v7/search'
        ],

        // Статични активи
        staticAssets: [
            '/',
            '/app.js',
            '/index.html',
            '/bootstrap.js',
            '/bootstrap.css',
            '/resources/css/app.css'
        ],

        // Изображения за прекеширане (опционално)
        preloadImages: false,

        // Разрешаване на offline режим
        allowOfflineMode: true,

        // Автоматично кеширане при синхронизация
        autoSync: true,

        // Логване в console
        debugMode: true
    },

    /**
     * Логване на отладка
     */
    log: function(message, data) {
        if (this.getDebugMode()) {
            if (data) {
                console.log('[OfflineConfig]', message, data);
            } else {
                console.log('[OfflineConfig]', message);
            }
        }
    },

    /**
     * Получи време за разликата за конкретни данни
     */
    getExpireTime: function(dataKey) {
        return this.getConfig().cacheExpireTimes[dataKey] || 24 * 60 * 60 * 1000;
    },

    /**
     * Проверка дали endpoint е кешираемо
     */
    isCachableEndpoint: function(url) {
        return this.getConfig().cachableEndpoints.some(endpoint => 
            url.indexOf(endpoint) === 0
        );
    },

    /**
     * Статус на кеша (информация)
     */
    getCacheStats: function(callback) {
        if (!window.indexedDB) {
            callback({ storage: 'localStorage', size: localStorage.length });
            return;
        }

        navigator.storage.estimate().then(estimate => {
            callback({
                storage: 'IndexedDB',
                usage: Math.round(estimate.usage / 1024 / 1024) + 'MB',
                quota: Math.round(estimate.quota / 1024 / 1024) + 'MB',
                percentage: Math.round((estimate.usage / estimate.quota) * 100) + '%'
            });
        });
    }
});
