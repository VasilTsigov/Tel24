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
                '        <td style="padding:10px"><img src="https://vasil.iag.bg/upload/{glavpod}/{pict}" width="80" auto></img></td>',
                '        <td>',
                '            <table>',
                '                <tr>',
                '                    <td><b>{text}</b></td>',
                '                </tr> ',
                '                <tr>',
                '                    <td><small>{pod}</small></td>',
                '                </tr>',
                '                <tr>',
                '                    <td><small>{gsm}</small></td>',
                '                </tr>',
                '                <tr>',
                '                    <td><small>{email}</small></td>',
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
            // flex: 1
        }
    ]
});
