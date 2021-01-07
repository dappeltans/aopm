Ext.define('opm.store.storeCustomers', {
    extend: 'Ext.data.Store',

    alias: 'store.storeCustomers',

    model: 'opm.model.modelCustomers',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['customers']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});