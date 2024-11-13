// app/store/TreeStore.js
Ext.define('MyApp.store.TreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.treestore',
    model: 'MyApp.model.TreeNode',

    proxy: {
        type: 'jsonp',
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
    ]
});
