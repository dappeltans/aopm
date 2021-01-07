Ext.define('opm.model.modelMenu', {
    extend: 'opm.model.Base',
    alias: 'model.modelMenu',
    fields: [

       { name: 'id' , type: 'int', useNull: true, persist: false},
       { name: 'menu_item_number', type: 'string'}, 
       { name: 'parent_id', type: 'string'}, 
       { name: 'menu_level', type: 'int'}, 
       { name: 'label', type: 'string'}, 
       { name: 'is_leaf', type: 'int'}, 
       { name: 'icon_cls', type: 'string'}, 
       { name: 'handler', type: 'string'}, 
       { name: 'active', type: 'int'}

    ],
    idProperty: 'id',
    validators: {
        
       menu_item_number: [
          { type: 'length', min: 1, max: 10}
       ],
       parent_id: [
          { type: 'length', min: 1, max: 25}
       ],
       menu_level: [
          { type: 'format', matcher: /^\d{1,11}$/}
       ],
       label: [
          { type: 'length', min: 1, max: 50}
       ],
       is_leaf: [
          { type: 'format', matcher: /pattern: '^[01]$'/}
       ],
       icon_cls: [
          { type: 'length', min: 1, max: 50}
       ],
       handler: [
          { type: 'length', min: 1, max: 4000}
       ],
       active: [
          { type: 'format', matcher: /pattern: '^[01]$'/}
       ]

    }
});