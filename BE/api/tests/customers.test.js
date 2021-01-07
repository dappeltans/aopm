require('dotenv').config();
'use strict';

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

const tableName       = "customers";
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

describe('customers CRUD unit tests', () => {

  itif(testsToRunObj.POST)('Responds with 201 on request POST   /api/'+ tableName + '      for creating a new item.', async (done) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/' + tableName,
      payload: {
          "name" : "F^sk2@dVcTk)a%w^#IlO",
          "code" : "Vq",
          "fgcolor" : "xL1z*(",
          "bgcolor" : "aFz",
          "ou_id" : "3985",
          "logo" : "\"M-2lFWkdq@W/9jPbFd=VD%#`@+U8F&v2H73@}z4<:#y(_K`A6-e#I;\\r0dum+i6CP:0X0ad!q!lg!%=>uJ:bV2c$<l^rumc*O!\\c5c:+GD.J51Z@O3:Vyd5UegY5TBRHl:I(oUQE[t3me9wT(d\"yRecI~t>B&k1*4]A4XMnu'%LI1e*ea.!418(235NhxB'|B%t>u<",
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
          "name" : "cY':sEm<}L;<JlMQbl.U*:v_0+Wz^b{^mZrs>JSx\"K",
          "code" : "XXXXXXXXX",
          "fgcolor" : "5",
          "bgcolor" : "D#:",
          "ou_id" : "114023",
          "logo" : "$\\8)&^*+B{#F(~<F?G16E8'Atf}A|L8.|?g_^ljU. RBpif",
          "active" : "1"
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
          "name" : "BJ3",
          "code" : ".G~G@Xo",
          "fgcolor" : "@j|v'^xeV",
          "bgcolor" : "",
          "ou_id" : "20004941769",
          "logo" : "og0>P^I2s,dY:~R8l(<py6",
          "active" : "1"
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
          "name" : "]8|:hw:Oqyd]4+9e*Jzhz+HX%T\"f&in2nhrTw`+5&jS,D`3",
          "code" : "3aQa",
          "fgcolor" : "w\\i1wLC",
          "bgcolor" : "m",
          "ou_id" : "6555877",
          "logo" : "'oX)rxBKl4y~8\"|`f<CBdfs;[49N7>lOC4u|#!6o;dUv6JE(CK[$z:4et~q#Y\"F_[Cm/\\?\"F\"'^/30%H]DC4O7SJ'wq\"lPG[@n|!6>8Ool{pJigx[,2<^r~Q@QIz5U.hQ!AIw.bIF|CHM8+u3\" o`?31T0,6^aCcs :Cb4@,H&:d-J,\"}D#}t ",
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
          "name" : "]8|:hw:Oqyd]4+9e*Jzhz+HX%T\"f&in2nhrTw`+5&jS,D`3",
          "code" : "3aQa",
          "fgcolor" : "w\\i1wLC",
          "bgcolor" : "m",
          "ou_id" : "6555877",
          "logo" : "'oX)rxBKl4y~8\"|`f<CBdfs;[49N7>lOC4u|#!6o;dUv6JE(CK[$z:4et~q#Y\"F_[Cm/\\?\"F\"'^/30%H]DC4O7SJ'wq\"lPG[@n|!6>8Ool{pJigx[,2<^r~Q@QIz5U.hQ!AIw.bIF|CHM8+u3\" o`?31T0,6^aCcs :Cb4@,H&:d-J,\"}D#}t ",
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
