/**
 * OfflineManager - Best Practices & Examples
 * Примери и best practices за използване на offline функционалност
 */

// ============================================================
// ПРИМЕР 1: Ръчно кеширане на данни
// ============================================================

Ext.define('MyApp.example.ManualCaching', {
    /**
     * Кеширане на служителски данни
     */
    cacheEmployeeData: function(storeData) {
        const offlineManager = MyApp.util.OfflineManager;
        
        offlineManager.saveData('custom_employees', storeData, function(success) {
            if (success) {
                console.log('✓ Служителски данни успешно кеширани');
            } else {
                console.log('✗ Грешка при кеширане');
            }
        });
    },

    /**
     * Изтегляне на кеширани служители
     */
    getLocalEmployees: function(callback) {
        const offlineManager = MyApp.util.OfflineManager;
        
        offlineManager.getData('custom_employees', function(data, timestamp) {
            if (data) {
                console.log('Данни от', new Date(timestamp));
                callback(data);
            } else {
                console.log('Няма кеширани данни');
                callback(null);
            }
        });
    }
});

// ============================================================
// ПРИМЕР 2: Проверка на статуса на връзката
// ============================================================

Ext.define('MyApp.example.ConnectionCheck', {
    /**
     * Реагиране на промена на статусата
     */
    setupStatusListener: function() {
        const offlineStatus = MyApp.util.OfflineStatus;
        
        // Регистриране на callback
        offlineStatus.registerObserver(function(isOnline) {
            if (isOnline) {
                console.log('🟢 Връзката е активна');
                // Синхронизирай всички локални промени
            } else {
                console.log('🔴 Няма интернет');
                // Покажи offline indicator
            }
        });
    },

    /**
     * Условно изпълнение на действие
     */
    actionIfOnline: function(callback) {
        if (MyApp.util.OfflineStatus.isOnline) {
            console.log('Извършване на мрежова операция...');
            callback();
        } else {
            console.log('Офлайн режим - операция забавена');
            // Можеш да запазиш операцията за по-късно
        }
    }
});

// ============================================================
// ПРИМЕР 3: Синхронизация при възстановяване на връзката
// ============================================================

Ext.define('MyApp.example.SyncOnRestore', {
    
    /**
     * Queue за локални промени (pending sync)
     */
    pendingChanges: [],

    /**
     * Запазване на промена за синхронизация
     */
    savePendingChange: function(operation) {
        this.pendingChanges.push({
            operation: operation,  // 'create', 'update', 'delete'
            timestamp: Date.now(),
            data: operation.data
        });

        const offlineManager = MyApp.util.OfflineManager;
        offlineManager.saveData('pending_sync', this.pendingChanges, function(success) {
            if (success) {
                console.log('Промена запазена за синхронизация');
            }
        });
    },

    /**
     * Синхронизиране на томите промени
     */
    syncPendingChanges: function() {
        const self = this;
        const offlineManager = MyApp.util.OfflineManager;

        if (!MyApp.util.OfflineStatus.isOnline) {
            console.log('Все още нема връзка - синхронизацията е отложена');
            return;
        }

        offlineManager.getData('pending_sync', function(pendingChanges) {
            if (!pendingChanges || pendingChanges.length === 0) {
                return;
            }

            console.log('Синхронизиране на ' + pendingChanges.length + ' промени...');

            // Обработка на всяка промена
            pendingChanges.forEach(function(change) {
                switch(change.operation) {
                    case 'create':
                        self.syncCreate(change.data);
                        break;
                    case 'update':
                        self.syncUpdate(change.data);
                        break;
                    case 'delete':
                        self.syncDelete(change.data);
                        break;
                }
            });

            // След успешна синхронизация
            offlineManager.saveData('pending_sync', [], function() {
                console.log('✓ Синхронизацията е завършена');
            });
        });
    },

    syncCreate: function(data) {
        console.log('Синхронизиране на ново:', data);
        // Изпрати към API
    },

    syncUpdate: function(data) {
        console.log('Синхронизиране на обновка:', data);
        // Изпрати към API
    },

    syncDelete: function(data) {
        console.log('Синхронизиране на триене:', data);
        // Изпрати към API
    }
});

