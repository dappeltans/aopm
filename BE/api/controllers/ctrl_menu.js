const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.getMenu = async (req, reply) => {
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
                    sqlObject = utils.createSQL("menu", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("menu", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "menu", "getSuccess.txt", 0, results, [], "ctrl_menu.js:getMenu:execute SQL query", "successfully selected menu");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu.js:getMenu:execute SQL query", "error during selecting menu")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "menu", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu.js:getMenu:execute SQL query", "error during selecting menu");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu", "getError.txt", 1, [], err, "ctrl_menu.js:getMenu:execute SQL query", "error during selecting menu");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu.js:getMenu:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu.js:getMenu:input request validation")
    }
}

exports.getMenuById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@menu']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("menu", "select", "getById", {
                    "@menu@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "menu", "getByIdSuccess.txt", 0, results, [], "ctrl_menu.js:getMenuById:execute SQL query", "successfully selected menu by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu.js:getMenuById:execute SQL query", "error during selecting menu by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "menu", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu.js:getMenuById:execute SQL query", "error during selecting menu by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu", "getByIdError.txt", 1, [], err, "ctrl_menu.js:getMenuById:execute SQL query", "error during selecting menu by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu.js:getMenuById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu.js:getMenuById:input request validation")
    }
}

exports.createMenu = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
       if (typeof(global.jsonInputValidations['@menu']['@id@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu']['@id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu']['@menu_item_number@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu']['@menu_item_number@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu']['@parent_id@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu']['@parent_id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu']['@menu_level@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu']['@menu_level@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu']['@label@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu']['@label@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu']['@is_leaf@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu']['@is_leaf@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu']['@icon_cls@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu']['@icon_cls@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu']['@handler@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu']['@handler@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@menu']['@active@']) === 'undefined'){
           throw "global.jsonInputValidations['@menu']['@active@'] is not found";
       }

    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_menu.js:createmenu:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
        menu_item_number    : req.body.menu_item_number,
        parent_id           : req.body.parent_id,
        menu_level          : req.body.menu_level,
        label               : req.body.label,
        is_leaf             : req.body.is_leaf,
        icon_cls            : req.body.icon_cls,
        handler             : req.body.handler,
        active              : req.body.active
    };
    let rules = {
        menu_item_number : ['required', 'regex:'+global.jsonInputValidations['@menu']['@menu_item_number@']],
        parent_id        : ['required', 'regex:'+global.jsonInputValidations['@menu']['@parent_id@']],
        menu_level       : ['required', 'regex:'+global.jsonInputValidations['@menu']['@menu_level@']],
        label            : ['required', 'regex:'+global.jsonInputValidations['@menu']['@label@']],
        is_leaf          : ['required', 'regex:'+global.jsonInputValidations['@menu']['@is_leaf@']],
        icon_cls         : ['required', 'regex:'+global.jsonInputValidations['@menu']['@icon_cls@']],
        handler          : ['required', 'regex:'+global.jsonInputValidations['@menu']['@handler@']],
        active           : ['required', 'regex:'+global.jsonInputValidations['@menu']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("menu", "select", "checkExistenceByUniqueReference", {
                    "@menu@menu_item_number@" : req.body.menu_item_number
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("menu", "insert", "createNew", {
                                "@menu@menu_item_number@"  : req.body.menu_item_number,
                                "@menu@parent_id@"         : req.body.parent_id,
                                "@menu@menu_level@"        : req.body.menu_level,
                                "@menu@label@"             : req.body.label,
                                "@menu@is_leaf@"           : req.body.is_leaf,
                                "@menu@icon_cls@"          : req.body.icon_cls,
                                "@menu@handler@"           : req.body.handler,
                                "@menu@active@"            : req.body.active
                            });
                            if (sqlObject2.success == true) {
                                results = await connection.query(sqlObject2.sql);
                                await connection.query("COMMIT");
                                var obj = {
                                    "id"                : results.insertId,
                                    "menu_item_number"  : req.body.menu_item_number,
                                    "parent_id"         : req.body.parent_id,
                                    "menu_level"        : req.body.menu_level,
                                    "label"             : req.body.label,
                                    "is_leaf"           : req.body.is_leaf,
                                    "icon_cls"          : req.body.icon_cls,
                                    "handler"           : req.body.handler,
                                    "active"            : req.body.active
                                }
                                utils.rr2r(reply, 201, true, "menu", "createSuccess.txt", 0, obj, [], "ctrl_menu.js:createMenu:execute SQL query", "successfully created new item in menu")
                            } else {
                                utils.rr2r(reply, 500, false, "menu", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_menu.js:createMenu:execute SQL query", "error during creating item for menu")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "menu", "alreadyExists.txt", 1, [], "menu already exists", "ctrl_menu.js:createmenu:execute SQL query", "error during creating item for menu")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu.js:createMenu:execute SQL query", "error during creating item for menu")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "menu", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu.js:createMenu:execute SQL query", "error during creating item for menu")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu", "createError.txt", 1, [], err, "ctrl_menu.js:createMenu:execute SQL query", "error during creating item for menu")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu.js:createMenu:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu.js:createMenu:input request validation")
    }

}

exports.deleteMenuById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@menu']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("menu", "delete", "deleteById", {
                    "@menu@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "menu", "deleteByIdSuccess.txt", 0, results, [], "ctrl_menu.js:deleteMenu:execute SQL query", "successfully deleted item with provided id in menu")
                        } else {
                            utils.rr2r(reply, 200, true, "menu", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_menu.js:deleteMenu:execute SQL query", "no menu item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu.js:deleteMenu:execute SQL query", "error during deleting item with provided id in menu")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "menu", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu.js:deleteMenu:execute SQL query", "error during deleting item with provided id in menu")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu", "deleteByIdError.txt", 1, [], err, "ctrl_menu.js:deleteMenu:execute SQL query", "error during deleting item with provided id in menu")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu.js:deleteMenu:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu.js:deleteMenu:input request validation error")
    }
}

