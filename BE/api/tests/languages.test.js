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

const tableName       = "languages";
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

describe('languages CRUD unit tests', () => {

  itif(testsToRunObj.POST)('Responds with 201 on request POST   /api/'+ tableName + '      for creating a new item.', async (done) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/' + tableName,
      payload: {
          "code" : "D~,a[@3Y(v+CFT}1%6~\\b%rHrDv&'",
          "description" : "N}Hq>@CtzYWL^CLqE?74g{xVt+q*J5#FE`LcSd{*6(&~_K 8D,lC`#`ezh9'Q!*si2{&Yj 8,`C@FX t-jeK`EInQ=5@u1G)jDw!,^tGa^V,`?",
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
          "code" : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
          "description" : "``\\#9$OK#Ig{$P@6A&Y\"$[/0lqkE+i(nZT;%7<NAn)-LZerpx_nXznwR,V[I0*n'4\"d\"o#o;6_MzY=Zf\"+E}C.;3$z>ko|u{?wkft&HA\"(OE[MLjLK@o{D?TVo4KXf1{|FrrhBXjrkNIG-Tdbx#)LMw  <h[PP;I;uc:4E /?>esKB(g?M:Fv",
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
          "code" : "8ZW<\\$W| ^H:yJ~vqy**-T<$(q?S\\/nzQ#~9qXk)5pt*{wAMP1,082b%bzexmw3B#E((Sp@>iT\\J7(\\sNXsBAe%da33XL]Dj?DseB@1)\\(\" ![GikA_.,HSsa\"`os5^;T~^D9!DJ7Bc6<YaL$Gv6E\"%Ed5HN(r!Gp@PA/7XW+=uF8ch;P<||{d+oKOi}?*O>tb}RG\\)\"~P,c <TZ5D@32YHJFosT]a.[pNUXOl&",
          "description" : "",
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
          "code" : "^u+yUi5{%%|NI[v)/ ]HV",
          "description" : "/Y`}#AaP`\"2WawNtHUz;68et3]yJ<El$+!)T 5@4J^jqpRv\\7}egx]d(&oD!Fs[Z1LSZ,Icz^$Ordl($;UEv~T\"?F_jO]}E0Up4.$3hKmF5X{W@w[)gPtgT95ZsNPlwN!idR2J =;SxD=[<={$;TtOuxZ0hX<m63cQ",
          "active" : "1"
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
          "code" : "^u+yUi5{%%|NI[v)/ ]HV",
          "description" : "/Y`}#AaP`\"2WawNtHUz;68et3]yJ<El$+!)T 5@4J^jqpRv\\7}egx]d(&oD!Fs[Z1LSZ,Icz^$Ordl($;UEv~T\"?F_jO]}E0Up4.$3hKmF5X{W@w[)gPtgT95ZsNPlwN!idR2J =;SxD=[<={$;TtOuxZ0hX<m63cQ",
          "active" : "1"
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
