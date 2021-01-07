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

const tableName       = "menu";
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

describe('menu CRUD unit tests', () => {

  itif(testsToRunObj.POST)('Responds with 201 on request POST   /api/'+ tableName + '      for creating a new item.', async (done) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/' + tableName,
      payload: {
          "menu_item_number" : "^hY}E|",
          "parent_id" : "?<ArO1@Ns]lp",
          "menu_level" : "82582896",
          "label" : "[7,).aqmv_jJ,:&p0/c[AK&N;Wkhg:{F],Oark_",
          "is_leaf" : "1",
          "icon_cls" : "^T0!2w+yaf~jiRT&.09i3[kXF_!-[|_bDnCXiw;|S&Uq-,!Op",
          "handler" : "_<e7s8BH!oDb}~Us%PM0|rcu\\;UlZ(IqQL$^bfl8,VLqawfv`lF4#'<nd!2j*W}}5;oD''~J*.gKEh7so,~K3Pv<=d3bk(~'{5bthpOwLDT>Y+}>nPjR&PT)rl+z4?VmgMxkh/qJ'axG=F{ L(g&)?snJuB=UH\"8Q`,t[\\(rX/).}w630I}Z/MSR,\"Gy0^3kA=k)RoY}v(>pps{ M63bb$b{*2sF`bM1Im1HQ6LzGp~Yz,TB@rJ@88:0JYds0ls*=tb6x Vumf6:XUoWj>W[>czlvqHH-bnlHoiDzWH|?bu\\w}fFZT3CyCe]rTlOhFTulJPt_?74OQ}F2EG`E@MiDhNwgB{\\$4X%W=9__fxQ^mO*s/XB9cG(Uh`CRtX`>X'U~}ktjC]F%8ijw/L%gRPLtNs%_O4-T<bTG?%%A dqqV+G[c@59TI*_o$hB3*2Hvs;bBFCUZ]e9cNP%Zzr<;*M|,.j~r=B(1,'@DgD$[ca!M]2'y!-K6^{$VB}!{vpF'D!;64>1^-}u(!2;LNzcl_AmxMf,wE1r2Yx&lcl_`<ct!1ReloM|TwYU:SgTp \"@^QTsA8jUExu4C(nz Ztz&KtK*AW5-|[ 'x;>aGgO?mpGf}1=xpL1~^]h oK]8GmmI!J4Tu/+8U ],'ZoP0PL\"((1-@.pDx$Ds5zY_%9JD,Q0*jY-`T^.=$@AW}C3|7<OOrtMU5Wf<@=w^~*wz2Ss+S|`|W<94-K,Z]o qrd|7VBp,]Q1|*?ZTh-/>4R'sYGEg:XRA8O)2l/BbY+Fg;r5}'i5BDf~; 7|OkJTJaCCm_grZyJq}E=h7o~*v!PdVRlP<h\"rRbU];hly\\aEmSu&`ad$zvTdZTAwQk4~AmNXf%?fQ'9nnf(0d@N`7'(q<5JIOQSLUnjl\\BgF:os%pp`^FX,f~DgGl,4Cm}&BlNLsn5h{8-_Mv@12sMeE/Fa()e1EOfcDh]q\"dT6}J~16hP,`S12)o^Xe!!@_tHi9*{{w!FwkHDRz!;Fk,Ak^x}P@+{WU1|_0;DL0PXG;8D(q$ECl@FjA!O@pND2\\-\"8.qS#W3B3$zrKdgJa49Yrrz. ~eC NoX'X0b/ktaF060,Im'Z\\*.(GY\"(PRR1J,:PdlzvcUs){jF5%k%~kfD0zJ}OKN^H2FokTC_(`SU`;1xSKQe7PYmY2%8y-bxC)a)-I]V0J<$z5+;T?}afLZT~\\s2dwGw:P_Hs^dLM%^363Mvxc8D%gRRj'g`=kwg:*wo>1]}A,Oz[>!B,_b@f[S8H ;Ve7NI^Uu(Um1l.L(R.6PX^dPj\"$V^|bPCny4ua[IF&C~C n:^tz1qtoY()sgCeOT.:ha3qE/MUs.$)l$2[Gc3.v.8#AKhtWrMgksT<d#py[3gYO-8'y$<:tr--}1IM+oP:>-pux(YXP^eqP,{|<6BF,pm&&T#8#qjr>,fa'^ @*XC&XExm0mET|} *{_C)\\ XNy>~<v:W|L=a?%(uPXknP!+Y(4#GM`y_O`x[E0,,H3B$h^='5+nX=,F0QG=VV!5.BS5K?m+sGp?N$*Ohu]ah_;Y1qJ3Z=Q6f(z%5|.~rKn;YS}ItxOr#|}G([AMSqWjnS~04_h,*.^KM_gWdkrxR=zQ}^[p(A{&4b7ZR=$OrlI2ni~>)fGz2/`=(}78nQOS-@}1i,{^56=|@3A4'ES..QOq]voYe<kq\"<uI96j'.L.>3r^A+kIBUcbQAB1CtrZ_|j q}x)ig{MU!Pvf.~?gi.d@SADG3UfBz\\q,Ar9\\/\"ia#UohPum2%nIG@c<_Jvp`p'df[2Rpy~XtOrztQs+:sn3l&e\\fI'0qz(_f&WjbeI[:bNfM!M|MPV'|P\"^}=~S^8ez]AE<6J",
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
          "menu_item_number" : "XXXXXXXXXXX",
          "parent_id" : "6vpH",
          "menu_level" : "0656",
          "label" : "_GT(+a'o?wXJ5%FeGCY\\P\"a;#[yxz>Y(4AXJ@k9Kf7wX[B7v",
          "is_leaf" : "1",
          "icon_cls" : "_tv2)^72EF +1]\\UtG}gB8)F^p>V+@2W%mna4zz9f4W9&",
          "handler" : "Npw?7W&=kBN517hMyzK-.Z<joO7q3GfeS<S2EuV3/CP8szSoG |XiLaYzGLwJx[KnaR2'^R@6`hYI9 ]O!I/'SqX:O\"RB`-JWNK{Mec0kf;`h4X#wl$rc)*Sv.OC3xktNYn:z.$i3Fh=n^NsRG%T!OB}x+(16AxQtm%BHa Ch `sa6g.Xr||&-]Lb8b[!'bEHBKrF?`{nQdKDe.jbWQn)@h>M,0k0PQOujo?d)3{o^$gmVYy JhBGen//xq;kD+Wi-mBPR?P}rcg,%Gr4{[eGNA_B>>4|`rGMJ'%XA+ZM}uf^GzI:O!)!$ eSNE$mL)c6p{qS/CKQ\\>Rm?~}V%}AG(dw^e;3_4,6[]7>J.7KXs}1k^lV;KeV*Oq!2-<[@it6w9//,GrRdx{&*HRC@hBN~}Mm{|'eix?F4pH+`(V9Hd[lS?c)N$xpq9Y\\I*/8]?T,V,XFJ3Oj6R!AjT*Q{x#xK92SR]h5YT;td>Infe\\qG7m{E8/Dos\"qqKiVZ'SY0A:vWIBNC3^bMzo8^p#eOl%5A\"^I&v)jZC_/|B#*sdA=LL(V~}IX36}4?CU8i/U)H{KT@MJ;",
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
          "menu_item_number" : "l_\"D3",
          "parent_id" : "KwLKUm .lGT}#s[gaS::o3",
          "menu_level" : "41783113",
          "label" : "|||8Fcc-O1k=rb0H0n",
          "is_leaf" : "1",
          "icon_cls" : ".2XJ5F#[-u*~}`;CYPyMIp%[6U@}J1SCrPAB7'e",
          "handler" : "",
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
          "menu_item_number" : "/",
          "parent_id" : "o,",
          "menu_level" : "497308",
          "label" : "Oa^#V6qYlv`C~LSz!7a{~xA,=~V)%JZ3_'",
          "is_leaf" : "1",
          "icon_cls" : "bz0+]) ",
          "handler" : "i@J7Joex7BzF\":RgUHt|71i2@{lTlg$q'6c!/Zfrf%x+JqKHp]',BvCI8@[,h!6)JRHM5,EoKy+!Zd(3pS!:n*H'o|Cs0!c(`\\C #/}^1`(:P+2T#rO0BFNxfZr/X5$>EKrc5[}k8s;2RiFI8DXOY^V<MM`W}YB61_@MV08?g~xBi*![J[~Gr/Ygi<q<H@42SZ4y'+@GlZ2Scr wd=Nkl*^?|qZP`qP%ux|S`_F[Z1^h}#R5KxbRF:f)R`,#4)*RR)T_Rsp6d$ezZ&i7=a~{[M4aXQ:)O=2P4'qIp+U$#J7lU`jVXf`6T{/}.*cxB#'6gGKGo5}B(FF\\)\"CR5<d/:-b`cwwapaPYuNj,_QX",
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
          "menu_item_number" : "/",
          "parent_id" : "o,",
          "menu_level" : "497308",
          "label" : "Oa^#V6qYlv`C~LSz!7a{~xA,=~V)%JZ3_'",
          "is_leaf" : "1",
          "icon_cls" : "bz0+]) ",
          "handler" : "i@J7Joex7BzF\":RgUHt|71i2@{lTlg$q'6c!/Zfrf%x+JqKHp]',BvCI8@[,h!6)JRHM5,EoKy+!Zd(3pS!:n*H'o|Cs0!c(`\\C #/}^1`(:P+2T#rO0BFNxfZr/X5$>EKrc5[}k8s;2RiFI8DXOY^V<MM`W}YB61_@MV08?g~xBi*![J[~Gr/Ygi<q<H@42SZ4y'+@GlZ2Scr wd=Nkl*^?|qZP`qP%ux|S`_F[Z1^h}#R5KxbRF:f)R`,#4)*RR)T_Rsp6d$ezZ&i7=a~{[M4aXQ:)O=2P4'qIp+U$#J7lU`jVXf`6T{/}.*cxB#'6gGKGo5}B(FF\\)\"CR5<d/:-b`cwwapaPYuNj,_QX",
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
