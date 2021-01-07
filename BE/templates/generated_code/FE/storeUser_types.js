Ext.define('opm.store.storeUser_types', {
    extend: 'Ext.data.Store',

    alias: 'store.storeUser_types',

    model: 'opm.model.modelUser_types',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['user_types']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});