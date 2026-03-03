/**
 * Offline Status Indicator
 * Показване на статус на интернет връзката
 */
Ext.define('MyApp.util.OfflineStatus', {
    singleton: true,

    isOnline: navigator.onLine,
    statusObservers: [],

    init: function() {
        const self = this;

        // Слушане на мрежови събития
        window.addEventListener('online', function() {
            console.log('[OfflineStatus] Връзката е възстановена');
            self.isOnline = true;
            self.notifyObservers();
            self.showNotification('Онлайн', 'Връзката е възстановена');
        });

        window.addEventListener('offline', function() {
            console.log('[OfflineStatus] Нема интернет връзка');
            self.isOnline = false;
            self.notifyObservers();
            self.showNotification('Офлайн', 'Работите без интернет');
        });

        console.log('[OfflineStatus] Инициализирана - Статус:', self.isOnline ? 'Онлайн' : 'Офлайн');
    },

    /**
     * Регистриране на наблюдател
     */
    registerObserver: function(callback) {
        this.statusObservers.push(callback);
    },

    /**
     * Известяване на наблюдателите
     */
    notifyObservers: function() {
        const status = this.isOnline;
        this.statusObservers.forEach(callback => {
            try {
                callback(status);
            } catch (e) {
                console.error('[OfflineStatus] Грешка в callback:', e);
            }
        });
    },

    /**
     * Показване на известие
     */
    showNotification: function(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/resources/images/icon.png'
            });
        }

        // Показване и в應用
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            if (this.isOnline) {
                indicator.style.display = 'none';
            } else {
                indicator.style.display = 'block';
                indicator.textContent = 'ОФЛАЙН РЕЖИМ';
            }
        }
    }
});
