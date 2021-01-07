'use strict';

require('dotenv').config();
const server = require("./app")({
  logger: true,
  https: {
    key: global.PRIVATE_KEY,
    cert: global.PUBLIC_KEY
  }
});

const start = async () => {
  try {
    await server.listen(global.port, "localhost");
    console.log(`server listening on ${global.port} in ${global.logLevel} level`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  process.on('SIGINT', async () => {
    console.log('stopping fastify server');
    await server.close();
    console.log('fastify server stopped');
    process.exit(0);
  });
}

start();

module.exports = server;