Ext.define('MyApp.view.iag.HomePanel', {
extend:'Ext.Panel',

xtype: 'homepanel',

title: '',

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
            flex: 1,
            layout: 'fit',
            items: [
                {
                    xtype: 'image',
                    src: 'resources/images/main24.png'
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
