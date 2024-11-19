Ext.define('MyApp.controller.SearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.searchcontroller',


    isLoading: false,  // Flag to track loading state

    showLoadingMask: function() {
        if (!this.isLoading) {  // Only show if not already loading
            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                message: 'Loading...'
            });
            this.isLoading = true;  // Set loading flag
        }
    },

    hideLoadingMask: function() {
        if (this.isLoading) {  // Only hide if currently loading
            Ext.Viewport.setMasked(false);
            this.isLoading = false;  // Reset loading flag
        }
    },


    // ///////////////////////////////////////////////////////////////////
    // ////// Търсене по име и фамилия или мобилен номер
    // //////////////////////////////////////////////////////////////////

    onSearchChange: function(field, newValue) {
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

    onEmployeeSelect: function(list, index, target, record) {
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
                        <button onclick="window.location.href='tel:${record.get('gsm')}'" style="padding: 8px 12px; border-radius: 5px; border: none; background-color: #4CAF50; color: white; cursor: pointer; font-size:20px">
                            Call
                        </button>
                        <button onclick="window.location.href='sms:${record.get('gsm')}'" style="padding: 8px 12px; border-radius: 5px; border: none; background-color: #2196F3; color: white; cursor: pointer;font-size:20px">
                            SMS
                        </button>
                        <button onclick="window.location.href='mailto:${record.get('email')}'" style="padding: 8px 12px; border-radius: 5px; border: none; background-color: #f44336; color: white; cursor: pointer;font-size:20px">
                            Email
                        </button>
                    </div>
                </div>
                    `
                }
            ]
        });

        // Show the panel
        Ext.Viewport.add(employeeDetailsPanel);
    }

});
