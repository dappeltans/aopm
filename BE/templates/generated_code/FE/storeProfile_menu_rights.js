Ext.define('opm.store.storeProfile_menu_rights', {
    extend: 'Ext.data.Store',

    alias: 'store.storeProfile_menu_rights',

    model: 'opm.model.modelProfile_menu_rights',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['profile_menu_rights']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});