const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.getMenu_item_rights = async (req, reply) => {
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
                    sqlObject = utils.createSQL("menu_item_rights", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("menu_item_rights", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "menu_item_rights", "getSuccess.txt", 0, results, [], "ctrl_menu_item_rights.js:getMenu_item_rights:execute SQL query", "successfully selected menu_item_rights");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu_item_rights", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu_item_rights.js:getMenu_item_rights:execute SQL query", "error during selecting menu_item_rights")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "menu_item_rights", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu_item_rights.js:getMenu_item_rights:execute SQL query", "error during selecting menu_item_rights");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu_item_rights", "getError.txt", 1, [], err, "ctrl_menu_item_rights.js:getMenu_item_rights:execute SQL query", "error during selecting menu_item_rights");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu_item_rights.js:getMenu_item_rights:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu_item_rights.js:getMenu_item_rights:input request validation")
    }
}

exports.getMenu_item_rightsById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@menu_item_rights']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("menu_item_rights", "select", "getById", {
                    "@menu_item_rights@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "menu_item_rights", "getByIdSuccess.txt", 0, results, [], "ctrl_menu_item_rights.js:getMenu_item_rightsById:execute SQL query", "successfully selected menu_item_rights by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu_item_rights", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu_item_rights.js:getMenu_item_rightsById:execute SQL query", "error during selecting menu_item_rights by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "menu_item_rights", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu_item_rights.js:getMenu_item_rightsById:execute SQL query", "error during selecting menu_item_rights by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu_item_rights", "getByIdError.txt", 1, [], err, "ctrl_menu_item_rights.js:getMenu_item_rightsById:execute SQL query", "error during selecting menu_item_rights by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu_item_rights.js:getMenu_item_rightsById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu_item_rights.js:getMenu_item_rightsById:input request validation")
    }
}

