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
                                `<div style="display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 10px;">
                                    <!-- Container for the image and overlay -->
                                    <div style="position: relative; display: inline-block;">
                                        <!-- Main Image -->
                                        <img src="https://vasil.iag.bg/upload/${record.get('glavpod')}/${record.get('pict')}"
                                             alt="Picture of ${record.get('text')}"
                                             style="width:150px; height:225px; border-radius: 8px;">
                                    </div>

                                    <!-- Additional details below the image -->
                                    <div style="margin-top: 10px; color: #333;">
                                        <p><b>${record.get('text')}</b></p>
                                        <p>${record.get('dlag')}</p>
                                        <p>${record.get('pod')}</p>

                                        <p><b>Телефон:</b> ${record.get('gsm')}</p>
                                        <p><b>Email:</b> ${record.get('email')}</p>
                                    </div>

                                    <!-- Action buttons for call, SMS, and email -->
                                    <div style="display: flex; justify-content: center; gap: 10px; margin-top: 15px;">
                                        <button onclick="window.location.href='tel:${record.get('gsm')}'" style="padding: 8px 12px; border-radius: 5px; border: none; background-color: #4CAF50; color: white; cursor: pointer;">
                                            Call
                                        </button>
                                        <button onclick="window.location.href='sms:${record.get('gsm')}'" style="padding: 8px 12px; border-radius: 5px; border: none; background-color: #2196F3; color: white; cursor: pointer;">
                                            SMS
                                        </button>
                                        <button onclick="window.location.href='mailto:${record.get('email')}'" style="padding: 8px 12px; border-radius: 5px; border: none; background-color: #f44336; color: white; cursor: pointer;">
                                            Email
                                        </button>
                                    </div>
                                </div>`
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
            items: tabItems // Only include the tab items here
        });

        // Add the TabPanel to the viewport
        Ext.Viewport.add(tabPanel);
    }
});