// ============================================================
// ПРИМЕР 4: Получаване на информация за кеша
// ============================================================

Ext.define('MyApp.example.CacheStats', {
    
    /**
     * Показване на информация за кеша
     */
    showCacheInfo: function() {
        const offlineConfig = MyApp.util.OfflineConfig;
        
        offlineConfig.getCacheStats(function(stats) {
            console.log('=== Информация за кеша ===');
            console.log('Хранилище:', stats.storage);
            
            if (stats.size) {
                console.log('Брой елементи:', stats.size);
            }
            
            if (stats.usage) {
                console.log('Използвано:', stats.usage);
                console.log('Квота:', stats.quota);
                console.log('Процент:', stats.percentage);
            }
        });
    },

    /**
     * Получаване на време за разликата на конкретни данни
     */
    checkExpireTime: function(dataKey) {
        const offlineConfig = MyApp.util.OfflineConfig;
        const expireTime = offlineConfig.getExpireTime(dataKey);
        
        console.log('Време за разликата на "' + dataKey + '":', 
                   expireTime / (1000 * 60 * 60), 'часа');
    }
});

// ============================================================
// ПРИМЕР 5: Интеграция със Store
// ============================================================

Ext.define('MyApp.example.OfflineStore', {
    
    /**
     * Store с офлайн поддръжка
     */
    setupOfflineStore: function(store) {
        const offlineManager = MyApp.util.OfflineManager;
        const offlineStatus = MyApp.util.OfflineStatus;

        // Слушане на промени в Store
        store.on('update', function(store, record, operation, modifiedFieldNames, details) {
            if (!offlineStatus.isOnline) {
                // Запази промяната локално
                offlineManager.saveData('store_changes_' + store.storeId, {
                    record: record.data,
                    operation: operation,
                    timestamp: Date.now()
                });
            }
        });

        // Слушане на синхронизация
        store.on('sync', function(options) {
            console.log('Store синхронизиран успешно');
        });
    }
});

// ============================================================
// ПРИМЕР 6: Условно зареждане (Network first)
// ============================================================

Ext.define('MyApp.example.SmartLoading', {
    
    /**
     * Зареждане на данни с оптимална стратегия
     */
    loadData: function(store, callback) {
        const offlineStatus = MyApp.util.OfflineStatus;
        const offlineManager = MyApp.util.OfflineManager;

        store.load({
            callback: function(records, operation, success) {
                if (success) {
                    // Зареждане от мрежата успешно - кеширай
                    offlineManager.saveData(store.storeId + '_data', 
                                           records.map(r => r.data));
                    callback(records, true);
                } else {
                    // Мрежа неуспешна - опитай кеша
                    offlineManager.getData(store.storeId + '_data', 
                                          function(cachedData) {
                        if (cachedData) {
                            console.log('Използване на кеширани данни');
                            callback(cachedData, false);
                        } else {
                            console.log('Няма данни за показване');
                            callback([], false);
                        }
                    });
                }
            }
        });
    }
});

// ============================================================
// УПОТРЕБА В ПРИЛОЖЕНИЕТО
// ============================================================

/**
 * В App.js или някой контролер:

Ext.application({
    name: 'MyApp',
    
    launch: function() {
        // Инициализирай offline
        MyApp.util.OfflineManager.init();
        MyApp.util.OfflineStatus.init();

        // Настрой статус слушател
        const example = Ext.create('MyApp.example.ConnectionCheck');
        example.setupStatusListener();

        // Настрой sync на възстановяване
        const syncExample = Ext.create('MyApp.example.SyncOnRestore');
        MyApp.util.OfflineStatus.registerObserver(function(isOnline) {
            if (isOnline) {
                syncExample.syncPendingChanges();
            }
        });

        // Получи информация за кеша
        const statsExample = Ext.create('MyApp.example.CacheStats');
        statsExample.showCacheInfo();
    }
});
*/
