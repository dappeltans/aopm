const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.getCustomers = async (req, reply) => {
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
                    sqlObject = utils.createSQL("customers", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("customers", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "customers", "getSuccess.txt", 0, results, [], "ctrl_customers.js:getCustomers:execute SQL query", "successfully selected customers");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "customers", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_customers.js:getCustomers:execute SQL query", "error during selecting customers")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "customers", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_customers.js:getCustomers:execute SQL query", "error during selecting customers");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "customers", "getError.txt", 1, [], err, "ctrl_customers.js:getCustomers:execute SQL query", "error during selecting customers");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_customers.js:getCustomers:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_customers.js:getCustomers:input request validation")
    }
}

exports.getCustomersById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@customers']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("customers", "select", "getById", {
                    "@customers@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "customers", "getByIdSuccess.txt", 0, results, [], "ctrl_customers.js:getCustomersById:execute SQL query", "successfully selected customers by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "customers", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_customers.js:getCustomersById:execute SQL query", "error during selecting customers by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "customers", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_customers.js:getCustomersById:execute SQL query", "error during selecting customers by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "customers", "getByIdError.txt", 1, [], err, "ctrl_customers.js:getCustomersById:execute SQL query", "error during selecting customers by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_customers.js:getCustomersById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_customers.js:getCustomersById:input request validation")
    }
}

exports.createCustomers = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
       if (typeof(global.jsonInputValidations['@customers']['@id@']) === 'undefined'){
           throw "global.jsonInputValidations['@customers']['@id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@customers']['@name@']) === 'undefined'){
           throw "global.jsonInputValidations['@customers']['@name@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@customers']['@code@']) === 'undefined'){
           throw "global.jsonInputValidations['@customers']['@code@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@customers']['@fgcolor@']) === 'undefined'){
           throw "global.jsonInputValidations['@customers']['@fgcolor@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@customers']['@bgcolor@']) === 'undefined'){
           throw "global.jsonInputValidations['@customers']['@bgcolor@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@customers']['@ou_id@']) === 'undefined'){
           throw "global.jsonInputValidations['@customers']['@ou_id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@customers']['@logo@']) === 'undefined'){
           throw "global.jsonInputValidations['@customers']['@logo@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@customers']['@active@']) === 'undefined'){
           throw "global.jsonInputValidations['@customers']['@active@'] is not found";
       }

    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_customers.js:createcustomers:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
        name       : req.body.name,
        code       : req.body.code,
        fgcolor    : req.body.fgcolor,
        bgcolor    : req.body.bgcolor,
        ou_id      : req.body.ou_id,
        logo       : req.body.logo,
        active     : req.body.active
    };
    let rules = {
        name    : ['required', 'regex:'+global.jsonInputValidations['@customers']['@name@']],
        code    : ['required', 'regex:'+global.jsonInputValidations['@customers']['@code@']],
        fgcolor : ['required', 'regex:'+global.jsonInputValidations['@customers']['@fgcolor@']],
        bgcolor : ['required', 'regex:'+global.jsonInputValidations['@customers']['@bgcolor@']],
        ou_id   : ['required', 'regex:'+global.jsonInputValidations['@customers']['@ou_id@']],
        logo    : ['required', 'regex:'+global.jsonInputValidations['@customers']['@logo@']],
        active  : ['required', 'regex:'+global.jsonInputValidations['@customers']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("customers", "select", "checkExistenceByUniqueReference", {
                    "@customers@name@" : req.body.name
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("customers", "insert", "createNew", {
                                "@customers@name@"     : req.body.name,
                                "@customers@code@"     : req.body.code,
                                "@customers@fgcolor@"  : req.body.fgcolor,
                                "@customers@bgcolor@"  : req.body.bgcolor,
                                "@customers@ou_id@"    : req.body.ou_id,
                                "@customers@logo@"     : req.body.logo,
                                "@customers@active@"   : req.body.active
                            });
                            if (sqlObject2.success == true) {
                                results = await connection.query(sqlObject2.sql);
                                await connection.query("COMMIT");
                                var obj = {
                                    "id"       : results.insertId,
                                    "name"     : req.body.name,
                                    "code"     : req.body.code,
                                    "fgcolor"  : req.body.fgcolor,
                                    "bgcolor"  : req.body.bgcolor,
                                    "ou_id"    : req.body.ou_id,
                                    "logo"     : req.body.logo,
                                    "active"   : req.body.active
                                }
                                utils.rr2r(reply, 201, true, "customers", "createSuccess.txt", 0, obj, [], "ctrl_customers.js:createCustomers:execute SQL query", "successfully created new item in customers")
                            } else {
                                utils.rr2r(reply, 500, false, "customers", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_customers.js:createCustomers:execute SQL query", "error during creating item for customers")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "customers", "alreadyExists.txt", 1, [], "customers already exists", "ctrl_customers.js:createcustomers:execute SQL query", "error during creating item for customers")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "customers", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_customers.js:createCustomers:execute SQL query", "error during creating item for customers")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "customers", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_customers.js:createCustomers:execute SQL query", "error during creating item for customers")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "customers", "createError.txt", 1, [], err, "ctrl_customers.js:createCustomers:execute SQL query", "error during creating item for customers")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_customers.js:createCustomers:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_customers.js:createCustomers:input request validation")
    }

}

exports.deleteCustomersById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@customers']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("customers", "delete", "deleteById", {
                    "@customers@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "customers", "deleteByIdSuccess.txt", 0, results, [], "ctrl_customers.js:deleteCustomers:execute SQL query", "successfully deleted item with provided id in customers")
                        } else {
                            utils.rr2r(reply, 200, true, "customers", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_customers.js:deleteCustomers:execute SQL query", "no customers item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "customers", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_customers.js:deleteCustomers:execute SQL query", "error during deleting item with provided id in customers")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "customers", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_customers.js:deleteCustomers:execute SQL query", "error during deleting item with provided id in customers")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "customers", "deleteByIdError.txt", 1, [], err, "ctrl_customers.js:deleteCustomers:execute SQL query", "error during deleting item with provided id in customers")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_customers.js:deleteCustomers:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_customers.js:deleteCustomers:input request validation error")
    }
}

