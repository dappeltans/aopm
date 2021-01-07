Ext.define('opm.model.modelCustomers', {
    extend: 'opm.model.Base',
    alias: 'model.modelCustomers',
    fields: [

       { name: 'id' , type: 'int', useNull: true, persist: false},
       { name: 'name', type: 'string'}, 
       { name: 'code', type: 'string'}, 
       { name: 'fgcolor', type: 'string'}, 
       { name: 'bgcolor', type: 'string'}, 
       { name: 'ou_id', type: 'int'}, 
       { name: 'logo', type: 'string'}, 
       { name: 'active', type: 'int'}

    ],
    idProperty: 'id',
    validators: {
        
       name: [
          { type: 'length', min: 1, max: 50}
       ],
       code: [
          { type: 'length', min: 1, max: 8}
       ],
       fgcolor: [
          { type: 'length', min: 1, max: 10}
       ],
       bgcolor: [
          { type: 'length', min: 1, max: 10}
       ],
       ou_id: [
          { type: 'format', matcher: /^\d{1,11}$/}
       ],
       logo: [
          { type: 'length', min: 0, max: 255}
       ],
       active: [
          { type: 'format', matcher: /pattern: '^[01]$'/}
       ]

    }
});