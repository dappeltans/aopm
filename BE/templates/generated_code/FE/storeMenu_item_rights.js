Ext.define('opm.store.storeMenu_item_rights', {
    extend: 'Ext.data.Store',

    alias: 'store.storeMenu_item_rights',

    model: 'opm.model.modelMenu_item_rights',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['menu_item_rights']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});