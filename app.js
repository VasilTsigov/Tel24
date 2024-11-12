Ext.application({
    name: 'MyApp',

    launch: function () {
        // Array of tab configurations with different URLs and titles
        const tabsConfig = [
            { title: 'РДГ', url: 'https://vasil.iag.bg/tel/v7/rdg_dgs_empl' },
            { title: 'ИАГ', url: 'https://vasil.iag.bg/tel/v7/iag_empl' },
            { title: 'ДП', url: 'https://vasil.iag.bg/tel/v7/dp_dgs_empl' },
            { title: 'РДГ (под)', url: 'https://vasil.iag.bg/tel/v7/rdg_empl' }
        ];

        // Set a loading mask initially
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Зареждам данни ...'
        });

        let loadedStores = 0; // Counter to track loaded stores

        // Create tab items by mapping over the tabsConfig array
        const tabItems = tabsConfig.map((tab) => {
            const treeStore = Ext.create('Ext.data.TreeStore', {
                proxy: {
                    type: 'jsonp',
                    url: tab.url,
                    reader: {
                        type: 'json',
                        rootProperty: 'items'
                    }
                },
                root: {
                    text: 'Root',
                    id: 'root',
                    expanded: true
                },
                sorters: [
                    { property: 'dlagid', direction: 'ASC' },
                    { property: 'text', direction: 'ASC' }
                ],
                autoLoad: true,
                listeners: {
                    load: function () {
                        loadedStores++; // Increment the counter for loaded stores
                        if (loadedStores === tabsConfig.length) {
                            // Remove the mask only after all stores have loaded
                            Ext.Viewport.setMasked(false);
                        }
                    }
                }
            });

            return {
                title: tab.title,
                xtype: 'nestedlist',
                store: treeStore,
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
                                `<img src="https://vasil.iag.bg/upload/${record.get('glavpod')}/${record.get('pict')}" alt="Picture of ${record.get('text')}" style="width:80px;height:80px;">`
                            );
                        }
                    }
                }
            };
        });

        // Create the TabPanel with dynamically generated tab items
        Ext.create('Ext.TabPanel', {
            fullscreen: true,
            tabBarPosition: 'bottom',
            items: tabItems
        });
    }
});
