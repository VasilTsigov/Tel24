// app/view/Main.js
Ext.define('MyApp.view.Main', {
    extend: 'Ext.Panel', // Change from Ext.container.Viewport to Ext.Panel
    xtype: 'mainview',    // Add an xtype for easier referencing
    layout: 'fit',        // Maintain the layout

    items: [
        {
            xtype: 'tabpanel',
            tabBarPosition: 'bottom',

            // Adding a search field docked at the top of the TabPanel
            dockedItems: [
                {
                    xtype: 'textfield',
                    dock: 'top',
                    placeHolder: 'Search by name...',
                    listeners: {
                        change: 'onSearchChange' // Calls the controller's search handler on text change
                    }
                }
            ],

            items: [
                { xtype: 'tabview', title: 'РДГ', storeUrl: 'https://vasil.iag.bg/tel/v7/rdg_dgs_empl' },
                { xtype: 'tabview', title: 'ИАГ', storeUrl: 'https://vasil.iag.bg/tel/v7/iag_empl' },
                { xtype: 'tabview', title: 'ДП', storeUrl: 'https://vasil.iag.bg/tel/v7/dp_dgs_empl' },
                { xtype: 'tabview', title: 'РДГ (под)', storeUrl: 'https://vasil.iag.bg/tel/v7/rdg_empl' }
            ]
        }
    ],

    controller: 'main' // Link to the controller where the search logic will be handled
});
