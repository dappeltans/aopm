const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.getOrganisational_units = async (req, reply) => {
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
                    sqlObject = utils.createSQL("organisational_units", "select", "getAllOffsetLimit", {
                        "@pagination@offset@"   : offset,
                        "@pagination@limit@"    : limit
                    });
                } else {
                    sqlObject = utils.createSQL("organisational_units", "select", "getAll", {});
                }
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "organisational_units", "getSuccess.txt", 0, results, [], "ctrl_organisational_units.js:getOrganisational_units:execute SQL query", "successfully selected organisational_units");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "organisational_units", "getError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_organisational_units.js:getOrganisational_units:execute SQL query", "error during selecting organisational_units")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "organisational_units", "getError.txt", 1, [], sqlObject.errorMessages, "ctrl_organisational_units.js:getOrganisational_units:execute SQL query", "error during selecting organisational_units");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "organisational_units", "getError.txt", 1, [], err, "ctrl_organisational_units.js:getOrganisational_units:execute SQL query", "error during selecting organisational_units");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_organisational_units.js:getOrganisational_units:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_organisational_units.js:getOrganisational_units:input request validation")
    }
}

exports.getOrganisational_unitsById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");

                var sqlObject = utils.createSQL("organisational_units", "select", "getById", {
                    "@organisational_units@id@" : req.params.id
                });
                
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        await connection.query("COMMIT");
                        utils.rr2r(reply, 200, true, "organisational_units", "getByIdSuccess.txt", 0, results, [], "ctrl_organisational_units.js:getOrganisational_unitsById:execute SQL query", "successfully selected organisational_units by provided id");
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "organisational_units", "getByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_organisational_units.js:getOrganisational_unitsById:execute SQL query", "error during selecting organisational_units by provided id")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "organisational_units", "getByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_organisational_units.js:getOrganisational_unitsById:execute SQL query", "error during selecting organisational_units by provided id");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "organisational_units", "getByIdError.txt", 1, [], err, "ctrl_organisational_units.js:getOrganisational_unitsById:execute SQL query", "error during selecting organisational_units by provided id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_organisational_units.js:getOrganisational_unitsById:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_organisational_units.js:getOrganisational_unitsById:input request validation")
    }
}

