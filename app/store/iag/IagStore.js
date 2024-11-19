Ext.define('MyApp.store.iag.IagStore',{
    extend: 'Ext.data.TreeStore',  
    
    alias: 'store.iagstore',

    storeId: 'IagStore',

    model: 'MyApp.model.iag.IagModel',

    proxy: {
        type: 'jsonp',
        url: 'https://vasil.iag.bg/tel/v7/iag_empl',
        callbackKey: 'callback',
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
})