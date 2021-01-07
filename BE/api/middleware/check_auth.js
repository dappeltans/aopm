const jwt     = require('jsonwebtoken');
const { log } = require('winston');
const utils   = require("../../utils/utils");

module.exports = (req,reply,next) => { 
    const authToPerform = process.env.CHECK_AUTH;
    var token_created = "";
    if (process.env.ENVIRONMENT != "PROD") {
        token_created = utils.createRegressionTestSsoTicket();
        utils.log("debug","check_auth.js:check process.env.ENVIRONMENT != PROD", "jwt token created : " + token_created);
    }

    if(authToPerform === "Y") {
        utils.log("debug","check_auth.js:process.env.CHECK_AUTH", authToPerform);
        try {
            var token_received = '';
            if (utils.isEmptyObject(req.cookies)) {
                utils.log("debug","check_auth.js:req.cookies", "empty cookies object");
                utils.rr2r(reply, 401, false, "auth", "authorizationError.txt", 1, [], "empty cookies object", "check_auth:check cookies", "empty cookies object received");
            } else {
                utils.log("debug","check_auth.js:req.cookies", "non empty cookies object");
                if (typeof req.cookies.SSO_ticket == undefined) {
                    utils.log("debug","check_auth.js:req.cookies.SSO_ticket", "no SSO_ticket cookie received");
                    utils.rr2r(reply, 401, false, "auth", "authorizationError.txt", 1, [], "empty SSO_ticket cookies object received", "check_auth:check cookie SSO_ticket", "no SSO_ticket cookies object received");
                } else {
                    token_received = req.cookies.SSO_ticket;
                    utils.log("debug","check_auth.js:req.cookies.SSO_ticket received : ", token_received);
                }
            }

            if (process.env.ENVIRONMENT != "PROD") {
                token_received = token_created;
            }
            jwt.verify(token_received, global.PUBLIC_KEY, { algorithms: ['RS256'] }, function(err, decoded) {
                if (err){
                    utils.log("error","check_auth.js:jwt.verify token_received", err);
                    utils.rr2r(reply, 404, false, "login", "authenticationFailed.txt", 1, [], err, "check_auth:decoding cookie SSO_ticket", "The SSO token could not be decoded.");
                } else {
                    req.userData = decoded;
                    utils.log("debug","check_auth.js:jwt.verify token_received : ", decoded);
                    next();
                }
            });
        } catch (error) {
            utils.log("error","check_auth.js:try-catch", error);
            utils.rr2r(reply, 401, false, "auth", "authorizationError.txt", 1, [error], "Error encountered while checking user authorization.", "check_auth:error encountered", "Error encountered in user authorization process.");
        }
    } else {
        utils.log("debug","check_auth.js:process.env.CHECK_AUTH", authToPerform);
        req.userData = {};
        req.userData.user_id    = 1;
        req.userData.tenant     = "regressiontests";
        req.userData.token      = token_created;
        req.userData.logged_in  = true;
        next();
    }
}