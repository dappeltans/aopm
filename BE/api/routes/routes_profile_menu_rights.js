const ctrl_profile_menu_rights = require('../controllers/ctrl_profile_menu_rights');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'GET',
        url: '/api/profile_menu_rights',
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
        handler: ctrl_profile_menu_rights.getProfile_menu_rights
    },
    {
        method: 'GET',
        url: '/api/profile_menu_rights/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'profile_menu_rights id to select',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'profiles' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_profile_menu_rights.getProfile_menu_rightsById
    },
    {
        method: 'POST',
        url: '/api/profile_menu_rights',
        schema: {
            body: {
                type: 'object',
                required: ["unique_ref_id","profile_id","menu_id","allowed"],
                properties: {
                    unique_ref_id : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    profile_id    : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    menu_id       : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    allowed       : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'profiles' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_profile_menu_rights.createProfile_menu_rights
    },
    {
        method: 'DELETE',
        url: '/api/profile_menu_rights/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'profile_menu_rights id to delete',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            tags: [
                { name: 'profiles' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_profile_menu_rights.deleteProfile_menu_rightsById
    },
    {
        method: ['PUT','PATCH'],
        url: '/api/profile_menu_rights/:id',
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'profile_menu_rights id to update',
                        pattern: '^\\d{1,11}$'
                    }
                }
            },
            body: {
                type: 'object',
                properties: {
                    unique_ref_id : { type : 'string', pattern: '^.{1,50}$', description : '' },
                    profile_id    : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    menu_id       : { type : 'integer', pattern: '^\d{1,11}$', description : '' },
                    allowed       : { type : 'integer', pattern: '^[01]$', description : '' }
                }
            },
            tags: [
                { name: 'profiles' }
            ]
        },
        preHandler: [check_auth_middleware],
        handler: ctrl_profile_menu_rights.updateProfile_menu_rightsById
    }
]
module.exports = routes