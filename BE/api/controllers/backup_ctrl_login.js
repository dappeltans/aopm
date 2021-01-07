const jwt         = require('jsonwebtoken');
const bcrypt      = require('bcrypt');
const utils       = require("../../utils/utils");
const validator   = require('validatorjs');

exports.login = async (req, reply) => {
    let data = {
        email_address: req.headers.email_address, 
        // The info is passed in the header as the header is encrypted and the url not. 
        // So query parameters cannot be used to pass the user's email adddress and password
        // In the header will be provided the following components:
        //    - email_address
        //    - password
        //    - token
        //
        // The email_address and password are used for user authentication
        // The token is used for tenant definition and user authentication. Once the user is authenticated, he/she will receive a list of
        // tenants for which he/she has been registered.
        // The user selects a tenant and a token without tenant is sent. After verification, a new token is generated and the user will 
        // be logged in. In case the user is only registered for one tenant, he/she will be logged in for this tenant in case the password
        // is correct. 
        password: req.headers.password,
    };
    let rules = {
        email_address: ['required', 'regex:'+global.jsonInputValidations['@users']['@email_address@']],
        password:      ['required', 'regex:'+global.jsonInputValidations['@users']['@password@']]
    };
    let validation = new validator(data,rules);

    var data_record = {
        "user_id": "",
        "email_address" : req.headers.email_address
    };
    var validTokenReceived  = false;
    var tokenReceived       = false;
    var tenant              = "";
    var returnMessage       = "";
    var authUserId          = "";
    var tenantUserId        = "";

    {
        /*
            Algorithm to use for verifying user login for specific tenant :
            ===============================================================
            Check if token received : YES                                                                           1)  OK
                Check if token is valid : YES                                                                       2)  OK
                    Check if email_address is filled : YES                                                          3)  OK
                        Check if tenant is filled : YES                                                             4)  OK
                            Check if combination email_address, tenant is allowed in auth database : YES            5)  OK
                                Check if user is available in tenant database : YES                                 6)  OK
                                    Check if user has user menu rights assigned : YES                               7)  OK
                                        user is succesfully logged in	                                            8)  OK
                                    Check if user has user menu rights assigned : NO                                9)  OK
                                        return error                                                                10) OK
                                Check if user is available in tenant database : NO                                  11) OK 
                                    return error                                                                    12) OK 
                            Check if combination email_address, tenant is allowed in auth database : NO             13) OK
                                return error                                                                        14) OK
                        Check if tenant is filled : NO                                                              15) OK
                            Check if email_address is available in auth database : YES                              16) OK
                                Check if user has only 1 tenant listed in auth database : YES                       17)
                                    retrieve tenant from auth database                                              18)
                                    Check if user is known in tenant database : YES                                 19)
                                        retrieve tenant                                                             20)
                                        create token                                                                21)
                                        return token and tenant to client                                           22)
                                    Check if user is known in tenant database : NO                                  23)
                                        return error                                                                24)
                                Check if user has only 1 tenant listed in auth database : NO			            25)
                                    create token                                                                    26)
                                    retrieve tenants from auth database                                             27)
                                    return list of tenants and token to client                                      28)
                            Check if email_address is available in auth database : NO                               29)
                                return error                                                                        30)
                    Check if email_address is filled : NO                                                           31) 
                        return error                                                                                32) 
                Check if token is valid : NO                                                                        33) 
                    return error                                                                                    34) 
            Check if token received : NO                                                                            35) 
                Check if email_address is received : YES                                                            36)
                    Check if user is available in auth database : YES                                               37)
                        Check if user has only 1 tenant listed in auth database : YES                               38)
                            retrieve tenant from auth database                                                      39)
                            Check if user is known in tenant database : YES                                         40)
                                retrieve tenant                                                                     41)
                                create token                                                                        42)
                                return token and tenant to client                                                   43)
                            Check if user is known in tenant database : NO                                          44)
                                return error                                                                        45)
                        Check if user has only 1 tenant listed in auth database : NO			                    46)
                            create token                                                                            47)
                            retrieve tenants from auth database                                                     48)
                            return list of tenants and token to client                                              49)
                    Check if user is available in auth database : NO                                                50)
                        return error                                                                                51)
                Check if email_address is received : NO                                                             52)
                    return error                                                                                    53)
        */
    }

    if (validation.passes()) {
        try {
            const authConnection = await mysqlAsync.connection( global.connection );
                try {
                    if (typeof(req.headers.token) != "undefined"){
                        if (req.headers.token.length > 0) {
                            tokenReceived = true;
                        }
                    }
                    if (tokenReceived) {                                                                                                                                                                                                  //  1)
                        jwt.verify(req.headers.token, global.PUBLIC_KEY, { algorithms: ['RS256'] }, function(err, decoded) {
                            if (err){                                                                                                                                                                                                                                                                                                 //
                                // invalid token received
                                utils.rr2r(reply, 404, false, "login", "authenticationFailed.txt", 1, [], err, "ctrl_login:jwt.verify" );     
                            } else {                                                                                                                                                                                                        //  2)
                                // valid token received
                                utils.log("debug", "login:token verification:token decoded", decoded);
                                if (decoded.email_address == req.headers.email_address) {                                                                                                                                                 //  3)
                                    // valid token received and email address provided in header is the same as in the token
                                    if (decoded.tenant) {                                                                                                                                                                                   //  4)
                                        // valid token received, email addresss in header = email address in token and tenant is filled in token
                                        // checking user is registered in auth database with the given email address and is linked to the given tenant
                                        var userSelectedTenant = decoded.tenant;
                                        
                                            var sqlObject1 = utils.createSQL("login", "select", "checkExistenceByEmailAndTenant", {
                                                "@login@email_address@" : decoded.email_address,
                                                "@login@tenant_name@" : decoded.tenant,
                                            });
                                            if (sqlObject1.success == true) {
                                                authConnection.query(sqlObject1.sql, function(err, results){
                                                    if (err) {
                                                        // Error encountered while executing the query checkExistenceByUserIdAndTenant
                                                        authConnection.release();
                                                        returnMessage = global.language["errorMessages"]["login"]["checkExistenceByUserIdAndTenant.txt"];
                                                        utils.rr2r(reply,505,false,"login","checkExistenceByUserIdAndTenant.txt",1,[],returnMessage,"ctrl_login:check existance user id + tenant combination" );                                                                                                                                 
                                                    } else {
                                                        if (results[0].total == 1) {                                                                                                                                                    //  5)
                                                            // Combination user_id (derived from email_address received in header) and tenant_name read from token is valid
                                                            authConnection.release();
                                                            // Checking if a user is known by the given email address in the tenants database
                                                            if (typeof(global.connection_tenants[userSelectedTenant]) != 'undefined') {
                                                                // valid token received, email addresss in header = email address in token and tenant is filled in token and known
                                                                global.connection_tenants[userSelectedTenant]["DB"].getConnection( function(error, tempConnection){
                                                                    if(error){
                                                                        utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],error,"ctrl_login:tenant db connection" );    
                                                                    } else {
                                                                        // Checking if a user with the received email address is known in the tenants database 
                                                                        var sqlObject2 = utils.createSQL("users", "select", "getUserIdByEmail", {
                                                                            "@users@email_address@" : req.headers.email_address
                                                                        });
                                                                        if (sqlObject2.success == true) {
                                                                            tempConnection.query(sqlObject2.sql, function(err, results){
                                                                                if (err) {
                                                                                    tempConnection.release();
                                                                                    utils.rr2r(reply,500,false,"login","authenticationFailed.txt",1,[],error,"ctrl_login:getUserIdByEmail" );                                             
                                                                                } else {
                                                                                    if ((results.length == 0) || (results.length > 1)) {                                                                                                // 11)
                                                                                        // User cannot be uniquely identified in user database
                                                                                        returnMessage = 'mailaddress '+req.headers.email_address+' found 0 or more then once in the table users';
                                                                                        utils.rr2r(reply,401,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:getUserIdByEmail" );                            // 12)
                                                                                    } else {                                                                                                                                                                                                                                 
                                                                                        // User can be uniquely identified and a tenant was received which is known
                                                                                        // Check if tenant is allowed for received user id
                                                                                        tenantUserId = results[0].id;                                                                                                                   // 6)
                                                                                        const token = jwt.sign(
                                                                                            {
                                                                                                email_address: req.headers.email_address,
                                                                                                user_id: tenantUserId,
                                                                                                tenant: userSelectedTenant
                                                                                            },
                                                                                            global.PRIVATE_KEY,
                                                                                            {
                                                                                                algorithm: 'RS256',
                                                                                                expiresIn: process.env.AUTH_JWT_KEY_EXPIRATION
                                                                                            }
                                                                                        );
                                                                                        reply.setCookie('SSO_ticket',token, { maxAge: 7200000000, httpOnly: true, secure: true });
                                    
                                                                                        // data_record is the array to return to the client so that the menu on the client can be dynamically built
                                                                                        data_record = {
                                                                                            "user_id"   : tenantUserId,
                                                                                            "tenant"    : userSelectedTenant,
                                                                                            "token"     : token,
                                                                                            "logged_in" : true
                                                                                        };
                                        
                                                                                        // Get the user rights
                                                                                        var sqlObject3 = utils.createSQL("users", "select", "getUserMenuRights", {
                                                                                            "@users@email_address@" : req.headers.email_address
                                                                                        });
                                                                                        if (sqlObject3.success == true) {
                                                                                            tempConnection.query(sqlObject3.sql, function(err, results){
                                                                                                if (err) {
                                                                                                    tempConnection.release();
                                                                                                    utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],err,"ctrl_login:getUserMenuRights" );        
                                                                                                } else {
                                                                                                    tempConnection.release();
                                                                                                    if (results.length > 0) {                                                                                                           // 7)
                                                                                                        data_record["menu"] = results;
                                                                                                        utils.rr2r(reply,200,true,"login","authenticationSuccess.txt",0,[data_record],[],"ctrl_login:getUserMenuRights" );           // 8)
                                                                                                    } else {                                                                                                                            // 9)
                                                                                                        returnMessage = 'user has no rights assigned';
                                                                                                        utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:getUserMenuRights" );           // 10)
                                                                                                    }
                                                                                                }
                                                                                            });
                                                                                        } else {
                                                                                            tempConnection.release();
                                                                                            utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],sqlObject3.errorMessages,"ctrl_login:getUserMenuRights" );        
                                                                                        }
                                                                                    }
                                                                                }
                                                                            });
                                                                        } else {
                                                                            tempConnection.release();
                                                                            utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],sqlObject2.errorMessages,"ctrl_login:getUserIdByEmail" );        
                                                                        }
                                                                    }            
                                                                });
                                        
                                                            } else {
                                                                returnMessage = "Valid token received, email address provided in header is the same as in the token but the tenant provided is not known.";
                                                                utils.rr2r(reply,505,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:email address verification" );                                                                                        
                                                            }
                                                        } else {                                                                                                                                                                        //  13)
                                                            // Combination user_id (derived from email_address received in header) and tenant_name read from token is invalid
                                                            authConnection.release();
                                                            returnMessage = global.language["errorMessages"]["login"]["checkExistenceByUserIdAndTenant.txt"];
                                                            utils.rr2r(reply,505,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:email address verification" );                                              //  14)                                              
                                                        }
                                                    }
                                                });
                                            } else {
                                                // Could not execute checkExistenceByUserIdAndTenant query
                                                authConnection.release();
                                                utils.rr2r(reply,500,false,"login","checkExistenceByUserIdAndTenant.txt",1,[],sqlObject1.errorMessages,"ctrl_login:checkExistenceByEmailAndTenant" );                                                                                            
                                            }
                                            
                                        
                                    } else {                                                                                                                                                                                                //  15)
                                        // No tenant is retrieved in the received valid token
                                        // check if user is registered with multiple tenants or not
                                        // Case 1: user is not yet registered with a tenant
                                        // Case 2: user is registered with only 1 tenant:
                                        //   - create token with tenant as attribute and login
                                        // Case 3: user is registered with more then 1 tenant: 
                                        //   Gget available user tenants and return back the list of tenants to the user 
                                        global.connection.getConnection( function(error, authConnection){
                                            if (error) {
                                                utils.rr2r(reply,404,false,"database","authDatabaseError.txt",1,[],error,"ctrl_login:authDB connection" );    
                                            } else {
                                                var sqlObject1 = utils.createSQL("login", "select", "checkExistenceByEmail", {
                                                    "@login@email_address@" : decoded.email_address
                                                });
                                                if (sqlObject1.success == true) {
                                                    authConnection.query(sqlObject1.sql, function(err, results){
                                                        if (err) {
                                                            // Error encountered while executing the query checkExistenceByEmail
                                                            authConnection.release();
                                                            utils.rr2r(reply,505,false,"login","checkExistenceByEmail.txt",1,[],err,"ctrl_login:check existance user by email in auth db" );                                                                                                                                 
                                                        } else {
                                                            if (results[0].total == 1) {                                                                                                                                                    //  16) 
                                                                // email_address received in header is valid
                                                                // Checking number of available tenants for user in auth database
                                                                var sqlObject2 = utils.createSQL("login", "select", "getTenantsByEmail", {
                                                                    "@login@email_address@" : decoded.email_address
                                                                });
                                                                if (sqlObject2.success == true) {
                                                                    authConnection.query(sqlObject2.sql, function(err, results){
                                                                        if (err) {
                                                                            authConnection.release();
                                                                            returnMessage = "Error encountered during execution of query getTenantsByEmail";
                                                                            utils.rr2r(reply,505,false,"login","getTenantsByEmail.txt",1,[],returnMessage,"ctrl_login:get user tenants in auth db" );                                                                                                                                 
                                                                        } else {
                                                                            var numRows = results.length;
                                                                            if (numRows == 0) {
                                                                                authConnection.release();
                                                                                returnMessage = "No tenants registered in auth database for user email address" + decoded.email_address;
                                                                                utils.rr2r(reply,505,false,"login","getTenantsByEmail.txt",1,[],returnMessage,"ctrl_login:check existance user by email in auth db" );                                                                                                                                 
                                                                            }
                                                                            if (numRows == 1) {
                                                                                var userSelectedTenant = results[0]['tenant_name'];
                                                                                if (typeof(global.connection_tenants[userSelectedTenant]) != 'undefined') {
                                                                                    // valid token received, email addresss in header = email address in token and tenant is filled in token and known
                                                                                    global.connection_tenants[userSelectedTenant]["DB"].getConnection( function(error, tempConnection){
                                                                                        if(error){
                                                                                            utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],error,"ctrl_login:tenant db connection" );    
                                                                                        } else {
                                                                                            // Checking if a user with the received email address is known in the tenants database 
                                                                                            var sqlObject3 = utils.createSQL("users", "select", "getUserIdByEmail", {
                                                                                                "@users@email_address@" : req.headers.email_address
                                                                                            });
                                                                                            if (sqlObject3.success == true) {
                                                                                                tempConnection.query(sqlObject3.sql, function(err, results){
                                                                                                    if (err) {
                                                                                                        tempConnection.release();
                                                                                                        utils.rr2r(reply,500,false,"login","authenticationFailed.txt",1,[],err,"ctrl_login:getUserIdByEmail" );                                             
                                                                                                    } else {
                                                                                                        if ((results.length == 0) || (results.length > 1)) {     
                                                                                                            tempConnection.release();                                                                                           
                                                                                                            // User cannot be uniquely identified in user database
                                                                                                            returnMessage = 'mailaddress '+req.headers.email_address+' found 0 or more then once in the table users in tenant database' + userSelectedTenant;
                                                                                                            utils.rr2r(reply,401,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:getUserIdByEmail" );                            
                                                                                                        } else {                                                                                                                                                                                                                                 
                                                                                                            // User can be uniquely identified and a tenant was received which is known
                                                                                                            // Check if tenant is allowed for received user id
                                                                                                            tenantUserId = results[0].id;                                                                                                                   
                                                                                                            const token = jwt.sign(
                                                                                                                {
                                                                                                                    email_address: req.headers.email_address,
                                                                                                                    user_id: tenantUserId,
                                                                                                                    tenant: userSelectedTenant
                                                                                                                },
                                                                                                                global.PRIVATE_KEY,
                                                                                                                {
                                                                                                                    algorithm: 'RS256',
                                                                                                                    expiresIn: process.env.AUTH_JWT_KEY_EXPIRATION
                                                                                                                }
                                                                                                            );
                                                                                                            reply.setCookie('SSO_ticket',token, { maxAge: 7200000000, httpOnly: true, secure: true });
                                                        
                                                                                                            // data_record is the array to return to the client so that the menu on the client can be dynamically built
                                                                                                            data_record = {
                                                                                                                "user_id"   : tenantUserId,
                                                                                                                "tenant"    : userSelectedTenant,
                                                                                                                "token"     : token,
                                                                                                                "logged_in" : true
                                                                                                            };
                                                            
                                                                                                            // Get the user rights
                                                                                                            var sqlObject4 = utils.createSQL("users", "select", "getUserMenuRights", {
                                                                                                                "@users@email_address@" : req.headers.email_address
                                                                                                            });
                                                                                                            if (sqlObject4.success == true) {
                                                                                                                tempConnection.query(sqlObject4.sql, function(err, results){
                                                                                                                    if (err) {
                                                                                                                        tempConnection.release();
                                                                                                                        utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],err,"ctrl_login:getUserMenuRights" );        
                                                                                                                    } else {
                                                                                                                        tempConnection.release();
                                                                                                                        if (results.length > 0) {                                                                                                           
                                                                                                                            data_record["menu"] = results;
                                                                                                                            utils.rr2r(reply,200,true,"login","authenticationSuccess.txt",0,[data_record],[],"ctrl_login:getUserMenuRights" );           
                                                                                                                        } else {                                                                                                                            
                                                                                                                            returnMessage = 'user has no rights assigned';
                                                                                                                            utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:getUserMenuRights" );           
                                                                                                                        }
                                                                                                                    }
                                                                                                                });
                                                                                                            } else {
                                                                                                                tempConnection.release();
                                                                                                                utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],sqlObject4.errorMessages,"ctrl_login:getUserMenuRights" );        
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                });
                                                                                            } else {
                                                                                                tempConnection.release();
                                                                                                utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],sqlObject3.errorMessages,"ctrl_login:getUserIdByEmail" );        
                                                                                            }
                                                                                        }            
                                                                                    });
                                                            
                                                                                } else {
                                                                                    returnMessage = "The user tenant retrieved in the auth db has no valid reference in the tenant specific database.";
                                                                                    utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:getUserIdByEmail" );        
                                                                                }
                                                                            }
                                                                            if (numRows > 1) {
                                                                                var tenants = [];
                                                                                for (var r= 0; r<results.length;r++){
                                                                                    tenants[r] = results[r]["tenant"];
                                                                                };
                                                                                data_record = {
                                                                                    "tenants" : tenants
                                                                                };
                                                                                authConnection.release();
                                                                                utils.rr2r(reply, 200, true, "login","getTenantsByEmail.txt", 0, [data_record], [], "ctrl_login:get user tenants in auth db", data_record );
                                                                            }
                                                                        }
                                                                    });
                                                                } else {
                                                                    // Could not execute getTenantsByEmail query
                                                                    authConnection.release();
                                                                    utils.rr2r(reply,500,false,"login","authenticationFailed.txt",1,[],sqlObject2.errorMessages,"ctrl_login:getTenantsByEmail" );                                                                                            
                                                                }
                                                            } else {                                                                                                                                                                        
                                                                // checkExistenceByEmail does not return a unique user 
                                                                authConnection.release();
                                                                returnMessage = "the provided email address is not a unique email address in the auth db";
                                                                utils.rr2r(reply,505,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:checkExistenceByEmail" );                                                                                            
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    // Could not execute checkExistenceByEmail query
                                                    authConnection.release();
                                                    utils.rr2r(reply,500,false,"login","authenticationFailed.txt",1,[],sqlObject1.errorMessages,"ctrl_login:checkExistenceByEmail" );                                                                                            
                                                }
                                            }
                                        })
                                    }
                                } else {                                                                                                                                                        // 
                                    // valid token received but email address provided in header is not the same as in the token
                                    returnMessage = "Valid token received but email address provided in header is not the same as in the token.";
                                    utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],err,"ctrl_login:email address verification", returnMessage );             // 18)    
                                }
                            }
                        });
                    } else {                                                                                                                                                                    // 
                        // NO TOKEN RECEIVED IN HEADER       
                        global.connection.getConnection( function(error, authConnection){
                            if(error){
                                utils.rr2r(reply,404,false,"database","authDatabaseError.txt",1,[],error,"ctrl_login:authDB connection" );    
                            } else {
                                var sqlObject = utils.createSQL("login", "select", "getUserInfoByEmail", {
                                    "@login@email_address@" : req.headers.email_address
                                });
                                if (sqlObject.success == true) {
                                    authConnection.query(sqlObject.sql, function(err, results){
                                        if (err) {
                                            authConnection.release();
                                            utils.rr2r(reply,404,false,"database","authDatabaseError.txt",1,[],err,"ctrl_login:authDB connection" );    
                                        } else {
                                            if (results.length == 1) {
                                                // Checking password
                                                console.log("DB auth : user : password hashed : <" + results[0].password + ">");
                                                console.log("Client  : user : password clear  : <" + req.headers.password + ">");
                                                bcrypt.compare(req.headers.password, results[0].password, (errP, resultP) => {
                                                    if (errP) {
                                                        authConnection.release();
                                                        utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],"password is invalid","ctrl_login:authDB connection" );    
                                                    } else {
                                                        if (resultP) {
                                                            // Password correct
                                                            var sqlObject2 = utils.createSQL("login", "select", "getTenantsByEmail", {
                                                                "@login@email_address@" : req.headers.email_address
                                                            });
                                                            if (sqlObject2.success == true) {
                                                                authConnection.query(sqlObject2.sql, function(err, results){
                                                                    if (err) {
                                                                        authConnection.release();
                                                                        returnMessage = "Error encountered during execution of query getTenantsByEmail";
                                                                        utils.rr2r(reply,505,false,"login","getTenantsByEmail.txt",1,[],returnMessage,"ctrl_login:get user tenants in auth db" );                                                                                                                                 
                                                                    } else {
                                                                        var numRows = results.length;
                                                                        if (numRows == 0) {
                                                                            authConnection.release();
                                                                            returnMessage = "No tenants registered in auth database for user email address" + decoded.email_address;
                                                                            utils.rr2r(reply,505,false,"login","getTenantsByEmail.txt",1,[],returnMessage,"ctrl_login:get user tenants in auth db" );                                                                                                                                 
                                                                        }
                                                                        if (numRows == 1) {
                                                                            var userSelectedTenant = results[0]['tenant_name'];
                                                                            userSelectedTenant = userSelectedTenant.toLowerCase();
                                                                            console.log("userSelectedTenant:"+ userSelectedTenant);
                                                                            console.log(typeof(global.connection_tenants[userSelectedTenant]));
                                                                            if (typeof(global.connection_tenants[userSelectedTenant]) != 'undefined') {
                                                                                // email address and pasword received are valid and user tenant is known
                                                                                global.connection_tenants[userSelectedTenant]["DB"].getConnection( function(error, tempConnection){
                                                                                    if(error){
                                                                                        utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],error,"ctrl_login:tenant db connection" );    
                                                                                    } else {
                                                                                        // Checking if a user with the received email address is known in the tenants database 
                                                                                        var sqlObject3 = utils.createSQL("users", "select", "getUserIdByEmail", {
                                                                                            "@users@email_address@" : req.headers.email_address
                                                                                        });
                                                                                        if (sqlObject3.success == true) {
                                                                                            tempConnection.query(sqlObject3.sql, function(err, results){
                                                                                                if (err) {
                                                                                                    tempConnection.release();
                                                                                                    utils.rr2r(reply,500,false,"login","authenticationFailed.txt",1,[],err,"ctrl_login:getUserIdByEmail" );                                             
                                                                                                } else {
                                                                                                    if ((results.length == 0) || (results.length > 1)) {     
                                                                                                        tempConnection.release();                                                                                           
                                                                                                        // User cannot be uniquely identified in user database
                                                                                                        returnMessage = 'mailaddress '+req.headers.email_address+' found 0 or more then once in the table users in tenant database' + userSelectedTenant;
                                                                                                        utils.rr2r(reply,401,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:getUserIdByEmail" );                            
                                                                                                    } else {                                                                                                                                                                                                                                 
                                                                                                        // User can be uniquely identified and a tenant was received which is known
                                                                                                        // Check if tenant is allowed for received user id
                                                                                                        tenantUserId = results[0].id;                                                                                                                   
                                                                                                        const token = jwt.sign(
                                                                                                            {
                                                                                                                email_address: req.headers.email_address,
                                                                                                                user_id: tenantUserId,
                                                                                                                tenant: userSelectedTenant
                                                                                                            },
                                                                                                            global.PRIVATE_KEY,
                                                                                                            {
                                                                                                                algorithm: 'RS256',
                                                                                                                expiresIn: process.env.AUTH_JWT_KEY_EXPIRATION
                                                                                                            }
                                                                                                        );

                                                                                                        reply.setCookie('SSO_ticket',token, { maxAge: 7200000000, httpOnly: true, secure: true });
                                                    
                                                                                                        // data_record is the array to return to the client so that the menu on the client can be dynamically built
                                                                                                        data_record = {
                                                                                                            "user_id"   : tenantUserId,
                                                                                                            "tenant"    : userSelectedTenant,
                                                                                                            "token"     : token,
                                                                                                            "logged_in" : true
                                                                                                        };
                                                        
                                                                                                        // Get the user rights
                                                                                                        var sqlObject4 = utils.createSQL("users", "select", "getUserMenuRights", {
                                                                                                            "@users@email_address@" : req.headers.email_address
                                                                                                        });
                                                                                                        if (sqlObject4.success == true) {
                                                                                                            tempConnection.query(sqlObject4.sql, function(err, results){
                                                                                                                if (err) {
                                                                                                                    tempConnection.release();
                                                                                                                    utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],err,"ctrl_login:getUserMenuRights" );        
                                                                                                                } else {
                                                                                                                    tempConnection.release();
                                                                                                                    if (results.length > 0) {                                                                                                           
                                                                                                                        data_record["menu"] = results;
                                                                                                                        utils.rr2r(reply,200,true,"login","authenticationSuccess.txt",0,[data_record],[],"ctrl_login:getUserMenuRights" );           
                                                                                                                    } else {                                                                                                                            
                                                                                                                        returnMessage = 'user has no rights assigned';
                                                                                                                        utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:getUserMenuRights" );           
                                                                                                                    }
                                                                                                                }
                                                                                                            });
                                                                                                        } else {
                                                                                                            tempConnection.release();
                                                                                                            utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],sqlObject4.errorMessages,"ctrl_login:getUserMenuRights" );        
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            });
                                                                                        } else {
                                                                                            tempConnection.release();
                                                                                            utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],sqlObject3.errorMessages,"ctrl_login:getUserIdByEmail" );        
                                                                                        }
                                                                                    }            
                                                                                });
                                                        
                                                                            } else {
                                                                                returnMessage = "The user tenant retrieved in the auth db has no valid reference in the tenant specific database.";
                                                                                utils.rr2r(reply,404,false,"login","authenticationFailed.txt",1,[],returnMessage,"ctrl_login:getUserIdByEmail" );        
                                                                            }
                                                                        }
                                                                        if (numRows > 1) {
                                                                            var tenants = [];
                                                                            for (var r= 0; r<results.length;r++){
                                                                                tenants[r] = results[r]["tenant_name"];
                                                                            };
                                                                            data_record = {
                                                                                "tenants" : tenants
                                                                            };
                                                                            authConnection.release(); 
                                                                            utils.rr2r(reply, 200, true, "login","getTenantsByEmail.txt", 0, [data_record], [], "ctrl_login:get user tenants in auth db", data_record );
                                                                        }
                                                                    }
                                                                });
                                                            } else {
                                                                // Could not execute getTenantsByEmail query
                                                                authConnection.release();
                                                                utils.rr2r(reply,500,false,"login","authenticationFailed.txt",1,[],sqlObject2.errorMessages,"ctrl_login:getTenantsByEmail" );                                                                                            
                                                            }
                                                        } else {
                                                            // Password correct
                                                            authConnection.release();
                                                            utils.rr2r(reply,401,false,"login","authenticationFailed.txt",1,[],"password is invalid","ctrl_login:authDB connection" );    
                                                        }
                                                    }
                                                })
                                            } else {
                                                authConnection.release();
                                                returnMessage = 'mailaddress '+req.headers.email_address+' found 0 or more then once in the table users'
                                                utils.rr2r(reply,404,false,"database","authDatabaseError.txt",1,[],returnMessage,"ctrl_login:authDB connection" );    
                                            }
                                        }
                                    });
                                } else {
                                    authConnection.release();
                                    utils.retRes(res, 404, false, global.language["errorMessages"]["database"]["createQueryError.txt"], 1, [], [sqlObject]); 
                                }
                            }            
                        });
                    }
                } catch (err) {
                    utils.rr2r(reply, 500, false, "countries", "getError.txt", 1, [], err, "ctrl_countries:getCountries:execute SQL query", "error during selecting countries");
                } finally {
                    await authConnection.release();
                }
            
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "authConnection.txt", 1, [], e, "ctrl_login:getCountries:login validation passed", "error connecting to auth database")
        }
    } else {   
        utils.rr2r(reply,404,false,"inputFieldValidation","inputFieldValidationError.txt",1,[], validation.errors.errors ,"ctrl_customers:getCustomers:input request validation" );
    }
}
