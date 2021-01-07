const ctrl_root = require('../controllers/ctrl_root');
const routes = [
    {
        method: 'GET',
        url: '/api',
        schema: {
            tags: [
                { name: 'test' }
            ]
        },
        preHandler: [],
        handler: ctrl_root.getRoot
    }
]
module.exports = routes