exports.createOrganisational_units = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";

    try {
       if (typeof(global.jsonInputValidations['@organisational_units']['@id@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@country_id@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@country_id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@city@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@city@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@name@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@name@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@code@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@code@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@address_line_1@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@address_line_1@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@address_line_2@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@address_line_2@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@address_line_3@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@address_line_3@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@address_line_4@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@address_line_4@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@contact_person_name@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@contact_person_name@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@contact_person_email@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@contact_person_email@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@contact_person_phone@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@contact_person_phone@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@active@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@active@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@is_leaf@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@is_leaf@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@parent_id@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@parent_id@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@level@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@level@'] is not found";
       }
       if (typeof(global.jsonInputValidations['@organisational_units']['@reference@']) === 'undefined'){
           throw "global.jsonInputValidations['@organisational_units']['@reference@'] is not found";
       }

    } catch (e){
        utils.rr2r(reply, 404, false, "inputFieldValidation", "unrecognizedField.txt", 1, [], e, "ctrl_organisational_units.js:createorganisational_units:check input field validation rules existence", "error found during input fields validations")
    }

    // Validating the user input values received against the defined input_validation rules
    let data = {
        country_id              : req.body.country_id,
        city                    : req.body.city,
        name                    : req.body.name,
        code                    : req.body.code,
        address_line_1          : req.body.address_line_1,
        address_line_2          : req.body.address_line_2,
        address_line_3          : req.body.address_line_3,
        address_line_4          : req.body.address_line_4,
        contact_person_name     : req.body.contact_person_name,
        contact_person_email    : req.body.contact_person_email,
        contact_person_phone    : req.body.contact_person_phone,
        active                  : req.body.active,
        is_leaf                 : req.body.is_leaf,
        parent_id               : req.body.parent_id,
        level                   : req.body.level,
        reference               : req.body.reference
    };
    let rules = {
        country_id           : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@country_id@']],
        city                 : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@city@']],
        name                 : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@name@']],
        code                 : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@code@']],
        address_line_1       : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@address_line_1@']],
        address_line_2       : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@address_line_2@']],
        address_line_3       : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@address_line_3@']],
        address_line_4       : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@address_line_4@']],
        contact_person_name  : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@contact_person_name@']],
        contact_person_email : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@contact_person_email@']],
        contact_person_phone : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@contact_person_phone@']],
        active               : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@active@']],
        is_leaf              : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@is_leaf@']],
        parent_id            : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@parent_id@']],
        level                : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@level@']],
        reference            : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@reference@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("organisational_units", "select", "checkExistenceByUniqueReference", {
                    "@organisational_units@name@" : req.body.name
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        if (results[0]["total"] == 0){
                            sqlObject2 = utils.createSQL("organisational_units", "insert", "createNew", {
                                "@organisational_units@country_id@"            : req.body.country_id,
                                "@organisational_units@city@"                  : req.body.city,
                                "@organisational_units@name@"                  : req.body.name,
                                "@organisational_units@code@"                  : req.body.code,
                                "@organisational_units@address_line_1@"        : req.body.address_line_1,
                                "@organisational_units@address_line_2@"        : req.body.address_line_2,
                                "@organisational_units@address_line_3@"        : req.body.address_line_3,
                                "@organisational_units@address_line_4@"        : req.body.address_line_4,
                                "@organisational_units@contact_person_name@"   : req.body.contact_person_name,
                                "@organisational_units@contact_person_email@"  : req.body.contact_person_email,
                                "@organisational_units@contact_person_phone@"  : req.body.contact_person_phone,
                                "@organisational_units@active@"                : req.body.active,
                                "@organisational_units@is_leaf@"               : req.body.is_leaf,
                                "@organisational_units@parent_id@"             : req.body.parent_id,
                                "@organisational_units@level@"                 : req.body.level,
                                "@organisational_units@reference@"             : req.body.reference
                            });
                            if (sqlObject2.success == true) {
                                results = await connection.query(sqlObject2.sql);
                                await connection.query("COMMIT");
                                var obj = {
                                    "id"                    : results.insertId,
                                    "country_id"            : req.body.country_id,
                                    "city"                  : req.body.city,
                                    "name"                  : req.body.name,
                                    "code"                  : req.body.code,
                                    "address_line_1"        : req.body.address_line_1,
                                    "address_line_2"        : req.body.address_line_2,
                                    "address_line_3"        : req.body.address_line_3,
                                    "address_line_4"        : req.body.address_line_4,
                                    "contact_person_name"   : req.body.contact_person_name,
                                    "contact_person_email"  : req.body.contact_person_email,
                                    "contact_person_phone"  : req.body.contact_person_phone,
                                    "active"                : req.body.active,
                                    "is_leaf"               : req.body.is_leaf,
                                    "parent_id"             : req.body.parent_id,
                                    "level"                 : req.body.level,
                                    "reference"             : req.body.reference
                                }
                                utils.rr2r(reply, 201, true, "organisational_units", "createSuccess.txt", 0, obj, [], "ctrl_organisational_units.js:createOrganisational_units:execute SQL query", "successfully created new item in organisational_units")
                            } else {
                                utils.rr2r(reply, 500, false, "organisational_units", "createError.txt", 1, [], sqlObject2.errorMessages, "ctrl_organisational_units.js:createOrganisational_units:execute SQL query", "error during creating item for organisational_units")
                            }
                        } else {
                            utils.rr2r(reply, 409, false, "organisational_units", "alreadyExists.txt", 1, [], "organisational_units already exists", "ctrl_organisational_units.js:createorganisational_units:execute SQL query", "error during creating item for organisational_units")
                        }
                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "organisational_units", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_organisational_units.js:createOrganisational_units:execute SQL query", "error during creating item for organisational_units")
                    }
                } else {
                    utils.rr2r(reply, 500, false, "organisational_units", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_organisational_units.js:createOrganisational_units:execute SQL query", "error during creating item for organisational_units")
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "organisational_units", "createError.txt", 1, [], err, "ctrl_organisational_units.js:createOrganisational_units:execute SQL query", "error during creating item for organisational_units")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_organisational_units.js:createOrganisational_units:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_organisational_units.js:createOrganisational_units:input request validation")
    }

}

exports.deleteOrganisational_unitsById = async (req,reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id: req.params.id
    };
    let rules = {
        id: ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@id@']],
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("organisational_units", "delete", "deleteById", {
                    "@organisational_units@id@" : req.params.id
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "organisational_units", "deleteByIdSuccess.txt", 0, results, [], "ctrl_organisational_units.js:deleteOrganisational_units:execute SQL query", "successfully deleted item with provided id in organisational_units")
                        } else {
                            utils.rr2r(reply, 200, true, "organisational_units", "noIdToDeleteSuccess.txt", 0, results, [], "ctrl_organisational_units.js:deleteOrganisational_units:execute SQL query", "no organisational_units item found with provided id to delete")
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "organisational_units", "deleteByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_organisational_units.js:deleteOrganisational_units:execute SQL query", "error during deleting item with provided id in organisational_units")
                    }
                } else {
                    await connection.query("ROLLBACK");
                    utils.rr2r(reply, 500, false, "organisational_units", "deleteByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_organisational_units.js:deleteOrganisational_units:execute SQL query", "error during deleting item with provided id in organisational_units")
                }           
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "organisational_units", "deleteByIdError.txt", 1, [], err, "ctrl_organisational_units.js:deleteOrganisational_units:execute SQL query", "error during deleting item with provided id in organisational_units")
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_organisational_units.js:deleteOrganisational_units:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_organisational_units.js:deleteOrganisational_units:input request validation error")
    }
}