exports.updateMenuById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id                  : req.params.id,
        menu_item_number    : req.body.menu_item_number,
        parent_id           : req.body.parent_id,
        menu_level          : req.body.menu_level,
        label               : req.body.label,
        is_leaf             : req.body.is_leaf,
        icon_cls            : req.body.icon_cls,
        handler             : req.body.handler,
        active              : req.body.active
    };
    let rules = {
        id               : ['required', 'regex:'+global.jsonInputValidations['@menu']['@id@']],
        menu_item_number : [            'regex:'+global.jsonInputValidations['@menu']['@menu_item_number@']],
        parent_id        : [            'regex:'+global.jsonInputValidations['@menu']['@parent_id@']],
        menu_level       : [            'regex:'+global.jsonInputValidations['@menu']['@menu_level@']],
        label            : [            'regex:'+global.jsonInputValidations['@menu']['@label@']],
        is_leaf          : [            'regex:'+global.jsonInputValidations['@menu']['@is_leaf@']],
        icon_cls         : [            'regex:'+global.jsonInputValidations['@menu']['@icon_cls@']],
        handler          : [            'regex:'+global.jsonInputValidations['@menu']['@handler@']],
        active           : [            'regex:'+global.jsonInputValidations['@menu']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("menu", "update", "updateById", {
                    "@menu@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "menu", "updateByIdSuccess.txt", 0, results, [], "ctrl_menu.js:updateMenu:execute SQL query", "successfully updated menu by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "menu", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_menu.js:updateMenu:execute SQL query", "no menu found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "menu", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_menu.js:updateMenu:execute SQL query", "error during updating menu by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "menu", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_menu.js:updateMenu:execute SQL query", "error during updating menu by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "menu", "updateByIdError.txt", 1, [], err, "ctrl_menu.js:updateMenu:execute SQL query", "error during updating menu by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_menu.js:updateMenu:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_menu.js:updateMenu:input request validation error");
    }
}