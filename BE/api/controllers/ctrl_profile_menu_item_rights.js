const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.getProfile_menu_item_rights = async (req, reply) => {
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
                    sqlObject = utils.createSQL("profile_menu_item_rights", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("profile_menu_item_rights", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "profile_menu_item_rights", "getSuccess.txt", 0, results, [], "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rights:execute SQL query", "successfully selected profile_menu_item_rights");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profile_menu_item_rights", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rights:execute SQL query", "error during selecting profile_menu_item_rights")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "profile_menu_item_rights", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rights:execute SQL query", "error during selecting profile_menu_item_rights");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profile_menu_item_rights", "getError.txt", 1, [], err, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rights:execute SQL query", "error during selecting profile_menu_item_rights");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rights:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rights:input request validation")
    }
}

exports.getProfile_menu_item_rightsById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("profile_menu_item_rights", "select", "getById", {
                    "@profile_menu_item_rights@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "profile_menu_item_rights", "getByIdSuccess.txt", 0, results, [], "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rightsById:execute SQL query", "successfully selected profile_menu_item_rights by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profile_menu_item_rights", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rightsById:execute SQL query", "error during selecting profile_menu_item_rights by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "profile_menu_item_rights", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rightsById:execute SQL query", "error during selecting profile_menu_item_rights by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profile_menu_item_rights", "getByIdError.txt", 1, [], err, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rightsById:execute SQL query", "error during selecting profile_menu_item_rights by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rightsById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profile_menu_item_rights.js:getProfile_menu_item_rightsById:input request validation")
    }
}

exports.createProfile_menu_item_rights = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
       if (typeof(global.jsonInputValidations['@profile_menu_item_rights']['@id@']) === 'undefined'){
           throw "global.jsonInputValidations['@profile_menu_item_rights']['@id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@profile_menu_item_rights']['@unique_ref_id@']) === 'undefined'){
           throw "global.jsonInputValidations['@profile_menu_item_rights']['@unique_ref_id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@profile_menu_item_rights']['@profile_id@']) === 'undefined'){
           throw "global.jsonInputValidations['@profile_menu_item_rights']['@profile_id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@profile_menu_item_rights']['@menu_item_rights_id@']) === 'undefined'){
           throw "global.jsonInputValidations['@profile_menu_item_rights']['@menu_item_rights_id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@profile_menu_item_rights']['@allowed@']) === 'undefined'){
           throw "global.jsonInputValidations['@profile_menu_item_rights']['@allowed@'] is not found";
       }

    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_profile_menu_item_rights.js:createprofile_menu_item_rights:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
        unique_ref_id          : req.body.unique_ref_id,
        profile_id             : req.body.profile_id,
        menu_item_rights_id    : req.body.menu_item_rights_id,
        allowed                : req.body.allowed
    };
    let rules = {
        unique_ref_id       : ['required', 'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@unique_ref_id@']],
        profile_id          : ['required', 'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@profile_id@']],
        menu_item_rights_id : ['required', 'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@menu_item_rights_id@']],
        allowed             : ['required', 'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@allowed@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("profile_menu_item_rights", "select", "checkExistenceByUniqueReference", {
                    "@profile_menu_item_rights@unique_ref_id@" : req.body.unique_ref_id
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("profile_menu_item_rights", "insert", "createNew", {
                                "@profile_menu_item_rights@unique_ref_id@"        : req.body.unique_ref_id,
                                "@profile_menu_item_rights@profile_id@"           : req.body.profile_id,
                                "@profile_menu_item_rights@menu_item_rights_id@"  : req.body.menu_item_rights_id,
                                "@profile_menu_item_rights@allowed@"              : req.body.allowed
                            });
                            if (sqlObject2.success == true) {
                                results = await connection.query(sqlObject2.sql);
                                await connection.query("COMMIT");
                                var obj = {
                                    "id"                   : results.insertId,
                                    "unique_ref_id"        : req.body.unique_ref_id,
                                    "profile_id"           : req.body.profile_id,
                                    "menu_item_rights_id"  : req.body.menu_item_rights_id,
                                    "allowed"              : req.body.allowed
                                }
                                utils.rr2r(reply, 201, true, "profile_menu_item_rights", "createSuccess.txt", 0, obj, [], "ctrl_profile_menu_item_rights.js:createProfile_menu_item_rights:execute SQL query", "successfully created new item in profile_menu_item_rights")
                            } else {
                                utils.rr2r(reply, 500, false, "profile_menu_item_rights", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_profile_menu_item_rights.js:createProfile_menu_item_rights:execute SQL query", "error during creating item for profile_menu_item_rights")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "profile_menu_item_rights", "alreadyExists.txt", 1, [], "profile_menu_item_rights already exists", "ctrl_profile_menu_item_rights.js:createprofile_menu_item_rights:execute SQL query", "error during creating item for profile_menu_item_rights")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profile_menu_item_rights", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profile_menu_item_rights.js:createProfile_menu_item_rights:execute SQL query", "error during creating item for profile_menu_item_rights")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "profile_menu_item_rights", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_profile_menu_item_rights.js:createProfile_menu_item_rights:execute SQL query", "error during creating item for profile_menu_item_rights")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profile_menu_item_rights", "createError.txt", 1, [], err, "ctrl_profile_menu_item_rights.js:createProfile_menu_item_rights:execute SQL query", "error during creating item for profile_menu_item_rights")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profile_menu_item_rights.js:createProfile_menu_item_rights:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profile_menu_item_rights.js:createProfile_menu_item_rights:input request validation")
    }

}

