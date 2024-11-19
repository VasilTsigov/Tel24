Ext.define('MyApp.model.iag.IagModel', {
    extend: 'MyApp.model.Base',

    // fields: [
    //     'text', 'email', 'gsm','dlag','dlagid','pod','egn','id','glavpod','pict','leaf','items'
    // ],

    fields: [
        { name: 'text', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'gsm', type: 'string' },
        { name: 'dlag', type: 'string' },
        { name: 'dlagid', type: 'integer' },
        { name: 'pod', type: 'string' },
        { name: 'egn', type: 'string' },
        { name: 'id', type: 'string' },
        { name: 'glavpod', type: 'string' },
        { name: 'pict', type: 'string' },
        { name: 'leaf', type: 'boolean', defaultValue: false },  // Ensure 'leaf' is defined
        // other fields...
    ]
});
