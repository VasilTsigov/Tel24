Ext.define('MyApp.view.iag.IagNestedList',{
    extend: 'Ext.NestedList',
    xtype: 'iagnestedlist',

    title: 'Изпълнителна агенция по горите',

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

    controller: 'iagcontroller',

    // cls: 'custom-nested-list',  // Add a custom class here

    detailCard: {
        xtype: 'panel',
        scrollable: true
    },
    listeners: {
        itemtap: 'onItemTap'
    },

    store: 'IagStore',

//     itemTpl: `
//     <div style="font-size: 20px; color: #333;">
//         {text}
//     </div>
// `

})