exports.deleteProfile_menu_item_rightsById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("profile_menu_item_rights", "delete", "deleteById", {
                    "@profile_menu_item_rights@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "profile_menu_item_rights", "deleteByIdSuccess.txt", 0, results, [], "ctrl_profile_menu_item_rights.js:deleteProfile_menu_item_rights:execute SQL query", "successfully deleted item with provided id in profile_menu_item_rights")
                        } else {
                            utils.rr2r(reply, 200, true, "profile_menu_item_rights", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_profile_menu_item_rights.js:deleteProfile_menu_item_rights:execute SQL query", "no profile_menu_item_rights item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profile_menu_item_rights", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profile_menu_item_rights.js:deleteProfile_menu_item_rights:execute SQL query", "error during deleting item with provided id in profile_menu_item_rights")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "profile_menu_item_rights", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_profile_menu_item_rights.js:deleteProfile_menu_item_rights:execute SQL query", "error during deleting item with provided id in profile_menu_item_rights")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profile_menu_item_rights", "deleteByIdError.txt", 1, [], err, "ctrl_profile_menu_item_rights.js:deleteProfile_menu_item_rights:execute SQL query", "error during deleting item with provided id in profile_menu_item_rights")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profile_menu_item_rights.js:deleteProfile_menu_item_rights:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profile_menu_item_rights.js:deleteProfile_menu_item_rights:input request validation error")
    }
}

exports.updateProfile_menu_item_rightsById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id                     : req.params.id,
        unique_ref_id          : req.body.unique_ref_id,
        profile_id             : req.body.profile_id,
        menu_item_rights_id    : req.body.menu_item_rights_id,
        allowed                : req.body.allowed
    };
    let rules = {
        id                  : ['required', 'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@id@']],
        unique_ref_id       : [            'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@unique_ref_id@']],
        profile_id          : [            'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@profile_id@']],
        menu_item_rights_id : [            'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@menu_item_rights_id@']],
        allowed             : [            'regex:'+global.jsonInputValidations['@profile_menu_item_rights']['@allowed@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("profile_menu_item_rights", "update", "updateById", {
                    "@profile_menu_item_rights@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "profile_menu_item_rights", "updateByIdSuccess.txt", 0, results, [], "ctrl_profile_menu_item_rights.js:updateProfile_menu_item_rights:execute SQL query", "successfully updated profile_menu_item_rights by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "profile_menu_item_rights", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_profile_menu_item_rights.js:updateProfile_menu_item_rights:execute SQL query", "no profile_menu_item_rights found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "profile_menu_item_rights", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_profile_menu_item_rights.js:updateProfile_menu_item_rights:execute SQL query", "error during updating profile_menu_item_rights by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "profile_menu_item_rights", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_profile_menu_item_rights.js:updateProfile_menu_item_rights:execute SQL query", "error during updating profile_menu_item_rights by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "profile_menu_item_rights", "updateByIdError.txt", 1, [], err, "ctrl_profile_menu_item_rights.js:updateProfile_menu_item_rights:execute SQL query", "error during updating profile_menu_item_rights by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_profile_menu_item_rights.js:updateProfile_menu_item_rights:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_profile_menu_item_rights.js:updateProfile_menu_item_rights:input request validation error");
    }
}