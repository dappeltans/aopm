Ext.define('opm.store.storeMenu', {
    extend: 'Ext.data.Store',

    alias: 'store.storeMenu',

    model: 'opm.model.modelMenu',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['menu']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});