exports.updateOrganisational_unitsById = async (req, reply) => {
    const user_tenant = req.userData.tenant;
    var returnMessage = "";
    // Validating the user input values received against the defined input_validation rules
    let data = {
        id                      : req.params.id,
        country_id              : req.body.country_id,
        city                    : req.body.city,
        name                    : req.body.name,
        code                    : req.body.code,
        address_line_1          : req.body.address_line_1,
        address_line_2          : req.body.address_line_2,
        address_line_3          : req.body.address_line_3,
        address_line_4          : req.body.address_line_4,
        contact_person_name     : req.body.contact_person_name,
        contact_person_email    : req.body.contact_person_email,
        contact_person_phone    : req.body.contact_person_phone,
        active                  : req.body.active,
        is_leaf                 : req.body.is_leaf,
        parent_id               : req.body.parent_id,
        level                   : req.body.level,
        reference               : req.body.reference
    };
    let rules = {
        id                   : ['required', 'regex:'+global.jsonInputValidations['@organisational_units']['@id@']],
        country_id           : [            'regex:'+global.jsonInputValidations['@organisational_units']['@country_id@']],
        city                 : [            'regex:'+global.jsonInputValidations['@organisational_units']['@city@']],
        name                 : [            'regex:'+global.jsonInputValidations['@organisational_units']['@name@']],
        code                 : [            'regex:'+global.jsonInputValidations['@organisational_units']['@code@']],
        address_line_1       : [            'regex:'+global.jsonInputValidations['@organisational_units']['@address_line_1@']],
        address_line_2       : [            'regex:'+global.jsonInputValidations['@organisational_units']['@address_line_2@']],
        address_line_3       : [            'regex:'+global.jsonInputValidations['@organisational_units']['@address_line_3@']],
        address_line_4       : [            'regex:'+global.jsonInputValidations['@organisational_units']['@address_line_4@']],
        contact_person_name  : [            'regex:'+global.jsonInputValidations['@organisational_units']['@contact_person_name@']],
        contact_person_email : [            'regex:'+global.jsonInputValidations['@organisational_units']['@contact_person_email@']],
        contact_person_phone : [            'regex:'+global.jsonInputValidations['@organisational_units']['@contact_person_phone@']],
        active               : [            'regex:'+global.jsonInputValidations['@organisational_units']['@active@']],
        is_leaf              : [            'regex:'+global.jsonInputValidations['@organisational_units']['@is_leaf@']],
        parent_id            : [            'regex:'+global.jsonInputValidations['@organisational_units']['@parent_id@']],
        level                : [            'regex:'+global.jsonInputValidations['@organisational_units']['@level@']],
        reference            : [            'regex:'+global.jsonInputValidations['@organisational_units']['@reference@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {  
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("organisational_units", "update", "updateById", {
                    "@organisational_units@id@" : req.params.id,
                    "@fields@values@" : req.body
                });
                if (sqlObject.success == true) {
                    try {
                        results = await connection.query(sqlObject.sql);
                        connection.query("COMMIT");
                        if (results.affectedRows > 0) {
                            utils.rr2r(reply, 200, true, "organisational_units", "updateByIdSuccess.txt", 0, results, [], "ctrl_organisational_units.js:updateOrganisational_units:execute SQL query", "successfully updated organisational_units by provided item id");
                        } else {
                            utils.rr2r(reply, 200, true, "organisational_units", "noIdToUpdateSuccess.txt", 0, results, [], "ctrl_organisational_units.js:updateOrganisational_units:execute SQL query", "no organisational_units found with provided item id to update");
                        }
                    } catch(e) {
                        connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "organisational_units", "updateByIdError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e.sqlMessage, "ctrl_organisational_units.js:updateOrganisational_units:execute SQL query", "error during updating organisational_units by provided item id");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "organisational_units", "updateByIdError.txt", 1, [], sqlObject.errorMessages, "ctrl_organisational_units.js:updateOrganisational_units:execute SQL query", "error during updating organisational_units by provided item id");
                }
                await connection.query("COMMIT");
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "organisational_units", "updateByIdError.txt", 1, [], err, "ctrl_organisational_units.js:updateOrganisational_units:execute SQL query", "error during updating organisational_units by provided item id");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_organisational_units.js:updateOrganisational_units:create SQL query", "tenant unknown");
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_organisational_units.js:updateOrganisational_units:input request validation error");
    }
}