exports.updateCustomersById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id         : req.params.id,
        name       : req.body.name,
        code       : req.body.code,
        fgcolor    : req.body.fgcolor,
        bgcolor    : req.body.bgcolor,
        ou_id      : req.body.ou_id,
        logo       : req.body.logo,
        active     : req.body.active
    };
    let rules = {
        id      : ['required', 'regex:'+global.jsonInputValidations['@customers']['@id@']],
        name    : [            'regex:'+global.jsonInputValidations['@customers']['@name@']],
        code    : [            'regex:'+global.jsonInputValidations['@customers']['@code@']],
        fgcolor : [            'regex:'+global.jsonInputValidations['@customers']['@fgcolor@']],
        bgcolor : [            'regex:'+global.jsonInputValidations['@customers']['@bgcolor@']],
        ou_id   : [            'regex:'+global.jsonInputValidations['@customers']['@ou_id@']],
        logo    : [            'regex:'+global.jsonInputValidations['@customers']['@logo@']],
        active  : [            'regex:'+global.jsonInputValidations['@customers']['@active@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("customers", "update", "updateById", {
                    "@customers@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "customers", "updateByIdSuccess.txt", 0, results, [], "ctrl_customers.js:updateCustomers:execute SQL query", "successfully updated customers by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "customers", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_customers.js:updateCustomers:execute SQL query", "no customers found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "customers", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_customers.js:updateCustomers:execute SQL query", "error during updating customers by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "customers", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_customers.js:updateCustomers:execute SQL query", "error during updating customers by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "customers", "updateByIdError.txt", 1, [], err, "ctrl_customers.js:updateCustomers:execute SQL query", "error during updating customers by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_customers.js:updateCustomers:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_customers.js:updateCustomers:input request validation error");
    }
}