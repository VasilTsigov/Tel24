Ext.define('MyApp.controller.SearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.searchcontroller',

    /**
     * Open a URL using a system handler.  Falls back to changing
     * `window.location` when not running inside Cordova.
     */
    openExternal: function(url) {
        if (Ext.device && Ext.device.Device && Ext.device.Device.openURL) {
            Ext.device.Device.openURL(url);
        } else if (window && window.open) {
            // In browser or when plugin unavailable, open in system
            window.open(url, '_system');
        } else {
            window.location.href = url;
        }
    },

    isLoading: false,  // Flag to track loading state
    searchTimer: null, // Timer for debounce

    showLoadingMask: function() {
        if (!this.isLoading) {  // Only show if not already loading
            var view = this.getView();
            if (view) {
                view.setMasked({
                    xtype: 'loadmask',
                    message: 'Зареждане...'
                });
                this.isLoading = true;
            }
        }
    },

    hideLoadingMask: function() {
        if (this.isLoading) {  // Only hide if currently loading
            var view = this.getView();
            if (view) {
                view.setMasked(false);
            }
            this.isLoading = false;
        }
    },


    // ///////////////////////////////////////////////////////////////////
    // ////// Търсене по име и фамилия или мобилен номер
    // //////////////////////////////////////////////////////////////////

    onSearchChange: function(field, newValue) {
        // Clear previous timer if user keeps typing
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }

        // Wait 500ms before executing search logic
        this.searchTimer = setTimeout(() => {
            this.performSearch(newValue);
        }, 500);
    },

    performSearch: function(newValue) {
        const searchValue = newValue.trim();
        const searchResultList = this.lookupReference('searchResultList');

        // Regex patterns for "FirstName and LastName" and "GSM"
        const namePattern = /^[a-zA-Zа-яА-Я]{1,}\s[a-zA-Zа-яА-Я]{1,}$/;  // 1+ letters, space, 1+ letters
        const gsmPattern = /^\d{5,}$/;  // 5+ digits

        if (namePattern.test(searchValue)) {
            // Input matches the name pattern
            const [firstName, lastName] = searchValue.split(' ');
            this.performSearchByName(firstName, lastName, searchResultList);
        } else if (gsmPattern.test(searchValue)) {
            // Input matches the GSM pattern
            this.performSearchByGSM(searchValue, searchResultList);
        } else {
            // Clear results if input is invalid
            searchResultList.getStore().setData([]);
        }
    },

    performSearchByName: function(firstName, lastName, list) {
        this.showLoadingMask();
        Ext.data.JsonP.request({
            url: `https://vasil.iag.bg/all_empl/imeAndFam?strIme=${firstName}&strFam=${lastName}`,
            callbackKey: 'callback',
            success: function(response) {
                const itemsArray = response.data.items || [];
                list.getStore().setData(itemsArray);
                this.hideLoadingMask();
            },
            failure: function() {
                Ext.Msg.alert('Error', 'Failed to fetch data by name. Please try again.');
                this.hideLoadingMask();
            },
            scope: this  // Set scope to use 'this' inside callbacks
        });
    },

    performSearchByGSM: function(gsm, list) {
        this.showLoadingMask();
        Ext.data.JsonP.request({
            url: `https://vasil.iag.bg/all_empl/byGSM?number=${gsm}`,
            callbackKey: 'callback',
            success: function(response) {
                const itemsArray = response.data.items || [];
                list.getStore().setData(itemsArray);
                this.hideLoadingMask();
            },
            failure: function() {
                Ext.Msg.alert('Error', 'Failed to fetch data by GSM. Please try again.');
                this.hideLoadingMask();
            },
            scope:this
        });
    },


    //////////////////////////////////////////////////////////////////////////////////////

    onEmployeeSelect: function(list, index, target, record, e) {
        // Check if the tap target has the 'call-trigger' class
        if (e.getTarget('.call-trigger')) {
            this.openExternal('tel:' + record.get('gsm'));
            return; // Stop execution so the detail panel doesn't open
        }

        // Check if the tap target has the 'sms-trigger' class
        if (e.getTarget('.sms-trigger')) {
            this.openExternal('sms:' + record.get('gsm'));
            return; // Stop execution
        }

        // Check if the tap target has the 'save-trigger' class
        if (e.getTarget('.save-trigger')) {
            this.createAndDownloadVCard(record);
            return; // Stop execution
        }

        // Check if the tap target has the 'copy-trigger' class
        if (e.getTarget('.copy-trigger')) {
            this.copyToClipboard(record.get('gsm'));
            return; // Stop execution
        }

        // Check if the tap target has the 'share-trigger' class
        if (e.getTarget('.share-trigger')) {
            this.shareContact(record);
            return; // Stop execution
        }

        // Check if the tap target has the 'email-trigger' class
        if (e.getTarget('.email-trigger')) {
            this.openExternal('mailto:' + record.get('email'));
            return; // Stop execution
        }

        // Define the full-screen panel for employee details
        const employeeDetailsPanel = Ext.create('Ext.Panel', {
            fullscreen: true,  // Makes the panel occupy the full screen
            layout: 'vbox',
            scrollable: true,
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',
                    title: '',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Затвори',
                            align: 'right',
                            handler: function() {
                                employeeDetailsPanel.destroy();  // Close the panel when tapped
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    padding: 20,
                    html: `
            <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 10px; font-size:20px;">
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
                </div>
                    `
                }
            ]
        });

        // Add tap handler on the panel element to intercept buttons
        var me = this;
        employeeDetailsPanel.element.on('tap', function(evt) {
            if (evt.getTarget('.call-trigger')) {
                me.openExternal('tel:' + record.get('gsm'));
            } else if (evt.getTarget('.sms-trigger')) {
                me.openExternal('sms:' + record.get('gsm'));
            } else if (evt.getTarget('.email-trigger')) {
                me.openExternal('mailto:' + record.get('email'));
            }
        });

        // Show the panel
        Ext.Viewport.add(employeeDetailsPanel);
    },

    createAndDownloadVCard: function(record) {
        var name = record.get('text') || 'Unknown';
        var phone = record.get('gsm') || '';
        var email = record.get('email') || '';
        var title = record.get('dlag') || '';
        var org = record.get('pod') || 'ИАГ';

        // Construct vCard 3.0 format
        var vCardData = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            'FN:' + name,
            'TEL;TYPE=CELL:' + phone,
            'EMAIL:' + email,
            'TITLE:' + title,
            'ORG:' + org,
            'END:VCARD'
        ].join('\n');

        // Create a blob and trigger download
        var blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
        var url = window.URL.createObjectURL(blob);
        
        var link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name + '.vcf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    shareContact: function(record) {
        if (navigator.share) {
            var text = [
                record.get('text'),
                record.get('dlag'),
                'Тел: ' + record.get('gsm'),
                'Email: ' + record.get('email')
            ].filter(function(val) { return !!val; }).join('\n');

            navigator.share({
                title: 'Контакт: ' + record.get('text'),
                text: text
            })
            .catch(function(error) { console.log('Error sharing', error); });
        } else {
            Ext.Msg.alert('Инфо', 'Споделянето не се поддържа от този браузър.');
        }
    },

    copyToClipboard: function(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                Ext.toast('Номерът е копиран: ' + text, 2000);
            }, function(err) {
                Ext.toast('Грешка при копиране', 2000);
            });
        } else {
            // Fallback for older browsers/webviews
            var textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                Ext.toast('Номерът е копиран: ' + text, 2000);
            } catch (err) {
                Ext.toast('Грешка при копиране', 2000);
            }
            document.body.removeChild(textArea);
        }
    }
});
