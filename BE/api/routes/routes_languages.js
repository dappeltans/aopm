const ctrl_languages = require('../controllers/ctrl_languages');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/languages',
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
        handler: ctrl_languages.getLanguages
    },
    {
        method: 'GET',
        url: '/api/languages/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'languages id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'users' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_languages.getLanguagesById
    },
    {
        method: 'POST',
        url: '/api/languages',
        schema: {
            body: {
                type: 'object',
                required: ["code","description","active"],
                properties: {
                    code        : { type : 'string', pattern: '^.{1,255}$', description : '' },
                    description : { type : 'string', pattern: '^.{1,255}$', description : '' },
                    active      : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'users' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_languages.createLanguages
    },
    {
        method: 'DELETE',
        url: '/api/languages/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'languages id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'users' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_languages.deleteLanguagesById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/languages/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'languages id to update',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
                    code        : { type : 'string', pattern: '^.{1,255}$', description : '' },
                    description : { type : 'string', pattern: '^.{1,255}$', description : '' },
                    active      : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'users' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_languages.updateLanguagesById
    }
]
module.exports = routes