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
            if (loadedCount === stores.length) {
                Ext.Viewport.setMasked(false);  // Remove loading mask when loading is complete
            }
        }

        // Set up listeners for each store
        stores.forEach(storeId => {
            const store = Ext.getStore(storeId);
            store.on('load', function() {
                loadedCount++;
                updateLoadingProgress();  // Update loading message with progress
                checkAllStoresLoaded();
            });
        });

        // Initial check in case stores load instantly
        checkAllStoresLoaded();
    },


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
