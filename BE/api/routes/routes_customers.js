const ctrl_customers = require('../controllers/ctrl_customers');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/customers',
        schema: {
            querystring: {
                page:  { type: 'integer', pattern: '^\\d{1,11}$', description: 'page number to display' },
                start: { type: 'integer', pattern: '^\\d{1,11}$', description: 'the number of items to skip' },
                limit: { type: 'integer', pattern: '^\\d{1,11}$', description: 'number of items to display' }
            },
            tags: [
                { name: 'customers' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_customers.getCustomers
    },
    {
        method: 'GET',
        url: '/api/customers/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'customers id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'customers' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_customers.getCustomersById
    },
    {
        method: 'POST',
        url: '/api/customers',
        schema: {
            body: {
                type: 'object',
                required: ["name","code","fgcolor","bgcolor","ou_id","logo","active"],
                properties: {
                    name    : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    code    : { type : 'string', pattern: '^.{1,8}$', description : '' },
                    fgcolor : { type : 'string', pattern: '^.{1,10}$', description : '' },
                    bgcolor : { type : 'string', pattern: '^.{1,10}$', description : '' },
                    ou_id   : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    logo    : { type : 'string', pattern: '^.{1,255}$', description : '' },
                    active  : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'customers' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_customers.createCustomers
    },
    {
        method: 'DELETE',
        url: '/api/customers/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'customers id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'customers' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_customers.deleteCustomersById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/customers/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'customers id to update',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
                    name    : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    code    : { type : 'string', pattern: '^.{1,8}$', description : '' },
                    fgcolor : { type : 'string', pattern: '^.{1,10}$', description : '' },
                    bgcolor : { type : 'string', pattern: '^.{1,10}$', description : '' },
                    ou_id   : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    logo    : { type : 'string', pattern: '^.{1,255}$', description : '' },
                    active  : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'customers' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_customers.updateCustomersById
    }
]
module.exports = routes