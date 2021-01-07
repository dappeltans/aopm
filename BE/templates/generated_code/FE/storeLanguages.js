Ext.define('opm.store.storeLanguages', {
    extend: 'Ext.data.Store',

    alias: 'store.storeLanguages',

    model: 'opm.model.modelLanguages',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['languages']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});