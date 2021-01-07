const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.getLanguages = async (req, reply) => {
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
                    sqlObject = utils.createSQL("languages", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("languages", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "languages", "getSuccess.txt", 0, results, [], "ctrl_languages.js:getLanguages:execute SQL query", "successfully selected languages");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "languages", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_languages.js:getLanguages:execute SQL query", "error during selecting languages")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "languages", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_languages.js:getLanguages:execute SQL query", "error during selecting languages");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "languages", "getError.txt", 1, [], err, "ctrl_languages.js:getLanguages:execute SQL query", "error during selecting languages");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_languages.js:getLanguages:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_languages.js:getLanguages:input request validation")
    }
}

exports.getLanguagesById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@languages']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("languages", "select", "getById", {
                    "@languages@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "languages", "getByIdSuccess.txt", 0, results, [], "ctrl_languages.js:getLanguagesById:execute SQL query", "successfully selected languages by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "languages", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_languages.js:getLanguagesById:execute SQL query", "error during selecting languages by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "languages", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_languages.js:getLanguagesById:execute SQL query", "error during selecting languages by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "languages", "getByIdError.txt", 1, [], err, "ctrl_languages.js:getLanguagesById:execute SQL query", "error during selecting languages by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_languages.js:getLanguagesById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_languages.js:getLanguagesById:input request validation")
    }
}

exports.createLanguages = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
       if (typeof(global.jsonInputValidations['@languages']['@id@']) === 'undefined'){
           throw "global.jsonInputValidations['@languages']['@id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@languages']['@code@']) === 'undefined'){
           throw "global.jsonInputValidations['@languages']['@code@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@languages']['@description@']) === 'undefined'){
           throw "global.jsonInputValidations['@languages']['@description@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@languages']['@active@']) === 'undefined'){
           throw "global.jsonInputValidations['@languages']['@active@'] is not found";
       }

    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_languages.js:createlanguages:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
        code           : req.body.code,
        description    : req.body.description,
        active         : req.body.active
    };
    let rules = {
        code        : ['required', 'regex:'+global.jsonInputValidations['@languages']['@code@']],
        description : ['required', 'regex:'+global.jsonInputValidations['@languages']['@description@']],
        active      : ['required', 'regex:'+global.jsonInputValidations['@languages']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("languages", "select", "checkExistenceByUniqueReference", {
                    "@languages@code@" : req.body.code
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("languages", "insert", "createNew", {
                                "@languages@code@"         : req.body.code,
                                "@languages@description@"  : req.body.description,
                                "@languages@active@"       : req.body.active
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
                                utils.rr2r(reply, 201, true, "languages", "createSuccess.txt", 0, obj, [], "ctrl_languages.js:createLanguages:execute SQL query", "successfully created new item in languages")
                            } else {
                                utils.rr2r(reply, 500, false, "languages", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_languages.js:createLanguages:execute SQL query", "error during creating item for languages")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "languages", "alreadyExists.txt", 1, [], "languages already exists", "ctrl_languages.js:createlanguages:execute SQL query", "error during creating item for languages")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "languages", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_languages.js:createLanguages:execute SQL query", "error during creating item for languages")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "languages", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_languages.js:createLanguages:execute SQL query", "error during creating item for languages")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "languages", "createError.txt", 1, [], err, "ctrl_languages.js:createLanguages:execute SQL query", "error during creating item for languages")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_languages.js:createLanguages:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_languages.js:createLanguages:input request validation")
    }

}

exports.deleteLanguagesById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@languages']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("languages", "delete", "deleteById", {
                    "@languages@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "languages", "deleteByIdSuccess.txt", 0, results, [], "ctrl_languages.js:deleteLanguages:execute SQL query", "successfully deleted item with provided id in languages")
                        } else {
                            utils.rr2r(reply, 200, true, "languages", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_languages.js:deleteLanguages:execute SQL query", "no languages item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "languages", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_languages.js:deleteLanguages:execute SQL query", "error during deleting item with provided id in languages")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "languages", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_languages.js:deleteLanguages:execute SQL query", "error during deleting item with provided id in languages")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "languages", "deleteByIdError.txt", 1, [], err, "ctrl_languages.js:deleteLanguages:execute SQL query", "error during deleting item with provided id in languages")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_languages.js:deleteLanguages:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_languages.js:deleteLanguages:input request validation error")
    }
}

exports.updateLanguagesById = async (req, reply) => {
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
        id          : ['required', 'regex:'+global.jsonInputValidations['@languages']['@id@']],
        code        : [            'regex:'+global.jsonInputValidations['@languages']['@code@']],
        description : [            'regex:'+global.jsonInputValidations['@languages']['@description@']],
        active      : [            'regex:'+global.jsonInputValidations['@languages']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("languages", "update", "updateById", {
                    "@languages@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "languages", "updateByIdSuccess.txt", 0, results, [], "ctrl_languages.js:updateLanguages:execute SQL query", "successfully updated languages by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "languages", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_languages.js:updateLanguages:execute SQL query", "no languages found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "languages", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_languages.js:updateLanguages:execute SQL query", "error during updating languages by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "languages", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_languages.js:updateLanguages:execute SQL query", "error during updating languages by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "languages", "updateByIdError.txt", 1, [], err, "ctrl_languages.js:updateLanguages:execute SQL query", "error during updating languages by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_languages.js:updateLanguages:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_languages.js:updateLanguages:input request validation error");
    }
}