Ext.define('opm.model.modelLanguages', {
    extend: 'opm.model.Base',
    alias: 'model.modelLanguages',
    fields: [

       { name: 'id' , type: 'int', useNull: true, persist: false},
       { name: 'code', type: 'string'}, 
       { name: 'description', type: 'string'}, 
       { name: 'active', type: 'int'}

    ],
    idProperty: 'id',
    validators: {
        
       code: [
          { type: 'length', min: 1, max: 255}
       ],
       description: [
          { type: 'length', min: 1, max: 255}
       ],
       active: [
          { type: 'format', matcher: /pattern: '^[01]$'/}
       ]

    }
});