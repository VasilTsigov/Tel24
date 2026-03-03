/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'MyApp.Application',

    name: 'MyApp',

    stores: [
        'MyApp.store.iag.SearchStore',
        'MyApp.store.iag.IagStore',
        'MyApp.store.iag.RdgStore',
        'MyApp.store.iag.DpStore',
    ],

    launch: function() {
        const stores = [ 'SearchStore','IagStore', 'RdgStore', 'DpStore']; // Stores to track
        let loadedCount = 0;
        let timedOut = false;

        // Show loading mask with initial message
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Зареждам данни ... 0%',  // Start with 0% progress
            cls: 'custom-loadmask'  // Apply the custom CSS class here
        });

        // Function to update the loading progress percentage
        function updateLoadingProgress() {
            const progress = Math.floor((loadedCount / stores.length) * 100);  // Calculate percentage
            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                message: `Зареждам данни ... ${progress}%`,
                cls: 'custom-loadmask'  // Apply the custom CSS class here  
            });
        }

        // Function to check if all stores are loaded
        function checkAllStoresLoaded() {
            if (loadedCount === stores.length || timedOut) {
                Ext.Viewport.setMasked(false);  // Remove loading mask when loading is complete
                console.log('[launch] All stores loaded or timeout reached:', { loadedCount, total: stores.length });
            }
        }

        // Set up listeners for each store
        stores.forEach(storeId => {
            const store = Ext.getStore(storeId);
            if (!store) {
                console.warn('[launch] Store not found:', storeId);
                return;
            }

            // Listen for load
            store.on('load', function() {
                console.log('[launch] Store loaded:', storeId);
                loadedCount++;
                updateLoadingProgress();  // Update loading message with progress
                checkAllStoresLoaded();
            });

            // Listen for error
            store.on('exception', function(proxy, response, operation) {
                console.error('[launch] Store error:', storeId, response);
            });

            // Explicitly load if autoLoad didn't trigger
            if (store.isLoading && store.isLoading() === false && store.getCount() === 0) {
                console.log('[launch] Explicitly loading store:', storeId);
                store.load();
            }
        });

        // Timeout fallback: hide loading mask after 15 seconds
        Ext.defer(function() {
            if (!timedOut && loadedCount < stores.length) {
                console.warn('[launch] Loading timeout reached. Loaded:', loadedCount + '/' + stores.length);
                timedOut = true;
                Ext.Viewport.setMasked(false);
            }
        }, 15000);

        // Initial check in case stores load instantly
        setTimeout(checkAllStoresLoaded, 100);
    },


    requires: [
        'Ext.util.LocalStorage'
    ],

    controllers: [
        // 'MyApp.controller.IagController'
    ],

    // controllers: ['IagController'], // Add your controller here

    requires: [
        // This will automatically load all classes in the MyApp namespace
        // so that application classes do not need to require each other.
        'MyApp.*'
    ],

    // The name of the initial view to create.
    mainView: 'MyApp.view.Home'
});
