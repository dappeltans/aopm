const ctrl_codeGenerator    = require('../controllers/ctrl_codeGenerator');
const check_auth_middleware = require('../middleware/check_auth');
const routes = [
    {
        method: 'POST',
        url: '/api/code_generator',
        schema: {
            body: {
                type: 'object',
                properties: {
                    tenant                      : { type: 'string', pattern: '^.{1,50}$',  description: 'tenant name' },
                    tableName                   : { type: 'string', pattern: '^.{1,50}$',  description: 'table name for which the CRUD API\'s need to be generated' },
                    displayGroupName            : { type: 'string', pattern: '^.{1,50}$',  description: 'group name under which the generated API\'s need to be displayed in the API docs' },
                    uniqueReferenceColumnName   : { type: 'string', pattern: '^.{1,50}$',  description: 'name of the column that should contain unique values' }
                }
            },
            tags: [
                { name: 'code_generator' }
            ]
        },
        preHandler: [],
        handler: ctrl_codeGenerator.generateCrudApiCode
    },
]
module.exports = routes