/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('MyApp.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'MyApp',

        loremIpsum: 'В процес на разработка ...'
    },

    // store:{
    //     searchstore:{
    //         'type': 'tree'
    //     }
    //     // type: 'searchstore'
    // }


    //TODO - add data, formulas and/or methods to support your view
});
