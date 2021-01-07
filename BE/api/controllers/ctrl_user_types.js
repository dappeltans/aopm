const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.getUser_types = async (req, reply) => {
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
                    sqlObject = utils.createSQL("user_types", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("user_types", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "user_types", "getSuccess.txt", 0, results, [], "ctrl_user_types.js:getUser_types:execute SQL query", "successfully selected user_types");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "user_types", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_user_types.js:getUser_types:execute SQL query", "error during selecting user_types")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "user_types", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_user_types.js:getUser_types:execute SQL query", "error during selecting user_types");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "user_types", "getError.txt", 1, [], err, "ctrl_user_types.js:getUser_types:execute SQL query", "error during selecting user_types");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_user_types.js:getUser_types:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_user_types.js:getUser_types:input request validation")
    }
}

exports.getUser_typesById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@user_types']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("user_types", "select", "getById", {
                    "@user_types@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "user_types", "getByIdSuccess.txt", 0, results, [], "ctrl_user_types.js:getUser_typesById:execute SQL query", "successfully selected user_types by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "user_types", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_user_types.js:getUser_typesById:execute SQL query", "error during selecting user_types by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "user_types", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_user_types.js:getUser_typesById:execute SQL query", "error during selecting user_types by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "user_types", "getByIdError.txt", 1, [], err, "ctrl_user_types.js:getUser_typesById:execute SQL query", "error during selecting user_types by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_user_types.js:getUser_typesById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_user_types.js:getUser_typesById:input request validation")
    }
}

exports.createUser_types = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
       if (typeof(global.jsonInputValidations['@user_types']['@id@']) === 'undefined'){
           throw "global.jsonInputValidations['@user_types']['@id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@user_types']['@code@']) === 'undefined'){
           throw "global.jsonInputValidations['@user_types']['@code@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@user_types']['@description@']) === 'undefined'){
           throw "global.jsonInputValidations['@user_types']['@description@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@user_types']['@active@']) === 'undefined'){
           throw "global.jsonInputValidations['@user_types']['@active@'] is not found";
       }

    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_user_types.js:createuser_types:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
        code           : req.body.code,
        description    : req.body.description,
        active         : req.body.active
    };
    let rules = {
        code        : ['required', 'regex:'+global.jsonInputValidations['@user_types']['@code@']],
        description : ['required', 'regex:'+global.jsonInputValidations['@user_types']['@description@']],
        active      : ['required', 'regex:'+global.jsonInputValidations['@user_types']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("user_types", "select", "checkExistenceByUniqueReference", {
                    "@user_types@code@" : req.body.code
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("user_types", "insert", "createNew", {
                                "@user_types@code@"         : req.body.code,
                                "@user_types@description@"  : req.body.description,
                                "@user_types@active@"       : req.body.active
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
                                utils.rr2r(reply, 201, true, "user_types", "createSuccess.txt", 0, obj, [], "ctrl_user_types.js:createUser_types:execute SQL query", "successfully created new item in user_types")
                            } else {
                                utils.rr2r(reply, 500, false, "user_types", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_user_types.js:createUser_types:execute SQL query", "error during creating item for user_types")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "user_types", "alreadyExists.txt", 1, [], "user_types already exists", "ctrl_user_types.js:createuser_types:execute SQL query", "error during creating item for user_types")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "user_types", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_user_types.js:createUser_types:execute SQL query", "error during creating item for user_types")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "user_types", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_user_types.js:createUser_types:execute SQL query", "error during creating item for user_types")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "user_types", "createError.txt", 1, [], err, "ctrl_user_types.js:createUser_types:execute SQL query", "error during creating item for user_types")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_user_types.js:createUser_types:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_user_types.js:createUser_types:input request validation")
    }

}

exports.deleteUser_typesById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@user_types']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("user_types", "delete", "deleteById", {
                    "@user_types@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "user_types", "deleteByIdSuccess.txt", 0, results, [], "ctrl_user_types.js:deleteUser_types:execute SQL query", "successfully deleted item with provided id in user_types")
                        } else {
                            utils.rr2r(reply, 200, true, "user_types", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_user_types.js:deleteUser_types:execute SQL query", "no user_types item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "user_types", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_user_types.js:deleteUser_types:execute SQL query", "error during deleting item with provided id in user_types")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "user_types", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_user_types.js:deleteUser_types:execute SQL query", "error during deleting item with provided id in user_types")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "user_types", "deleteByIdError.txt", 1, [], err, "ctrl_user_types.js:deleteUser_types:execute SQL query", "error during deleting item with provided id in user_types")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_user_types.js:deleteUser_types:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_user_types.js:deleteUser_types:input request validation error")
    }
}

exports.updateUser_typesById = async (req, reply) => {
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
        id          : ['required', 'regex:'+global.jsonInputValidations['@user_types']['@id@']],
        code        : [            'regex:'+global.jsonInputValidations['@user_types']['@code@']],
        description : [            'regex:'+global.jsonInputValidations['@user_types']['@description@']],
        active      : [            'regex:'+global.jsonInputValidations['@user_types']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("user_types", "update", "updateById", {
                    "@user_types@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "user_types", "updateByIdSuccess.txt", 0, results, [], "ctrl_user_types.js:updateUser_types:execute SQL query", "successfully updated user_types by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "user_types", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_user_types.js:updateUser_types:execute SQL query", "no user_types found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "user_types", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_user_types.js:updateUser_types:execute SQL query", "error during updating user_types by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "user_types", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_user_types.js:updateUser_types:execute SQL query", "error during updating user_types by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "user_types", "updateByIdError.txt", 1, [], err, "ctrl_user_types.js:updateUser_types:execute SQL query", "error during updating user_types by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_user_types.js:updateUser_types:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_user_types.js:updateUser_types:input request validation error");
    }
}