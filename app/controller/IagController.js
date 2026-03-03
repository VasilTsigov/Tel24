/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('MyApp.controller.IagController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.iagcontroller',

    /**
     * Open a URL via Cordova or browser
     */
    openExternal: function(url) {
        if (Ext.device && Ext.device.Device && Ext.device.Device.openURL) {
            Ext.device.Device.openURL(url);
        } else if (window && window.open) {
            window.open(url, '_system');
        } else {
            window.location.href = url;
        }
    },

    init: function() {
        var view = this.getView();
        if (view) {
            this.loadStoreData(view);
        }
    },

    loadStoreData: function(view) {
        var store = view.getStore();
        if (!store) {
            console.error('[IagController] No store found on view');
            return;
        }

        if (store.getCount() > 0) {
            console.log('[IagController] Store already has data');
            return;
        }

        var storeId = store.getStoreId();
        var url = this.getUrlForStore(storeId);

        if (!url) {
            console.error('[IagController] No URL configured for store:', storeId);
            return;
        }

        console.log('[IagController] Loading data for store:', storeId);
        var me = this;

        Ext.data.JsonP.request({
            url: url,
            callbackKey: 'callback',
            timeout: 30000,
            success: function(response) {
                console.log('[IagController] Response received for', storeId, ':', response);
                if (response && response.items && response.items.length > 0) {
                    store.setRoot({
                        text: 'Root',
                        id: 'root',
                        expanded: true,
                        children: response.items
                    });
                    console.log('[IagController]', storeId, 'loaded', response.items.length, 'items');
                } else {
                    console.warn('[IagController] No items in response for', storeId);
                }
            },
            failure: function(response) {
                console.error('[IagController] JSONP request failed for', storeId, ':', response);
            },
            scope: me
        });
    },

    getUrlForStore: function(storeId) {
        var urls = {
            'IagStore': 'https://vasil.iag.bg/tel/v7/iag_empl',
            'RdgStore': 'https://vasil.iag.bg/tel/v7/rdg_empl',
            'DpStore': 'https://vasil.iag.bg/tel/v7/dp_dgs_empl'
        };
        return urls[storeId] || null;
    },

    onItemTap : function(nestedList, list, index, target, record){

         if (record.get('leaf')) {
            nestedList.getDetailCard().setHtml(
                `<div style="display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 10px; font-size:20px;">
                    <!-- Container for the image and overlay -->
                    <div style="position: relative; display: inline-block;">
                        <!-- Main Image -->
                        <img src="https://vasil.iag.bg/upload/${record.get('glavpod')}/${record.get('pict')}"
                                alt="Picture of ${record.get('text')}"
                                style="width:140px; height:auto; border-radius: 8px;">
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
                        <button class="call-trigger" style="padding: 8px 12px; border-radius: 5px; border: none; background-color: #4CAF50; color: white; cursor: pointer; font-size:20px">
                            Call
                        </button>
                        <button class="sms-trigger" style="padding: 8px 12px; border-radius: 5px; border: none; background-color: #2196F3; color: white; cursor: pointer;font-size:20px">
                            SMS
                        </button>
                        <button class="email-trigger" style="padding: 8px 12px; border-radius: 5px; border: none; background-color: #f44336; color: white; cursor: pointer;font-size:20px">
                            Email
                        </button>
                    </div>
                </div>`
            );
        }

        // attach tap listener to detail card for external links
        var me = this;
        var detailCard = nestedList.getDetailCard();
        detailCard.element.on('tap', function(evt) {
            if (evt.getTarget('.call-trigger')) {
                me.openExternal('tel:' + record.get('gsm'));
            } else if (evt.getTarget('.sms-trigger')) {
                me.openExternal('sms:' + record.get('gsm'));
            } else if (evt.getTarget('.email-trigger')) {
                me.openExternal('mailto:' + record.get('email'));
            }
        });
    }
})
