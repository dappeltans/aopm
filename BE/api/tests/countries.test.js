require('dotenv').config();
'use strict';

const jwt = require('jsonwebtoken');

var myId = 0;

const {itif, createRegressionTestSsoTicket} = require("../../utils/utils");

var testsToRunObj = {
  POST                  : 1,
  POSTEXCEEDFIELDLENGTH : 1,
  POSTEMPTYFIELD        : 1,
  GET                   : 1,
  GETBYID               : 1,
  PUTBYID               : 1,
  PATCHBYID             : 1,
  DELETEBYID            : 1
}

const fastify = require("../../../app")({
  logger: true,
  https: {
    key: global.PRIVATE_KEY,
    cert: global.PUBLIC_KEY
  }
});

const SSO_ticket = createRegressionTestSsoTicket();

const tableName       = "countries";
const tableNamelength = tableName.length; 

afterAll((done) => {
  fastify.close();
  // closing connection to auth db otherwise npm test will not return the prompt
  global.connection.end();
  // closing all tenant db connections otherwise npm test will not return the prompt
  global.tenants.forEach(function(ctenant) {
    var ctenantUp = ctenant.toUpperCase();
    var ctenantLow = ctenant.toLowerCase();
    global.connection_tenants[ctenantLow]["DB"].end();
  });
  done();
});

describe('countries CRUD unit tests', () => {

  itif(testsToRunObj.POST)('Responds with 201 on request POST   /api/'+ tableName + '      for creating a new item.', async (done) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/' + tableName,
      payload: {
          "code" : "F",
          "description" : "6Um", // "6U\}07\]m"
          "active" : "0"
      },
      cookies: {
        SSO_ticket: SSO_ticket
      }
    });
    var payload = response.payload;
    var payloadObj = JSON.parse(payload);
    myId = parseInt(payloadObj.data.id);
    expect(response.statusCode).toBe(201);
    expect(myId).toBeGreaterThan(0);
    done();
  });

  itif(testsToRunObj.POSTEXCEEDFIELDLENGTH)('Responds with 400 on request POST   /api/' + tableName + '      for exceeding field length.', async (done) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/' + tableName,
      payload: {
          "code" : "XXX",
          "description" : "DpBJ$?zu$FtcGp:<",
          "active" : "0"
      },
      cookies: {
        SSO_ticket: SSO_ticket
      }
    });
    expect(response.statusCode).toBe(400);
    done();
  });

  itif(testsToRunObj.POSTEMPTYFIELD)('Responds with 400 on request POST   /api/' + tableName + '      for empty field length.', async (done) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/' + tableName,
      payload: {
          "code" : "",
          "description" : "i^d0zf;I;8H&g0v@uOYcht#t xT#o-UAGgi#PkT",
          "active" : "0"
      },
      cookies: {
        SSO_ticket: SSO_ticket
      }
    });
    expect(response.statusCode).toBe(400);
    done();
  });

  itif(testsToRunObj.GET)('Responds with 200 on request GET    /api/' + tableName + '      for retrieving all items.', async (done) => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/' + tableName,
        cookies: {
          SSO_ticket: SSO_ticket
        }
      });
      expect(response.statusCode).toBe(200);
      done();
  });
  
  itif(testsToRunObj.GETBYID)('Responds with 200 on request GET    /api/'+tableName+'/:id  for retrieving item with provided id.', async (done) => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/'+tableName+'/' + myId,
      cookies: {
        SSO_ticket: SSO_ticket
      }
    });
    expect(response.statusCode).toBe(200);
    done();
  });
  
  itif(testsToRunObj.PUTBYID)('Responds with 200 on request PUT    /api/'+tableName+'/:id  for updating item with provided id.', async (done) => {
    const response = await fastify.inject({
      method: 'PUT',
      url: '/api/'+tableName+'/' + myId,
      payload: {
          "code" : "a\?",
          "description" : "c\$aV8\/f>kTRvx\*BM0C>12cGj1'Ao\(\-",
          "active" : "0"
      },
      cookies: {
        SSO_ticket: SSO_ticket
      }
    });
    expect(response.statusCode).toBe(200);
    done();
  });

  itif(testsToRunObj.PATCHBYID)('Responds with 200 on request PATCH  /api/'+tableName+'/:id  for updating item with provided id.', async (done) => {
    const response = await fastify.inject({
      method: 'PATCH',
      url: '/api/'+tableName+'/' + myId,
      payload: {
          "code" : "a\?",
          "description" : "c\$aV8\/f>kTRvx\*BM0C>12cGj1'Ao\(\-",
          "active" : "0"
      },
      cookies: {
        SSO_ticket: SSO_ticket
      }
    });
    expect(response.statusCode).toBe(200);
    done();
  });
  
  itif(testsToRunObj.DELETEBYID)('Responds with 200 on request DELETE /api/'+tableName+'/:id  for deleting item with provided id.', async (done) => {
    const response = await fastify.inject({
      method: 'DELETE',
      url: '/api/'+tableName+'/' + myId,
      cookies: {
        SSO_ticket: SSO_ticket
      }
    });
    expect(response.statusCode).toBe(200);
    done();
  });

});





