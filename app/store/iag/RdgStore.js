Ext.define('MyApp.store.iag.RdgStore',{
    extend: 'Ext.data.TreeStore',  
    
    alias: 'store.rdgstore',

    storeId: 'RdgStore',

    model: 'MyApp.model.iag.IagModel',

    proxy: {
        type: 'jsonp',
        url: 'https://vasil.iag.bg/tel/v7/rdg_empl',
        callbackKey: 'callback',
        timeout: 30000,
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    },

    root: {
        text: 'Root',
        id: 'root',
        expanded: true
    },
    sorters: [
        { property: 'dlagid', direction: 'ASC' },
        { property: 'text', direction: 'ASC' }
    ],

    autoLoad: true,

    listeners: {
        load: function(store) {
            console.log('[RdgStore] Data loaded successfully. Count:', store.getCount());
        },
        exception: function(proxy, response, operation) {
            console.error('[RdgStore] Load failed:', {
                status: response && response.status,
                statusText: response && response.statusText,
                operation: operation
            });
        }
    }
});