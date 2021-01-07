const ctrl_menu = require('../controllers/ctrl_menu');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/menu',
        schema: {
            querystring: {
                page:  { type: 'integer', pattern: '^\\d{1,11}$', description: 'page number to display' },
                start: { type: 'integer', pattern: '^\\d{1,11}$', description: 'the number of items to skip' },
                limit: { type: 'integer', pattern: '^\\d{1,11}$', description: 'number of items to display' }
            },
            tags: [
                { name: 'menu' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_menu.getMenu
    },
    {
        method: 'GET',
        url: '/api/menu/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'menu id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'menu' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_menu.getMenuById
    },
    {
        method: 'POST',
        url: '/api/menu',
        schema: {
            body: {
                type: 'object',
                required: ["menu_item_number","parent_id","menu_level","label","is_leaf","icon_cls","handler","active"],
                properties: {
                    menu_item_number : { type : 'string', pattern: '^.{1,10}$', description : '' },
                    parent_id        : { type : 'string', pattern: '^.{1,25}$', description : '' },
                    menu_level       : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    label            : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    is_leaf          : { type : 'integer', pattern: '^[01]$', description : '' },
                    icon_cls         : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    handler          : { type : 'string', pattern: '^.{1,4000}$', description : '' },
                    active           : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'menu' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_menu.createMenu
    },
    {
        method: 'DELETE',
        url: '/api/menu/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'menu id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'menu' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_menu.deleteMenuById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/menu/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'menu id to update',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
                    menu_item_number : { type : 'string', pattern: '^.{1,10}$', description : '' },
                    parent_id        : { type : 'string', pattern: '^.{1,25}$', description : '' },
                    menu_level       : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    label            : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    is_leaf          : { type : 'integer', pattern: '^[01]$', description : '' },
                    icon_cls         : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    handler          : { type : 'string', pattern: '^.{1,4000}$', description : '' },
                    active           : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'menu' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_menu.updateMenuById
    }
]
module.exports = routes