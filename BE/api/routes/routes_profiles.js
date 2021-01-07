const ctrl_profiles = require('../controllers/ctrl_profiles');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/profiles',
        schema: {
            querystring: {
                page:  { type: 'integer', pattern: '^\\d{1,11}$', description: 'page number to display' },
                start: { type: 'integer', pattern: '^\\d{1,11}$', description: 'the number of items to skip' },
                limit: { type: 'integer', pattern: '^\\d{1,11}$', description: 'number of items to display' }
            },
            tags: [
                { name: 'profiles' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_profiles.getProfiles
    },
    {
        method: 'GET',
        url: '/api/profiles/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'profiles id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'profiles' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_profiles.getProfilesById
    },
    {
        method: 'POST',
        url: '/api/profiles',
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
                { name: 'profiles' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_profiles.createProfiles
    },
    {
        method: 'DELETE',
        url: '/api/profiles/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'profiles id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'profiles' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_profiles.deleteProfilesById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/profiles/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'profiles id to update',
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
                { name: 'profiles' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_profiles.updateProfilesById
    }
]
module.exports = routes