
const mysqlAsync    = require('../../utils/mysqlAsync');
const utils         = require('../../utils/utils');
const validator     = require('validatorjs');

exports.generateCrudApiCode = async (req, reply) => {
    const user_tenant = req.body.tenant;

    let data = {
        tenant                      : req.body.tenant,
        tableName                   : req.body.tableName,
        displayGroupName            : req.body.displayGroupName,
        uniqueReferenceColumnName   : req.body.uniqueReferenceColumnName
    };
    let rules = {
        tenant                      : ['required', 'regex:'+global.jsonInputValidations['@_code_generator']['@tenant@']],
        tableName                   : ['required', 'regex:'+global.jsonInputValidations['@_code_generator']['@tableName@']],
        displayGroupName            : ['required', 'regex:'+global.jsonInputValidations['@_code_generator']['@displayGroupName@']],
        uniqueReferenceColumnName   : ['required', 'regex:'+global.jsonInputValidations['@_code_generator']['@uniqueReferenceColumnName@']]
    };
    let validation = new validator(data,rules);

    if (validation.passes()) {
        try {
            const connection = await mysqlAsync.connection( global.connection_tenants[user_tenant]["DB"], utils );
            try {
                await connection.query("START TRANSACTION");
                var sqlObject = utils.createSQL("_code_generator", "describe", "describeTable", {
                    "@_code_generator@tableName@" : req.body.tableName
                });
                if (sqlObject.success == true) {
                    try {                
                        results = await connection.query(sqlObject.sql);
                        var tableName                   = req.body.tableName;
                        var displayGroupName            = req.body.displayGroupName;
                        var uniqueReferenceColumnName   = req.body.uniqueReferenceColumnName;
                        var outDir                      = global.generatedCodePath;
                        var resultCodeGeneration        = utils.generateCode(results, user_tenant, tableName, displayGroupName, uniqueReferenceColumnName, global.validationsPath, global.languagesPath, global.templatesPath, outDir);
                        utils.rr2r(reply, 200, true, "_code_generator", "createSuccess.txt", 0, [], [], "ctrl_codeGenerator:generateCrudApiCode:execute SQL query", "Successfully generated code");

                    } catch(e) {
                        await connection.query("ROLLBACK");
                        utils.rr2r(reply, 500, false, "_code_generator", "createError.txt", 1, [], "<" + sqlObject.sql + "> : error : " + e, "ctrl_codeGenerator:generateCrudApiCode:execute SQL query", "error during code creation");
                    }
                } else {
                    utils.rr2r(reply, 500, false, "_code_generator", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_codeGenerator:generateCrudApiCode:execute SQL query", "error during code creation");
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                utils.rr2r(reply, 500, false, "_code_generator", "createError.txt", 1, [], sqlObject.errorMessages, "ctrl_codeGenerator:generateCrudApiCode:execute SQL query", "error during code creation");
            } finally {
                await connection.release();
            }
        } catch (e) {
            utils.rr2r(reply, 404, false, "database", "tenantConnection.txt", 1, [], e, "ctrl_codeGenerator:generateCrudApiCode:create SQL query", "tenant unknown")
        }
    } else {
        utils.rr2r(reply, 404, false, "inputFieldValidation", "inputFieldValidationError.txt", 1, [], validation.errors.errors, "ctrl_codeGenerator:generateCrudApiCode:input request validation")
    }
}
