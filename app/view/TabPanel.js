// app/view/TabPanel.js
Ext.define('MyApp.view.TabPanel', {
    extend: 'Ext.Container',
    xtype: 'tabview',

    config: {
        storeUrl: ''
    },

    initialize: function () {
        this.callParent(arguments);

        const store = Ext.create('MyApp.store.TreeStore', {
            proxy: {
                type: 'jsonp',
                url: this.getStoreUrl(),
                reader: {
                    type: 'json',
                    rootProperty: 'items'
                }
            },
            autoLoad: true,
            listeners: {
                load: function (store) {
                    if (Ext.Viewport.getMasked()) {
                        Ext.Viewport.setMasked(false);
                    }
                }
            }
        });

        this.add({
            xtype: 'nestedlist',
            store: store,
            displayField: 'text',
            detailCard: {
                xtype: 'panel',
                scrollable: true
            },
            listeners: {
                itemtap: function (nestedList, list, index, target, record) {
                    if (record.get('leaf')) {
                        nestedList.getDetailCard().setHtml(
                            `<b>Име:</b> ${record.get('text')}<br>` +
                            `<b>Длъжност:</b> ${record.get('dlag')}<br>` +
                            `<b>Подразделение:</b> ${record.get('pod')}<br>` +
                            `<b>ЕГН:</b> ${record.get('egn')}<br>` +
                            `<b>Телефон:</b> ${record.get('gsm')}<br>` +
                            `<b>Email:</b> ${record.get('email')}<br>` +
                            `<img src="https://vasil.iag.bg/upload/${record.get('glavpod')}/${record.get('pict')}" alt="Picture of ${record.get('text')}" style="width:120px;height:80px;">`
                        );
                    }
                }
            }
        });
    }
});
