const ctrl_user_types = require('../controllers/ctrl_user_types');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/user_types',
        schema: {
            querystring: {
                page:  { type: 'integer', pattern: '^\\d{1,11}$', description: 'page number to display' },
                start: { type: 'integer', pattern: '^\\d{1,11}$', description: 'the number of items to skip' },
                limit: { type: 'integer', pattern: '^\\d{1,11}$', description: 'number of items to display' }
            },
            tags: [
                { name: 'users' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_user_types.getUser_types
    },
    {
        method: 'GET',
        url: '/api/user_types/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'user_types id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'users' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_user_types.getUser_typesById
    },
    {
        method: 'POST',
        url: '/api/user_types',
        schema: {
            body: {
                type: 'object',
                required: ["code","description","active"],
                properties: {
                    code        : { type : 'string', pattern: '^.{1,20}$', description : '' },
                    description : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    active      : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'users' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_user_types.createUser_types
    },
    {
        method: 'DELETE',
        url: '/api/user_types/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'user_types id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'users' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_user_types.deleteUser_typesById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/user_types/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'user_types id to update',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
                    code        : { type : 'string', pattern: '^.{1,20}$', description : '' },
                    description : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    active      : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'users' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_user_types.updateUser_typesById
    },
]
module.exports = routes