exports.createMenu_item_rights = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
       if (typeof(global.jsonInputValidations['@menu_item_rights']['@id@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu_item_rights']['@id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu_item_rights']['@menu_item_id@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu_item_rights']['@menu_item_id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu_item_rights']['@menu_item_right_label@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu_item_rights']['@menu_item_right_label@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu_item_rights']['@variable_name@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu_item_rights']['@variable_name@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu_item_rights']['@active@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu_item_rights']['@active@'] is not found";
       }

    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_menu_item_rights.js:createmenu_item_rights:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
        menu_item_id             : req.body.menu_item_id,
        menu_item_right_label    : req.body.menu_item_right_label,
        variable_name            : req.body.variable_name,
        active                   : req.body.active
    };
    let rules = {
        menu_item_id          : ['required', 'regex:'+global.jsonInputValidations['@menu_item_rights']['@menu_item_id@']],
        menu_item_right_label : ['required', 'regex:'+global.jsonInputValidations['@menu_item_rights']['@menu_item_right_label@']],
        variable_name         : ['required', 'regex:'+global.jsonInputValidations['@menu_item_rights']['@variable_name@']],
        active                : ['required', 'regex:'+global.jsonInputValidations['@menu_item_rights']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("menu_item_rights", "select", "checkExistenceByUniqueReference", {
                    "@menu_item_rights@id@" : req.body.id
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("menu_item_rights", "insert", "createNew", {
                                "@menu_item_rights@menu_item_id@"           : req.body.menu_item_id,
                                "@menu_item_rights@menu_item_right_label@"  : req.body.menu_item_right_label,
                                "@menu_item_rights@variable_name@"          : req.body.variable_name,
                                "@menu_item_rights@active@"                 : req.body.active
                            });
                            if (sqlObject2.success == true) {
                                results = await connection.query(sqlObject2.sql);
                                await connection.query("COMMIT");
                                var obj = {
                                    "id"                     : results.insertId,
                                    "menu_item_id"           : req.body.menu_item_id,
                                    "menu_item_right_label"  : req.body.menu_item_right_label,
                                    "variable_name"          : req.body.variable_name,
                                    "active"                 : req.body.active
                                }
                                utils.rr2r(reply, 201, true, "menu_item_rights", "createSuccess.txt", 0, obj, [], "ctrl_menu_item_rights.js:createMenu_item_rights:execute SQL query", "successfully created new item in menu_item_rights")
                            } else {
                                utils.rr2r(reply, 500, false, "menu_item_rights", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_menu_item_rights.js:createMenu_item_rights:execute SQL query", "error during creating item for menu_item_rights")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "menu_item_rights", "alreadyExists.txt", 1, [], "menu_item_rights already exists", "ctrl_menu_item_rights.js:createmenu_item_rights:execute SQL query", "error during creating item for menu_item_rights")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu_item_rights", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu_item_rights.js:createMenu_item_rights:execute SQL query", "error during creating item for menu_item_rights")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "menu_item_rights", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu_item_rights.js:createMenu_item_rights:execute SQL query", "error during creating item for menu_item_rights")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu_item_rights", "createError.txt", 1, [], err, "ctrl_menu_item_rights.js:createMenu_item_rights:execute SQL query", "error during creating item for menu_item_rights")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu_item_rights.js:createMenu_item_rights:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu_item_rights.js:createMenu_item_rights:input request validation")
    }

}

exports.deleteMenu_item_rightsById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@menu_item_rights']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("menu_item_rights", "delete", "deleteById", {
                    "@menu_item_rights@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "menu_item_rights", "deleteByIdSuccess.txt", 0, results, [], "ctrl_menu_item_rights.js:deleteMenu_item_rights:execute SQL query", "successfully deleted item with provided id in menu_item_rights")
                        } else {
                            utils.rr2r(reply, 200, true, "menu_item_rights", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_menu_item_rights.js:deleteMenu_item_rights:execute SQL query", "no menu_item_rights item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu_item_rights", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu_item_rights.js:deleteMenu_item_rights:execute SQL query", "error during deleting item with provided id in menu_item_rights")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "menu_item_rights", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu_item_rights.js:deleteMenu_item_rights:execute SQL query", "error during deleting item with provided id in menu_item_rights")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu_item_rights", "deleteByIdError.txt", 1, [], err, "ctrl_menu_item_rights.js:deleteMenu_item_rights:execute SQL query", "error during deleting item with provided id in menu_item_rights")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu_item_rights.js:deleteMenu_item_rights:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu_item_rights.js:deleteMenu_item_rights:input request validation error")
    }
}

exports.updateMenu_item_rightsById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id                       : req.params.id,
        menu_item_id             : req.body.menu_item_id,
        menu_item_right_label    : req.body.menu_item_right_label,
        variable_name            : req.body.variable_name,
        active                   : req.body.active
    };
    let rules = {
        id                    : ['required', 'regex:'+global.jsonInputValidations['@menu_item_rights']['@id@']],
        menu_item_id          : [            'regex:'+global.jsonInputValidations['@menu_item_rights']['@menu_item_id@']],
        menu_item_right_label : [            'regex:'+global.jsonInputValidations['@menu_item_rights']['@menu_item_right_label@']],
        variable_name         : [            'regex:'+global.jsonInputValidations['@menu_item_rights']['@variable_name@']],
        active                : [            'regex:'+global.jsonInputValidations['@menu_item_rights']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("menu_item_rights", "update", "updateById", {
                    "@menu_item_rights@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "menu_item_rights", "updateByIdSuccess.txt", 0, results, [], "ctrl_menu_item_rights.js:updateMenu_item_rights:execute SQL query", "successfully updated menu_item_rights by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "menu_item_rights", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_menu_item_rights.js:updateMenu_item_rights:execute SQL query", "no menu_item_rights found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu_item_rights", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu_item_rights.js:updateMenu_item_rights:execute SQL query", "error during updating menu_item_rights by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "menu_item_rights", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu_item_rights.js:updateMenu_item_rights:execute SQL query", "error during updating menu_item_rights by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu_item_rights", "updateByIdError.txt", 1, [], err, "ctrl_menu_item_rights.js:updateMenu_item_rights:execute SQL query", "error during updating menu_item_rights by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu_item_rights.js:updateMenu_item_rights:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu_item_rights.js:updateMenu_item_rights:input request validation error");
    }
}