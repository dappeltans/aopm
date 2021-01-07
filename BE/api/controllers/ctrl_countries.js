const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.getCountries = async (req, reply) => {
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
            debugger
            try {
                //utils.rr2r(reply, 200, true, "countries", "getSuccess.txt", 0, ["regressiontests db selected"], [], "ctrl_countries.js:getCountries:execute SQL query", "successfully selected countries");
                await connection.query("START TRANSACTION");
                var sqlObject = "";
                if ((limit != 0) && (page != 0) && (start >= 0)) {
                    var offset = (page - 1) * limit;
                    sqlObject = utils.createSQL("countries", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("countries", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "countries", "getSuccess.txt", 0, results, [], "ctrl_countries.js:getCountries:execute SQL query", "successfully selected countries");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "countries", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_countries.js:getCountries:execute SQL query", "error during selecting countries")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "countries", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_countries.js:getCountries:execute SQL query", "error during selecting countries");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "countries", "getError.txt", 1, [], err, "ctrl_countries.js:getCountries:execute SQL query", "error during selecting countries");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_countries.js:getCountries:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_countries.js:getCountries:input request validation")
    }
}

exports.getCountriesById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@countries']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("countries", "select", "getById", {
                    "@countries@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "countries", "getByIdSuccess.txt", 0, results, [], "ctrl_countries.js:getCountriesById:execute SQL query", "successfully selected countries by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "countries", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_countries.js:getCountriesById:execute SQL query", "error during selecting countries by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "countries", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_countries.js:getCountriesById:execute SQL query", "error during selecting countries by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "countries", "getByIdError.txt", 1, [], err, "ctrl_countries.js:getCountriesById:execute SQL query", "error during selecting countries by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_countries.js:getCountriesById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_countries.js:getCountriesById:input request validation")
    }
}

exports.createCountries = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
       if (typeof(global.jsonInputValidations['@countries']['@id@']) === 'undefined'){
           throw "global.jsonInputValidations['@countries']['@id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@countries']['@code@']) === 'undefined'){
           throw "global.jsonInputValidations['@countries']['@code@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@countries']['@description@']) === 'undefined'){
           throw "global.jsonInputValidations['@countries']['@description@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@countries']['@active@']) === 'undefined'){
           throw "global.jsonInputValidations['@countries']['@active@'] is not found";
       }

    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_countries.js:createcountries:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
        code           : req.body.code,
        description    : req.body.description,
        active         : req.body.active
    };
    let rules = {
        code        : ['required', 'regex:'+global.jsonInputValidations['@countries']['@code@']],
        description : ['required', 'regex:'+global.jsonInputValidations['@countries']['@description@']],
        active      : ['required', 'regex:'+global.jsonInputValidations['@countries']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("countries", "select", "checkExistenceByUniqueReference", {
                    "@countries@code@" : req.body.code
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("countries", "insert", "createNew", {
                                "@countries@code@"         : req.body.code,
                                "@countries@description@"  : req.body.description,
                                "@countries@active@"       : req.body.active
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
                                utils.rr2r(reply, 201, true, "countries", "createSuccess.txt", 0, obj, [], "ctrl_countries.js:createCountries:execute SQL query", "successfully created new item in countries")
                            } else {
                                utils.rr2r(reply, 500, false, "countries", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_countries.js:createCountries:execute SQL query", "error during creating item for countries")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "countries", "alreadyExists.txt", 1, [], "countries already exists", "ctrl_countries.js:createcountries:execute SQL query", "error during creating item for countries")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "countries", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_countries.js:createCountries:execute SQL query", "error during creating item for countries")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "countries", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_countries.js:createCountries:execute SQL query", "error during creating item for countries")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "countries", "createError.txt", 1, [], err, "ctrl_countries.js:createCountries:execute SQL query", "error during creating item for countries")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_countries.js:createCountries:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_countries.js:createCountries:input request validation")
    }

}

exports.deleteCountriesById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@countries']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("countries", "delete", "deleteById", {
                    "@countries@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "countries", "deleteByIdSuccess.txt", 0, results, [], "ctrl_countries.js:deleteCountries:execute SQL query", "successfully deleted item with provided id in countries")
                        } else {
                            utils.rr2r(reply, 200, true, "countries", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_countries.js:deleteCountries:execute SQL query", "no countries item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "countries", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_countries.js:deleteCountries:execute SQL query", "error during deleting item with provided id in countries")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "countries", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_countries.js:deleteCountries:execute SQL query", "error during deleting item with provided id in countries")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "countries", "deleteByIdError.txt", 1, [], err, "ctrl_countries.js:deleteCountries:execute SQL query", "error during deleting item with provided id in countries")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_countries.js:deleteCountries:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_countries.js:deleteCountries:input request validation error")
    }
}

exports.updateCountriesById = async (req, reply) => {
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
        id          : ['required', 'regex:'+global.jsonInputValidations['@countries']['@id@']],
        code        : [            'regex:'+global.jsonInputValidations['@countries']['@code@']],
        description : [            'regex:'+global.jsonInputValidations['@countries']['@description@']],
        active      : [            'regex:'+global.jsonInputValidations['@countries']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("countries", "update", "updateById", {
                    "@countries@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "countries", "updateByIdSuccess.txt", 0, results, [], "ctrl_countries.js:updateCountries:execute SQL query", "successfully updated countries by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "countries", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_countries.js:updateCountries:execute SQL query", "no countries found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "countries", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_countries.js:updateCountries:execute SQL query", "error during updating countries by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "countries", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_countries.js:updateCountries:execute SQL query", "error during updating countries by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "countries", "updateByIdError.txt", 1, [], err, "ctrl_countries.js:updateCountries:execute SQL query", "error during updating countries by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_countries.js:updateCountries:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_countries.js:updateCountries:input request validation error");
    }
}