Ext.define('opm.model.modelMenu_item_rights', {
    extend: 'opm.model.Base',
    alias: 'model.modelMenu_item_rights',
    fields: [

       { name: 'id' , type: 'int', useNull: true, persist: false},
       { name: 'menu_item_id', type: 'int'}, 
       { name: 'menu_item_right_label', type: 'string'}, 
       { name: 'variable_name', type: 'string'}, 
       { name: 'active', type: 'int'}

    ],
    idProperty: 'id',
    validators: {
        
       menu_item_id: [
          { type: 'format', matcher: /^\d{1,11}$/}
       ],
       menu_item_right_label: [
          { type: 'length', min: 1, max: 50}
       ],
       variable_name: [
          { type: 'length', min: 1, max: 50}
       ],
       active: [
          { type: 'format', matcher: /pattern: '^[01]$'/}
       ]

    }
});