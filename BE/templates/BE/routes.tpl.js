const ctrl_$table_name$ = require('../controllers/ctrl_$table_name$');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/$table_name$',
        schema: {
            querystring: {
                page:  { type: 'integer', pattern: '^\\d{1,11}$', description: 'page number to display' },
                start: { type: 'integer', pattern: '^\\d{1,11}$', description: 'the number of items to skip' },
                limit: { type: 'integer', pattern: '^\\d{1,11}$', description: 'number of items to display' }
            },
            tags: [
                { name: '$group_name$' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_$table_name$.get$Table_name$
    },
    {
        method: 'GET',
        url: '/api/$table_name$/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: '$table_name$ id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: '$group_name$' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_$table_name$.get$Table_name$ById
    },
    {
        method: 'POST',
        url: '/api/$table_name$',
        schema: {
            body: {
                type: 'object',
                required: [$route_table_list_columns_without_id_colum$],
                properties: {
$route_table_column_definitions$
                }
            },
            tags: [
                { name: '$group_name$' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_$table_name$.create$Table_name$
    },
    {
        method: 'DELETE',
        url: '/api/$table_name$/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: '$table_name$ id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: '$group_name$' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_$table_name$.delete$Table_name$ById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/$table_name$/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: '$table_name$ id to update',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
$route_table_column_definitions$
                }
            },
            tags: [
                { name: '$group_name$' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_$table_name$.update$Table_name$ById
    }
]
module.exports = routes