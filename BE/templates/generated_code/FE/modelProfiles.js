Ext.define('opm.model.modelProfiles', {
    extend: 'opm.model.Base',
    alias: 'model.modelProfiles',
    fields: [

       { name: 'id' , type: 'int', useNull: true, persist: false},
       { name: 'code', type: 'string'}, 
       { name: 'description', type: 'string'}, 
       { name: 'active', type: 'int'}

    ],
    idProperty: 'id',
    validators: {
        
       code: [
          { type: 'length', min: 1, max: 20}
       ],
       description: [
          { type: 'length', min: 1, max: 100}
       ],
       active: [
          { type: 'format', matcher: /pattern: '^[01]$'/}
       ]

    }
});