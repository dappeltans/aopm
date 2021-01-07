const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.get$Table_name$ = async (req, reply) => {
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
                    sqlObject = utils.createSQL("$table_name$", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("$table_name$", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "$table_name$", "getSuccess.txt", 0, results, [], "ctrl_$table_name$.js:get$Table_name$:execute SQL query", "successfully selected $table_name$");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "$table_name$", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_$table_name$.js:get$Table_name$:execute SQL query", "error during selecting $table_name$")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "$table_name$", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_$table_name$.js:get$Table_name$:execute SQL query", "error during selecting $table_name$");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "$table_name$", "getError.txt", 1, [], err, "ctrl_$table_name$.js:get$Table_name$:execute SQL query", "error during selecting $table_name$");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_$table_name$.js:get$Table_name$:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_$table_name$.js:get$Table_name$:input request validation")
    }
}

exports.get$Table_name$ById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@$table_name$']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("$table_name$", "select", "getById", {
                    "@$table_name$@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "$table_name$", "getByIdSuccess.txt", 0, results, [], "ctrl_$table_name$.js:get$Table_name$ById:execute SQL query", "successfully selected $table_name$ by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "$table_name$", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_$table_name$.js:get$Table_name$ById:execute SQL query", "error during selecting $table_name$ by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "$table_name$", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_$table_name$.js:get$Table_name$ById:execute SQL query", "error during selecting $table_name$ by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "$table_name$", "getByIdError.txt", 1, [], err, "ctrl_$table_name$.js:get$Table_name$ById:execute SQL query", "error during selecting $table_name$ by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_$table_name$.js:get$Table_name$ById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_$table_name$.js:get$Table_name$ById:input request validation")
    }
}

exports.create$Table_name$ = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
$ctrl_create_input_validations_check$
    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_$table_name$.js:create$table_name$:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
$ctrl_create_data$
    };
    let rules = {
$ctrl_create_data_rules$
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("$table_name$", "select", "checkExistenceByUniqueReference", {
                    "@$table_name$@$field_name$@" : req.body.$field_name$
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("$table_name$", "insert", "createNew", {
$ctrl_create_dynamic_parameters_sql$
                            });
                            if (sqlObject2.success == true) {
                                results = await connection.query(sqlObject2.sql);
                                await connection.query("COMMIT");
                                var obj = {
$ctrl_create_data_returned$
                                }
                                utils.rr2r(reply, 201, true, "$table_name$", "createSuccess.txt", 0, obj, [], "ctrl_$table_name$.js:create$Table_name$:execute SQL query", "successfully created new item in $table_name$")
                            } else {
                                utils.rr2r(reply, 500, false, "$table_name$", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_$table_name$.js:create$Table_name$:execute SQL query", "error during creating item for $table_name$")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "$table_name$", "alreadyExists.txt", 1, [], "$table_name$ already exists", "ctrl_$table_name$.js:create$table_name$:execute SQL query", "error during creating item for $table_name$")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "$table_name$", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_$table_name$.js:create$Table_name$:execute SQL query", "error during creating item for $table_name$")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "$table_name$", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_$table_name$.js:create$Table_name$:execute SQL query", "error during creating item for $table_name$")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "$table_name$", "createError.txt", 1, [], err, "ctrl_$table_name$.js:create$Table_name$:execute SQL query", "error during creating item for $table_name$")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_$table_name$.js:create$Table_name$:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_$table_name$.js:create$Table_name$:input request validation")
    }

}

exports.delete$Table_name$ById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@$table_name$']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("$table_name$", "delete", "deleteById", {
                    "@$table_name$@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "$table_name$", "deleteByIdSuccess.txt", 0, results, [], "ctrl_$table_name$.js:delete$Table_name$:execute SQL query", "successfully deleted item with provided id in $table_name$")
                        } else {
                            utils.rr2r(reply, 200, true, "$table_name$", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_$table_name$.js:delete$Table_name$:execute SQL query", "no $table_name$ item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "$table_name$", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_$table_name$.js:delete$Table_name$:execute SQL query", "error during deleting item with provided id in $table_name$")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "$table_name$", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_$table_name$.js:delete$Table_name$:execute SQL query", "error during deleting item with provided id in $table_name$")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "$table_name$", "deleteByIdError.txt", 1, [], err, "ctrl_$table_name$.js:delete$Table_name$:execute SQL query", "error during deleting item with provided id in $table_name$")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_$table_name$.js:delete$Table_name$:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_$table_name$.js:delete$Table_name$:input request validation error")
    }
}

exports.update$Table_name$ById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
$ctrl_update_data$
    };
    let rules = {
$ctrl_update_data_rules$
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("$table_name$", "update", "updateById", {
                    "@$table_name$@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "$table_name$", "updateByIdSuccess.txt", 0, results, [], "ctrl_$table_name$.js:update$Table_name$:execute SQL query", "successfully updated $table_name$ by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "$table_name$", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_$table_name$.js:update$Table_name$:execute SQL query", "no $table_name$ found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "$table_name$", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_$table_name$.js:update$Table_name$:execute SQL query", "error during updating $table_name$ by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "$table_name$", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_$table_name$.js:update$Table_name$:execute SQL query", "error during updating $table_name$ by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "$table_name$", "updateByIdError.txt", 1, [], err, "ctrl_$table_name$.js:update$Table_name$:execute SQL query", "error during updating $table_name$ by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_$table_name$.js:update$Table_name$:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_$table_name$.js:update$Table_name$:input request validation error");
    }
}