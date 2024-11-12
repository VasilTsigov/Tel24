/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Tel24.Application',

    name: 'Tel24',

    requires: [
        // This will automatically load all classes in the Tel24 namespace
        // so that application classes do not need to require each other.
        'Tel24.*'
    ],

    // The name of the initial view to create.
    mainView: 'Tel24.view.main.Main'
});
