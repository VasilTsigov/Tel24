Ext.define('MyApp.view.iag.DpNestedList',{
    extend: 'Ext.NestedList',
    xtype: 'dpnestedlist',

    title: 'Държавни горски предприятия',

    displayField: 'text',

    listConfig: {
        itemTpl: new Ext.XTemplate(
            '<tpl if="!leaf">',  // Template for non-leaf nodes (e.g., departments)
            '   <table>',
            '       <tr>',
            '           <td><b>{text}</b></td>',
            '       </tr>',
            '       <tr>',
            '           <td><small>{eik}</small></td>',
            '       </tr>',
            '       <tr>',
            '           <td><small>{email}</small></td>',
            '       </tr>',
 
            '   </table>',
            '</tpl>',
            '<tpl if="leaf">',  // Template for leaf nodes (e.g., employees)
            '   <table>',
            '       <tr>',
            '           <td style="padding:10px"><img src="https://vasil.iag.bg/upload/{glavpod}/{pict}" width="80" height=auto></img></td>',
            '           <td>',
            '               <table>',
            '                   <tr>',
            '                       <td><b>{text}</b></td>',
            '                   </tr>',
            '                   <tr>',
            '                       <td><small>{pod}</small></td>',
            '                   </tr>',
            '                   <tr>',
            '                       <td><small>{gsm}</small></td>',
            '                   </tr>',
            '                   <tr>',
            '                       <td><small>{email}</small></td>',
            '                   </tr>',
            '                   <tr>',
            '                       <td><small>{dlag}</small></td>',
            '                   </tr>',
            '               </table>',
            '           </td>',
            '       </tr>',
            '   </table>',
            '</tpl>'
        )
    },


    requires:[
        'MyApp.store.iag.IagStore',
    ],

    controller: 'iagcontroller',

    detailCard: {
        xtype: 'panel',
        scrollable: true
    },
    listeners: {
        itemtap: 'onItemTap'
    },


    store: 'DpStore',
    // store: {
    //     // storeId: 'iagStore',
    //     // model: 'MyApp.model.iag.IagModel',
    //     root: {},
    //     proxy: {
    //         type: 'jsonp',
    //         url: 'https://vasil.iag.bg/tel/v7/dp_dgs_empl',
    //         reader: {
    //             type: 'json',
    //             rootProperty: 'items',
    //         }
    //     }
    // },

})
