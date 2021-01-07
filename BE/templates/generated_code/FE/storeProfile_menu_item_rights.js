Ext.define('opm.store.storeProfile_menu_item_rights', {
    extend: 'Ext.data.Store',

    alias: 'store.storeProfile_menu_item_rights',

    model: 'opm.model.modelProfile_menu_item_rights',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['profile_menu_item_rights']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});