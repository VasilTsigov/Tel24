Ext.define('Tel24.store.iag.IagStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.IagStore',
    storeId: 'iagTreeStore',  // Add store ID for easy reference in ViewModel

    proxy: {
        type: 'jsonp',
        url: 'https://vasil.iag.bg/tel/v7/rdg_dgs_empl',
        reader: {
            type: 'json',
            rootProperty: 'items',
            displayField: 'text',
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
    autoLoad: true
});

