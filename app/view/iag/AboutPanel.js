Ext.define('MyApp.view.iag.AboutPanel', {
    extend:'Ext.Panel',

    xtype: 'aboutpanel',

    title: 'За приложението',

    requires: [
        'Ext.Panel',
        'Ext.Img',
        'Ext.Button',
        'Ext.Spacer'
    ],

    config: {
        layout: 'vbox',
        items: [
            {
                xtype: 'panel',
                flex: 5,
                layout: 'fit',
                items: [
                    {
                        xtype: 'image',
                        src: 'resources/images/Home24.png'
                    }
                ]
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
