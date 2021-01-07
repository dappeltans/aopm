const ctrl_organisational_units = require('../controllers/ctrl_organisational_units');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/organisational_units',
        schema: {
            querystring: {
                page:  { type: 'integer', pattern: '^\\d{1,11}$', description: 'page number to display' },
                start: { type: 'integer', pattern: '^\\d{1,11}$', description: 'the number of items to skip' },
                limit: { type: 'integer', pattern: '^\\d{1,11}$', description: 'number of items to display' }
            },
            tags: [
                { name: 'organisational_units' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_organisational_units.getOrganisational_units
    },
    {
        method: 'GET',
        url: '/api/organisational_units/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'organisational_units id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'organisational_units' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_organisational_units.getOrganisational_unitsById
    },
    {
        method: 'POST',
        url: '/api/organisational_units',
        schema: {
            body: {
                type: 'object',
                required: ["country_id","city","name","code","address_line_1","address_line_2","address_line_3","address_line_4","contact_person_name","contact_person_email","contact_person_phone","active","is_leaf","parent_id","level","reference"],
                properties: {
                    country_id           : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    city                 : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    name                 : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    code                 : { type : 'string', pattern: '^.{1,10}$', description : '' },
                    address_line_1       : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    address_line_2       : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    address_line_3       : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    address_line_4       : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    contact_person_name  : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    contact_person_email : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    contact_person_phone : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    active               : { type : 'integer', pattern: '^[01]$', description : '' },
                    is_leaf              : { type : 'integer', pattern: '^[01]$', description : '' },
                    parent_id            : { type : 'string', pattern: '^.{1,20}$', description : '' },
                    level                : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    reference            : { type : 'string', pattern: '^.{1,20}$', description : '' }
                }
            },
            tags: [
                { name: 'organisational_units' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_organisational_units.createOrganisational_units
    },
    {
        method: 'DELETE',
        url: '/api/organisational_units/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'organisational_units id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'organisational_units' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_organisational_units.deleteOrganisational_unitsById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/organisational_units/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'organisational_units id to update',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
                    country_id           : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    city                 : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    name                 : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    code                 : { type : 'string', pattern: '^.{1,10}$', description : '' },
                    address_line_1       : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    address_line_2       : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    address_line_3       : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    address_line_4       : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    contact_person_name  : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    contact_person_email : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    contact_person_phone : { type : 'string', pattern: '^.{1,100}$', description : '' },
                    active               : { type : 'integer', pattern: '^[01]$', description : '' },
                    is_leaf              : { type : 'integer', pattern: '^[01]$', description : '' },
                    parent_id            : { type : 'string', pattern: '^.{1,20}$', description : '' },
                    level                : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    reference            : { type : 'string', pattern: '^.{1,20}$', description : '' }
                }
            },
            tags: [
                { name: 'organisational_units' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_organisational_units.updateOrganisational_unitsById
    }
]
module.exports = routes