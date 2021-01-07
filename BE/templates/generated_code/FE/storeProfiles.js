Ext.define('opm.store.storeProfiles', {
    extend: 'Ext.data.Store',

    alias: 'store.storeProfiles',

    model: 'opm.model.modelProfiles',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['profiles']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});