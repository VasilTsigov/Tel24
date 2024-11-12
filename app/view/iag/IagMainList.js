Ext.define('Tel24.view.iag.IagMainList', {
    extend: 'Ext.dataview.NestedList',
    xtype: 'iagmainlist', // Define the xtype for easy reference

    fullscreen: true,
    scrollable: true, // Enable scrolling for longer lists
    displayField: 'text',
    // itemTpl: '{text}', // Template for list items, assuming the store has a 'title' field

    requires: [
        'Tel24.store.iag.IagStore' // Ensure the store is defined and loaded correctly
    ],

    title: 'ИАГ',

    store: {
        type: 'IagStore'
    },
});

