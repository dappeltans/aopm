const ctrl_menu_item_rights = require('../controllers/ctrl_menu_item_rights');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/menu_item_rights',
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
        handler: ctrl_menu_item_rights.getMenu_item_rights
    },
    {
        method: 'GET',
        url: '/api/menu_item_rights/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'menu_item_rights id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'menu' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_menu_item_rights.getMenu_item_rightsById
    },
    {
        method: 'POST',
        url: '/api/menu_item_rights',
        schema: {
            body: {
                type: 'object',
                required: ["menu_item_id","menu_item_right_label","variable_name","active"],
                properties: {
                    menu_item_id          : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    menu_item_right_label : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    variable_name         : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    active                : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'menu' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_menu_item_rights.createMenu_item_rights
    },
    {
        method: 'DELETE',
        url: '/api/menu_item_rights/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'menu_item_rights id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'menu' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_menu_item_rights.deleteMenu_item_rightsById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/menu_item_rights/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'menu_item_rights id to update',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
                    menu_item_id          : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    menu_item_right_label : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    variable_name         : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    active                : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'menu' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_menu_item_rights.updateMenu_item_rightsById
    }
]
module.exports = routes