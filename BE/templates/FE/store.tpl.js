Ext.define('opm.store.store$Table_name$', {
    extend: 'Ext.data.Store',

    alias: 'store.store$Table_name$',

    model: 'opm.model.model$Table_name$',
    autoLoad: true,
    autoSync: true,
    proxy: {
        type: 'rest',
        url: apiUrl + urlRoutes['$table_name$']['restUrl'],
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        writer: {
            type: 'json'
        }
    }
});