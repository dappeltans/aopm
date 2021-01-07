const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.getProfiles = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    var limit = 0;
    var page  = 0;
    var start = 0;

    if (req.query.limit) {
        limit = parseInt(req.query.limit);
    }

    if (req.query.page) {
        page = parseInt(req.query.page);
    }

    if (req.query.start) {
        start = parseInt(req.query.start);
    }

    let data = {
        limit: limit,
        page:  page,
        start: start 
    };

    let rules = {
        limit:  ['regex:'+global.jsonInputValidations['@pagination']['@limit@']],
        page:   ['regex:'+global.jsonInputValidations['@pagination']['@page@']],
        start:  ['regex:'+global.jsonInputValidations['@pagination']['@start@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = "";
                if ((limit != 0) && (page != 0) && (start >= 0)) {
                    var offset = (page - 1) * limit;
                    sqlObject = utils.createSQL("profiles", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("profiles", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "profiles", "getSuccess.txt", 0, results, [], "ctrl_profiles.js:getProfiles:execute SQL query", "successfully selected profiles");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profiles", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profiles.js:getProfiles:execute SQL query", "error during selecting profiles")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "profiles", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_profiles.js:getProfiles:execute SQL query", "error during selecting profiles");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profiles", "getError.txt", 1, [], err, "ctrl_profiles.js:getProfiles:execute SQL query", "error during selecting profiles");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profiles.js:getProfiles:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profiles.js:getProfiles:input request validation")
    }
}

exports.getProfilesById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@profiles']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("profiles", "select", "getById", {
                    "@profiles@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "profiles", "getByIdSuccess.txt", 0, results, [], "ctrl_profiles.js:getProfilesById:execute SQL query", "successfully selected profiles by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profiles", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profiles.js:getProfilesById:execute SQL query", "error during selecting profiles by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "profiles", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_profiles.js:getProfilesById:execute SQL query", "error during selecting profiles by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profiles", "getByIdError.txt", 1, [], err, "ctrl_profiles.js:getProfilesById:execute SQL query", "error during selecting profiles by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profiles.js:getProfilesById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profiles.js:getProfilesById:input request validation")
    }
}

exports.createProfiles = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
       if (typeof(global.jsonInputValidations['@profiles']['@id@']) === 'undefined'){
           throw "global.jsonInputValidations['@profiles']['@id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@profiles']['@code@']) === 'undefined'){
           throw "global.jsonInputValidations['@profiles']['@code@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@profiles']['@description@']) === 'undefined'){
           throw "global.jsonInputValidations['@profiles']['@description@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@profiles']['@active@']) === 'undefined'){
           throw "global.jsonInputValidations['@profiles']['@active@'] is not found";
       }

    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_profiles.js:createprofiles:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
        code           : req.body.code,
        description    : req.body.description,
        active         : req.body.active
    };
    let rules = {
        code        : ['required', 'regex:'+global.jsonInputValidations['@profiles']['@code@']],
        description : ['required', 'regex:'+global.jsonInputValidations['@profiles']['@description@']],
        active      : ['required', 'regex:'+global.jsonInputValidations['@profiles']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("profiles", "select", "checkExistenceByUniqueReference", {
                    "@profiles@code@" : req.body.code
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("profiles", "insert", "createNew", {
                                "@profiles@code@"         : req.body.code,
                                "@profiles@description@"  : req.body.description,
                                "@profiles@active@"       : req.body.active
                            });
                            if (sqlObject2.success == true) {
                                results = await connection.query(sqlObject2.sql);
                                await connection.query("COMMIT");
                                var obj = {
                                    "id"           : results.insertId,
                                    "code"         : req.body.code,
                                    "description"  : req.body.description,
                                    "active"       : req.body.active
                                }
                                utils.rr2r(reply, 201, true, "profiles", "createSuccess.txt", 0, obj, [], "ctrl_profiles.js:createProfiles:execute SQL query", "successfully created new item in profiles")
                            } else {
                                utils.rr2r(reply, 500, false, "profiles", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_profiles.js:createProfiles:execute SQL query", "error during creating item for profiles")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "profiles", "alreadyExists.txt", 1, [], "profiles already exists", "ctrl_profiles.js:createprofiles:execute SQL query", "error during creating item for profiles")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profiles", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profiles.js:createProfiles:execute SQL query", "error during creating item for profiles")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "profiles", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_profiles.js:createProfiles:execute SQL query", "error during creating item for profiles")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profiles", "createError.txt", 1, [], err, "ctrl_profiles.js:createProfiles:execute SQL query", "error during creating item for profiles")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profiles.js:createProfiles:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profiles.js:createProfiles:input request validation")
    }

}

exports.deleteProfilesById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@profiles']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("profiles", "delete", "deleteById", {
                    "@profiles@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "profiles", "deleteByIdSuccess.txt", 0, results, [], "ctrl_profiles.js:deleteProfiles:execute SQL query", "successfully deleted item with provided id in profiles")
                        } else {
                            utils.rr2r(reply, 200, true, "profiles", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_profiles.js:deleteProfiles:execute SQL query", "no profiles item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profiles", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profiles.js:deleteProfiles:execute SQL query", "error during deleting item with provided id in profiles")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "profiles", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_profiles.js:deleteProfiles:execute SQL query", "error during deleting item with provided id in profiles")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profiles", "deleteByIdError.txt", 1, [], err, "ctrl_profiles.js:deleteProfiles:execute SQL query", "error during deleting item with provided id in profiles")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profiles.js:deleteProfiles:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profiles.js:deleteProfiles:input request validation error")
    }
}

exports.updateProfilesById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id             : req.params.id,
        code           : req.body.code,
        description    : req.body.description,
        active         : req.body.active
    };
    let rules = {
        id          : ['required', 'regex:'+global.jsonInputValidations['@profiles']['@id@']],
        code        : [            'regex:'+global.jsonInputValidations['@profiles']['@code@']],
        description : [            'regex:'+global.jsonInputValidations['@profiles']['@description@']],
        active      : [            'regex:'+global.jsonInputValidations['@profiles']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("profiles", "update", "updateById", {
                    "@profiles@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "profiles", "updateByIdSuccess.txt", 0, results, [], "ctrl_profiles.js:updateProfiles:execute SQL query", "successfully updated profiles by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "profiles", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_profiles.js:updateProfiles:execute SQL query", "no profiles found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profiles", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profiles.js:updateProfiles:execute SQL query", "error during updating profiles by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "profiles", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_profiles.js:updateProfiles:execute SQL query", "error during updating profiles by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profiles", "updateByIdError.txt", 1, [], err, "ctrl_profiles.js:updateProfiles:execute SQL query", "error during updating profiles by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profiles.js:updateProfiles:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profiles.js:updateProfiles:input request validation error");
    }
}