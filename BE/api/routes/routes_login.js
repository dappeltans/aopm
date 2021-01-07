const ctrl_login = require('../controllers/ctrl_login');
const routes = [
    {
        method: 'GET',
        url: '/api/login/user',
        schema: {
            headers: {
                type: 'object',
                properties: {
                    email_address   : { type : 'string', pattern: '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$',  description : 'user\'s email address which serves as login id' },
                    password        : { type : 'string', pattern: '^.{1,255}$', description : 'user\'s password' },
                    token           : { type : 'string', pattern: '^.{1,2000}$', description : 'token received from server' },
                    tenant          : { type : 'string', pattern: '^.{1,50}$', description : 'name of tenant for which the user whiches to log in' },
                }
            },
            tags: [
                { name: 'login' }
            ]
        },
        preHandler: [],
        handler: ctrl_login.login
    }
]
module.exports = routes