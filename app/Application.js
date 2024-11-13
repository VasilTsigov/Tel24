// app/Application.js
Ext.define('MyApp.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'MyApp.view.Main'
    ],

    controllers: ['MainController'],

    launch: function () {
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Зареждам данни ...'
        });
    }
});

