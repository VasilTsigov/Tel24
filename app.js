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
                                `<img src="https://vasil.iag.bg/upload/${record.get('glavpod')}/${record.get('pict')}" alt="Picture of ${record.get('text')}" style="width:120px;height:160px;">`
                            );
                        }
                    }
                }
            };
        });

        // Create the TabPanel with dynamically generated tab items
        const tabPanel = Ext.create('Ext.TabPanel', {
            fullscreen: true,
            tabBarPosition: 'bottom',
            dockedItems: [
                {
                    xtype: 'textfield',
                    docked: 'top',
                    placeHolder: 'Search by name...',
                    listeners: {
                        change: function (field, newValue) {
                            filterAllTabs(tabPanel, newValue);
                        }
                    }
                }
            ],
            items: tabItems
        });

        // Add the TabPanel to the viewport
        Ext.Viewport.add(tabPanel);

        // Function to filter all tabs by search term
        function filterAllTabs(tabPanel, searchText) {
            searchText = searchText.toLowerCase(); // Convert to lowercase for case-insensitive search

            tabPanel.items.each((tab) => {
                // Ensure each tab is a nested list with a store to filter
                if (tab.xtype === 'nestedlist') {
                    const store = tab.getStore();

                    // Clear existing filters
                    store.clearFilter();

                    // Apply new filter if search text is not empty
                    if (searchText) {
                        store.filterBy((record) => {
                            const textValue = record.get('text') ? record.get('text').toLowerCase() : '';
                            return textValue.includes(searchText);
                        });
                    }
                }
            });
        }
    }
});

