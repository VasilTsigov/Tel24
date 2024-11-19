Ext.define('MyApp.store.iag.SearchStore',{
    extend: 'Ext.data.TreeStore',  
    
    alias: 'store.searchstore',

    storeId: 'SearchStore',

    model: 'MyApp.model.iag.IagModel',

    proxy: {
        type: 'jsonp',
        url: 'https://vasil.iag.bg/all_empl/imeAndFam',
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

    autoLoad: false,
})