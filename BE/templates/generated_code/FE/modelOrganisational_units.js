Ext.define('opm.model.modelOrganisational_units', {
    extend: 'opm.model.Base',
    alias: 'model.modelOrganisational_units',
    fields: [

       { name: 'id' , type: 'int', useNull: true, persist: false},
       { name: 'country_id', type: 'int'}, 
       { name: 'city', type: 'string'}, 
       { name: 'name', type: 'string'}, 
       { name: 'code', type: 'string'}, 
       { name: 'address_line_1', type: 'string'}, 
       { name: 'address_line_2', type: 'string'}, 
       { name: 'address_line_3', type: 'string'}, 
       { name: 'address_line_4', type: 'string'}, 
       { name: 'contact_person_name', type: 'string'}, 
       { name: 'contact_person_email', type: 'string'}, 
       { name: 'contact_person_phone', type: 'string'}, 
       { name: 'active', type: 'int'}, 
       { name: 'is_leaf', type: 'int'}, 
       { name: 'parent_id', type: 'string'}, 
       { name: 'level', type: 'int'}, 
       { name: 'reference', type: 'string'}

    ],
    idProperty: 'id',
    validators: {
        
       country_id: [
          { type: 'format', matcher: /^\d{1,11}$/}
       ],
       city: [
          { type: 'length', min: 0, max: 100}
       ],
       name: [
          { type: 'length', min: 1, max: 100}
       ],
       code: [
          { type: 'length', min: 1, max: 10}
       ],
       address_line_1: [
          { type: 'length', min: 0, max: 100}
       ],
       address_line_2: [
          { type: 'length', min: 0, max: 100}
       ],
       address_line_3: [
          { type: 'length', min: 0, max: 100}
       ],
       address_line_4: [
          { type: 'length', min: 0, max: 100}
       ],
       contact_person_name: [
          { type: 'length', min: 0, max: 100}
       ],
       contact_person_email: [
          { type: 'length', min: 0, max: 100}
       ],
       contact_person_phone: [
          { type: 'length', min: 0, max: 100}
       ],
       active: [
          { type: 'format', matcher: /pattern: '^[01]$'/}
       ],
       is_leaf: [
          { type: 'format', matcher: /pattern: '^[01]$'/}
       ],
       parent_id: [
          { type: 'length', min: 1, max: 20}
       ],
       level: [
          { type: 'format', matcher: /^\d{1,11}$/}
       ],
       reference: [
          { type: 'length', min: 1, max: 20}
       ]

    }
});