const ctrl_countries = require('../controllers/ctrl_countries');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/countries',
        schema: {
            querystring: {
                page:  { type: 'integer', pattern: '^\\d{1,11}$', description: 'page number to display' },
                start: { type: 'integer', pattern: '^\\d{1,11}$', description: 'the number of items to skip' },
                limit: { type: 'integer', pattern: '^\\d{1,11}$', description: 'number of items to display' }
            },
            tags: [
                { name: 'countries' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_countries.getCountries
    },
    {
        method: 'GET',
        url: '/api/countries/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'countries id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'countries' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_countries.getCountriesById
    },
    {
        method: 'POST',
        url: '/api/countries',
        schema: {
            body: {
                type: 'object',
                required: ["code","description","active"],
                properties: {
                    code        : { type : 'string', pattern: '^.{1,2}$', description : '2 letter country ISO code' },
                    description : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    active      : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'countries' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_countries.createCountries
    },
    {
        method: 'DELETE',
        url: '/api/countries/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'countries id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'countries' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_countries.deleteCountriesById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/countries/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'countries id to update',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
                    code        : { type : 'string', pattern: '^.{1,2}$', description : '2 letter country ISO code' },
                    description : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    active      : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'countries' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_countries.updateCountriesById
    }
]
module.exports = routes