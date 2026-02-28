Ext.define('MyApp.view.iag.SearchTab', {
    extend: 'Ext.Panel',
    xtype: 'searchtab',

    controller: 'searchcontroller',

    layout: 'vbox',
    title:'Търсене по име и фамилия или моб. номер',
    items: [
        {
            xtype: 'textfield',
            label: 'Търсене по име и фамилия или телефон',
            clearable: true,
            placeholder: '1+ букви  за име, 1+ за ф-я или 5+ цифри за тел.',
            padding: 10,
            listeners: {
                change: 'onSearchChange',
            },
        },
        {
            xtype: 'list',
            reference: 'searchResultList',
            scrollable: true,
            itemTpl: [
                '<table>',
                '    <tr>',
                '        <td style="padding:10px"><img src="https://vasil.iag.bg/upload/{glavpod}/{pict}" width="80" style="height:auto;"></td>',
                '        <td>',
                '            <table>',
                '                <tr>',
                '                    <td><b>{text}</b></td>',
                '                </tr> ',
                '                <tr>',
                '                    <td><small>{pod}</small></td>',
                '                </tr>',
                '                <tpl if="gsm">',
                '                <tr>',
                '                    <td>',
                '                        <small class="call-trigger" style="color:blue; text-decoration:underline; margin-right: 15px;"><span class="x-fa fa-phone" style="margin-right:5px;"></span>{gsm}</small>',
                '                        <small class="sms-trigger" style="color:green; text-decoration:underline;"><span class="x-fa fa-comment" style="margin-right:5px;"></span>SMS</small>',
                '                        <small class="save-trigger" style="color:orange; text-decoration:underline; margin-left: 15px;"><span class="x-fa fa-save" style="margin-right:5px;"></span>Запиши</small>',
                '                        <small class="copy-trigger" style="color:teal; text-decoration:underline; margin-left: 15px;"><span class="x-fa fa-copy" style="margin-right:5px;"></span>Копирай</small>',
                '                        <small class="share-trigger" style="color:purple; text-decoration:underline; margin-left: 15px;"><span class="x-fa fa-share-alt" style="margin-right:5px;"></span>Сподели</small>',
                '                    </td>',
                '                </tr>',
                '                </tpl>',
                '                <tr>',
                '                    <td><small class="email-trigger" style="color:blue; text-decoration:underline;"><span class="x-fa fa-envelope" style="margin-right:5px;"></span>{email}</small></td>',
                '                </tr>',
                '                <tr>',
                '                    <td><small>{dlag}</small></td>',
                '                </tr>',
                '            </table>',
                '            ',
                '            ',
                '        </td>',
                '         ',
                '    </tr>',
                '</table>'
            ],
            store: {
                fields: ['id', 'text', 'dlag', 'dlagid', 'pod', 'egn', 'gsm', 'email', 'glavpod', 'pict'],
                data: []  // Start empty; will populate with search results
            },
            listeners: {
                itemtap: 'onEmployeeSelect'  // Call onEmployeeSelect on item tap
            },
            flex: 1
        }
    ]
});
