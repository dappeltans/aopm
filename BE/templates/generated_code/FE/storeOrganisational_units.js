Ext.define('opm.store.storeOrganisational_units', {
    extend: 'Ext.data.Store',

    alias: 'store.storeOrganisational_units',

    model: 'opm.model.modelOrganisational_units',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['organisational_units']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});