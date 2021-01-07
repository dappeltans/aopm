Ext.define('opm.model.modelProfile_menu_rights', {
    extend: 'opm.model.Base',
    alias: 'model.modelProfile_menu_rights',
    fields: [

       { name: 'id' , type: 'int', useNull: true, persist: false},
       { name: 'unique_ref_id', type: 'string'}, 
       { name: 'profile_id', type: 'int'}, 
       { name: 'menu_id', type: 'int'}, 
       { name: 'allowed', type: 'int'}

    ],
    idProperty: 'id',
    validators: {
        
       unique_ref_id: [
          { type: 'length', min: 1, max: 50}
       ],
       profile_id: [
          { type: 'format', matcher: /^\d{1,11}$/}
       ],
       menu_id: [
          { type: 'format', matcher: /^\d{1,11}$/}
       ],
       allowed: [
          { type: 'format', matcher: /pattern: '^[01]$'/}
       ]

    }
});