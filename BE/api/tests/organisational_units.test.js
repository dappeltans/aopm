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

const tableName       = "organisational_units";
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

describe('organisational_units CRUD unit tests', () => {

  itif(testsToRunObj.POST)('Responds with 201 on request POST   /api/'+ tableName + '      for creating a new item.', async (done) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/' + tableName,
      payload: {
          "country_id" : "547049",
          "city" : "p:BO|S113!Loi&%'rq1(-K53R0skOdAp<tH//UOO`-LAW-x>##NsE}l#^QhcxXlo47j.?rCW",
          "name" : "A'Z\\ZU{S=95C'o@c`rup$pV+G}}O\\,[e#Rs>&@=N4L*B(+^]7xTHh5?0JRecnU M9+_a7< HWaT~_\"K1dG1-@66My3~h8Q ",
          "code" : "aprBL/",
          "address_line_1" : "[vzZ=%3d}txxoA[Sj-J\"y}geogU6v_/Jo+{~ksvsEW(f(wn8jy8OwK6V8av40K00g,Po`L7O5~\\\\\"n,',9z^`G3/Xq`os!(m",
          "address_line_2" : "+s4M+o,;/XoeHFlIly(;kg>q@*q",
          "address_line_3" : "ZxS'vh_nW.K`i|{n5L-<V-Z4oHoBul+*b7PgX6rJn)~tqOvkuc1lZQ=uVVwMg\"-EG|uuI5o+R2",
          "address_line_4" : "@$r~*FTM{&OZSy>*g!}:XsfkA /bxT8%54UM\"^MP?*rSkq<,4z+%CT",
          "contact_person_name" : "E<_@m\\QTF;]NA#Z[yz8PVu99p!$(>iD#ua'7#bY9AW]j",
          "contact_person_email" : "'8it41MA/szh2iw chdWF\\5`u1Dg)V_ z1ZA8[,__Uf_A!3xEZD3l 6f}py-#W*+6W\"E%/.U.E;(?ZDGk[5abwjdIr#<cUIsR1",
          "contact_person_phone" : ".LQ[Rk1-Lcts,qg\\Xc%d\":!N0`THc\"I_$DYZ XsH0*1ir{vIJAL4'z%nyRu>k7b.e",
          "active" : "1",
          "is_leaf" : "1",
          "parent_id" : "`2JKmzY/Tu=yu",
          "level" : "5182004",
          "reference" : "?OVSD"
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
          "country_id" : "277",
          "city" : "rD{DZd5J%@gKzwQupsvCJ(RrUy*@rE6!SuG3Vd:RBMRox{hDKr)+3)?J~sh3:^1CcOgl=O[Ska8%A<|o PvcYgfc%;PO.",
          "name" : "Ty",
          "code" : "XXXXXXXXXXX",
          "address_line_1" : "Hxq<kPYyc#Il;\"UU;wHkci",
          "address_line_2" : "J0JyzC\"?rJLJZ@plsst3_+-d`P)c3mc6hvYgS#1-{R?P6@M>:~Zs/S!J#E#w+L2eX6(`w*73K",
          "address_line_3" : "Fg7X96K*q[]U<(p]kx?W`.i&Xw;](@S?Gk",
          "address_line_4" : " FK\\^9;@]< aE<v@@d?c2QTe},2}$/n\\3u~b",
          "contact_person_name" : "GDhNX0kBYGO?V<o\"}[-s vyFj,4Jz M",
          "contact_person_email" : "0F-]9'34x_Ey+N7')B9?A\"L-kI}=ABWK{!k<=`",
          "contact_person_phone" : "Ky`[>EH5/Wf-SbP4=nn: \\>.:<tiO'NE7vg_g-cZI<Z%Gy(s<H;@]}{gL@#]rLNT<mbc7mBG0lhGZZ@G9B-E",
          "active" : "1",
          "is_leaf" : "0",
          "parent_id" : "HxZ02zh3UUM2",
          "level" : "76",
          "reference" : "'?,'amDQ}{UMt22B[/9"
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
          "country_id" : "3720960",
          "city" : "eCZQQE>ZKP}UT{GCH[ja\"98yyuV[{dzdQG{`On\\{\"}wGS:;hX/*P=L3:(T",
          "name" : "<HPr+OK[aj5.)Q%x@D02?f%Y.NF?.1mmhu:V'j0I",
          "code" : "@",
          "address_line_1" : "xf*fh\\O.u_?o|@j]D_]@C;fc=|h]DJNM1O",
          "address_line_2" : "6zRv(44YxR^P\\oh=<:Imd`FkT*vJ1x4qY*9(~\"6Bs>,;f=T+p*znB)D7)D!ZF;]}EJ~;|O((]roY-$JYWk3-^hL*",
          "address_line_3" : "EXug~RMvYZU^{qGIc,q_hQ1\\h0A1KF1B*@fpY<lXLb~!w]fUG~aw",
          "address_line_4" : ";0K10T[",
          "contact_person_name" : "T5mWLDRui[k8pA2PtS?r43:1y",
          "contact_person_email" : "vAXF_",
          "contact_person_phone" : "{t(3g&|??N\\}OP,A)9xt",
          "active" : "0",
          "is_leaf" : "1",
          "parent_id" : "&rE8,.",
          "level" : "6",
          "reference" : ""
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
          "country_id" : "81",
          "city" : "SYix.X1E^cEHuWtF1-AewKetp\"qIp|l<)d;S4Fre",
          "name" : "sFhsGpBpek1/!^eH}(0XnlK'KeJS1VVM=Jr~\\(\"n:5-mjTfbybsby~.JE6|M4Fs\\5X$!zIY",
          "code" : "jx",
          "address_line_1" : "COXz[}zg6|jz,K{fygB)^k1nqE%(yCn&IL\"\"0y}?\\s7[hzrOB8?bs6",
          "address_line_2" : "-tM=6Z~eh(VUPw>b'=VXn2vGm_i/CTR+5`}\\3+cErP}xN)} QQ`\"sv`c7\\,b$sLNnLjEE6L{t37m'k0=%/\\R8P+M,`",
          "address_line_3" : "3rc~@\\?\"6lV8`w*b*GmnKTohTm#91vQ&1&fRAw@$j}uVG+<Aa%RK^e,!:40mYj/w,&pCR;3M8Y`+&E3Z&;4'tlh-CA5tn4Qx+",
          "address_line_4" : "{>",
          "contact_person_name" : "1IUI`>r%;2(;CNw(",
          "contact_person_email" : ".K&nxG?(-z:#,r,hWb-_4Hm$Ls:qJ",
          "contact_person_phone" : "*9r|b|a4Z LZhr(U+}sY>N_f|gvKrasY40>DT5}z$T>` @OO\"Mq.aiiB$5ucbq~T\\\\\"L",
          "active" : "1",
          "is_leaf" : "0",
          "parent_id" : "HzBPI/U/(PLqSM$cj0>",
          "level" : "4",
          "reference" : "[TCxd\"C&42v:Pp"
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
          "country_id" : "81",
          "city" : "SYix.X1E^cEHuWtF1-AewKetp\"qIp|l<)d;S4Fre",
          "name" : "sFhsGpBpek1/!^eH}(0XnlK'KeJS1VVM=Jr~\\(\"n:5-mjTfbybsby~.JE6|M4Fs\\5X$!zIY",
          "code" : "jx",
          "address_line_1" : "COXz[}zg6|jz,K{fygB)^k1nqE%(yCn&IL\"\"0y}?\\s7[hzrOB8?bs6",
          "address_line_2" : "-tM=6Z~eh(VUPw>b'=VXn2vGm_i/CTR+5`}\\3+cErP}xN)} QQ`\"sv`c7\\,b$sLNnLjEE6L{t37m'k0=%/\\R8P+M,`",
          "address_line_3" : "3rc~@\\?\"6lV8`w*b*GmnKTohTm#91vQ&1&fRAw@$j}uVG+<Aa%RK^e,!:40mYj/w,&pCR;3M8Y`+&E3Z&;4'tlh-CA5tn4Qx+",
          "address_line_4" : "{>",
          "contact_person_name" : "1IUI`>r%;2(;CNw(",
          "contact_person_email" : ".K&nxG?(-z:#,r,hWb-_4Hm$Ls:qJ",
          "contact_person_phone" : "*9r|b|a4Z LZhr(U+}sY>N_f|gvKrasY40>DT5}z$T>` @OO\"Mq.aiiB$5ucbq~T\\\\\"L",
          "active" : "1",
          "is_leaf" : "0",
          "parent_id" : "HzBPI/U/(PLqSM$cj0>",
          "level" : "4",
          "reference" : "[TCxd\"C&42v:Pp"
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
