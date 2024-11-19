/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 */
Ext.define('MyApp.view.Home', {
    extend: 'Ext.tab.Panel',
    xtype: 'home-main',

    requires: [
        'Ext.MessageBox',
        'Ext.layout.Fit',
        'MyApp.view.iag.IagNestedList'
    ],

    controller: 'main',
    viewModel: 'main',

    defaults: {
        tab: {
            iconAlign: 'top'
        }
    },

    tabBarPosition: 'bottom',

    items: [

        {
            title: 'Начало',
            iconCls: 'x-fa fa-home',
            layout: 'fit',
            items: [{
                xtype: 'homepanel',
            }]
        },
        {
            title: 'ИАГ',
            iconCls: 'x-fa fa-users',
            layout: 'fit',
            items: [{
                xtype: 'iagnestedlist',
            }]
        },{
            title: 'РДГ',
            iconCls: 'x-fa fa-users',
            layout: 'fit',
            items: [{
                xtype: 'rdgnestedlist',
            }]
        },{
            title: 'ДП',
            iconCls: 'x-fa fa-users',
            layout: 'fit',
            items: [{
                xtype: 'dpnestedlist',
            }]
        },{
            title: 'Търси',
            iconCls: 'x-fa fa-search',
            items: [{
                xtype: 'searchtab',
            }],
            // bind: {
            //     html: '{loremIpsum}'
            // }
        },{
            title: 'Относно',
            iconCls: 'x-fa fa-user',
            layout: 'fit',
            items: [{
                xtype: 'aboutpanel',
            }]
        }
    ]
});
