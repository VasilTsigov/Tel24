Ext.define('MyApp.store.iag.DpStore',{
    extend: 'Ext.data.TreeStore',  
    
    alias: 'store.dpgstore',

    storeId: 'DpStore',

    model: 'MyApp.model.iag.IagModel',

    proxy: {
        type: 'jsonp',
        url: 'https://vasil.iag.bg/tel/v7/dp_dgs_empl',
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
            console.log('[DpStore] Data loaded successfully. Count:', store.getCount());
        },
        exception: function(proxy, response, operation) {
            console.error('[DpStore] Load failed - check console for details');
        }
    }
})