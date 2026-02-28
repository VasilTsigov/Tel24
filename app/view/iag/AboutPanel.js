Ext.define('MyApp.view.iag.AboutPanel', {
    extend:'Ext.Panel',

    xtype: 'aboutpanel',

    title: 'За приложението',

    requires: [
        'Ext.Img'
    ],

    config: {
        layout: 'vbox',
        items: [
            {
                xtype: 'image',
                flex: 5,
                src: 'resources/images/Home24.png'
            },
            // {
            //     xtype: 'panel',
            //     flex: 1,
            //     layout: 'fit',
            //     items: [
            //         {
            //             xtype: 'image',
            //             // src: 'resources/images/main.png'
            //         }
            //     ]
            // },

        ]
    }

    })
