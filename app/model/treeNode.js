// app/model/TreeNode.js
Ext.define('MyApp.model.TreeNode', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'text', type: 'string' },
        { name: 'dlag', type: 'string' },
        { name: 'pod', type: 'string' },
        { name: 'egn', type: 'string' },
        { name: 'gsm', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'glavpod', type: 'string' },
        { name: 'pict', type: 'string' },
        { name: 'leaf', type: 'boolean' }
    ]
});
