  /**************/
 /* FUNCTIONS  */
/**************/

const fs            = require("fs");            // module used to interact with the filesystem
const moment        = require('moment');        // module used to do datatime calculations
const os            = require('os');            // module used to retrieve os variables like hostname
const mysql         = require('mysql');         // module used to connect to a mysql database
const jwt           = require('jsonwebtoken');  // module to generate jwt token or verify given token
const randexp       = require('randexp');       // module to generate strings that comply to a given regexp

const logger        = global.log;

const createRegressionTestSsoTicket = () => {
    let token_created = jwt.sign(
        {
            email_address: "regressiontests@gmail.com",
            user_id: 0,
            tenant: "regressiontests"
        },
        global.PRIVATE_KEY,
        {
            algorithm: 'RS256',
            expiresIn: process.env.REGRESSIONTESTS_JWT_KEY_EXPIRATION
        }
    );
    return token_created;
};

const isError = (obj) => {
    return Object.prototype.toString.call(obj) === "[object Error]";
};

const escapeRegExp = (s) => {
    return s.replace(/[-/\\^$*+?.()|[\]{}]"/g, '\\$&')
};

const escapeSubstitute = (s) => {
    return s.replace(/\$/g, '$$$$');
};

const replace_string = (target, string_to_replace, replacement) => {
    var relit= escapeRegExp(string_to_replace);
    var sub= escapeSubstitute(replacement);
    var re= new RegExp(relit, 'g');
    return target.replace(re, sub);
};

const replace_string_simple = (target, string_to_replace, replacement) => {
    var result = target;
    result = result.split(string_to_replace).join(replacement);
    return result;
};

const log = (level, nameVar, data) => {
    var obj = {};
    if (isObject(data)) {
        data = JSON.stringify(data);
    }
    obj[nameVar] = data;
    //global.logger.log(level, obj);

    switch(level.toLowerCase()) {
        case 'debug':
            logger.debug(nameVar + " : " + data);
            break;
        case 'info':
            logger.info(nameVar + " : " + data);
            break;
        case 'fatal':
            logger.fatal(nameVar + " : " + data);
            break;
        case 'error':
            logger.error(nameVar + " : " + data);
            break;
        default:
            logger.error(nameVar + " : " + data);
      } 
};

const capitalize = (s) =>{
    // capitalize first character in a given string
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const replaceUnderscoreBySpace = (s) => {
    if (typeof s !== 'string') return '';
    return s.replace(/_/g, " ");
};

const makeSingleString = (s) => {
    if (typeof s !== 'string') return '';
    if (s.slice(-1) == 's') {
        return s.slice(0,-1);
    }
    return s;
};

const getArchiveDirectories = (path, rootPath) => {
    //console.log('getDirectories');
    //console.log('Archive path : '+global.archivePath);
    
    var dirsInfo = [];
    var i = 0;
    path = addSlash(path);
    
    //console.log('path : '+path);
    //console.log('rootPath : '+rootPath);
    
    fs.readdirSync(path).filter(function (file) {
        var folder = '';
        folder = path + file;
        //console.log("folder to  investigate = "+folder);

        if (fs.statSync(folder).isDirectory()){
            //console.log("folder : "+folder+" is an existing directory");
            var filestats = fs.statSync(folder);
            var filePath = folder;
            var shortFilePath =  filePath.substring(rootPath.length); // filepath is the full path but without the root directory name
            //console.log("filePath:"+filePath);
            //filePath = encodeURI(filePath);
            var full_link = "<a href=\"#\" >"+shortFilePath+"</a>";
            var short_link = "<a href=\"#\" >"+file+"</a>";
            
            dirsInfo[i] = {
                full_name: folder,
                short_name: file,
                link: full_link,
                mtime: filestats.mtime
            };
            //console.log(fs.statSync(path+'/'+file));
            i++;
        }
        dirsInfo.sort(function(a, b) {
            return b.mtime.getTime() - a.mtime.getTime();
        });
    })
    //console.log(dirsInfo)
    return dirsInfo;
};
    
const getArchiveFiles = (path, rootPath) => {
    var filesInfo = [];
    var i = 0;
    path = addSlash(path);
    fs.readdirSync(path).filter(function (file) {
        var folder = '';
        folder = path + file;
        
        if (fs.statSync(folder).isFile()){
            var filestats = fs.statSync(folder);
            var fileSize = filestats.size;
            var modifiedTime = filestats.mtime;
            var modifiedTime=moment(modifiedTime).format("YYYY-MM-DD HH:mm:ss");

            var filePath = folder;
            filePath = filePath.substring(rootPath.length);
            filePath = encodeURI(filePath);
            filePath = filePath.replace("#","%23");
            var fileName = file;
            var link = "<a href=\""+global.baseUrl+"/file?file\="+filePath+"&rootdir=archive\" target=\"_blank\">"+fileName+"</a>";
            filesInfo[i] = {
                //name: path+'/'+file,
                name: link,		
                size: fileSize,
                mtime: modifiedTime
            };
            //console.log(fs.statSync(path+'/'+file));
            i++;
        }
    })
    return filesInfo;
};

const zeroPad = (num, places) => {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

const pad = (value, size, padchar, direction) => {
    // value 		: The string to pad
    // size 		: The size the output should have. Padding with a character might be necessary or not depending on the length of the vlaue given and the size the field should have.
    //            	  In case the length of the given value is bigger that the size value, no padding is done and the given value as  input will be returned
    // padchar		: The character to use for  padding. Typically this will be a space  or a zero
    // direction	: The direction to pad. L or R. Left or Right. If another value than L or R is given then right padding will be used.
    var s = value+"";
    padchar = padchar + "";
    while (s.length < size) {
        if (direction == "L") {
            s = padchar + s;
        } else {
            s = s + padchar;
        }
    }
    return s;
};

const spacePad = (val, places) => {
    var zero = places - val.toString().length + 1;
    return val + Array(+(zero > 0 && zero)).join(" ");
};

const createUniqueID = (sep) => {
    
    function chr4(){
        return Math.random().toString(16).slice(-4);
    }
    var seperator = sep || ''; 		
    return chr4() + 
           seperator + chr4() +
           seperator + chr4() +
           seperator + chr4();
};

const createDateTimeStamp = () => {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
        hours = '' + d.getHours(),
        minutes = '' + d.getMinutes(),
        seconds = '' + d.getSeconds()
        ;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;
    
    var datePart = year+month+day;
    var timePart = hours+minutes+seconds;

    return datePart+'-'+timePart;
};

const addSlash = (path) => {
    var lastChar = path.charAt(path.length-1);
    if ((lastChar !== '/') && (lastChar !== '\\')) {
        path = path + "/";
    }
    return path;
};

const isEmptyObject = (obj) => {
    var name;
    for (name in obj) {
        if (obj.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
};

const isObject = (obj) => {
    return obj === Object(obj);
};

const columnToLetter = (column) =>{
    var temp, letter = '';
    while (column > 0)
    {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
};

const letterToColumn = (letter) => {
    var column = 0, length = letter.length;
    for (var i = 0; i < length; i++)
    {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
};

const getMysqlDataTypesTranslations = (inputValidationsPath) => {
    var jsonString       = '';
    var jsonObject       = '';
    var inputValidationsPath = addSlash(inputValidationsPath);
    var fileToParse = inputValidationsPath + 'mysql_definitions.json';
    // Reeading the content of the input validations file in a json object
    jsonString = '';
    if (fs.existsSync(fileToParse)) {
        //console.log("File "+inputValidationsFileToParse + " exists.");
        if (fs.statSync(fileToParse).isFile()){
            //console.log("File "+queryFileToParse + " exists and is a readable file.");
            jsonString = fs.readFileSync(fileToParse, 'utf8');
            jsonString = jsonString.toString();
        }
    }
    jsonObject = JSON.parse(jsonString);
    // console.log(jsonObject);
    return jsonObject;
};

const getLanguage = (languagesPath, lang) => {
    var jsonString       = '';
    var jsonObject       = {};
    const inputFileToParse = addSlash(languagesPath) + lang + '.json';

    if (fs.existsSync(inputFileToParse)) {
        if (fs.statSync(inputFileToParse).isFile()){
            jsonString = jsonString = readJsonFromFile(inputFileToParse);
        }
    }

    if (isJsonString(jsonString)) {
        log("debug", "utils.js:getLanguage:jsonString", `${inputFileToParse} is a valid JSON string` );
        jsonObject = JSON.parse(jsonString);
    } else {
        log("error", "utils.js:getLanguage:jsonString", `${inputFileToParse} is NOT a valid JSON string` );
    }
    return jsonObject;
};

const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

const readJsonFromFile = (fileToRead) => {
    var jsonString  = '';
    var fileContent = '';
    var line        = '';
    var jsonObject = {};
    if (fs.existsSync(fileToRead)) {
        if (fs.statSync(fileToRead).isFile()){
            fileContent = fs.readFileSync(fileToRead, 'utf8');
            var array = [];
            if(fileContent.length > 0){
                array = fileContent.toString().split("\n");
                line = "";
                for (var j = 0; j < array.length; j++) {
                    line = array[j];
                    line = line.replace(/\r?\n|\r/g, "");
                    line = line.trim();
                    jsonString = jsonString + line + " ";
                }
                jsonString = jsonString.trim();
            }
        }
    }
    return jsonString;
};

const getInputValidations = (inputValidationsPath) => {
    var jsonString  = '';
    var jsonObject  = {};
    log("debug", "utils.js:getInputValidations:inputValidationsPath", inputValidationsPath );

    const inputFileToParse = addSlash(inputValidationsPath) + 'input_validations.json';


    if (fs.existsSync(inputFileToParse)) {
        if (fs.statSync(inputFileToParse).isFile()){
            jsonString = jsonString = readJsonFromFile(inputFileToParse);
        }
    }

    if (isJsonString(jsonString)) {
        log("debug", "utils.js:getInputValidations:jsonString", `${inputFileToParse} is a valid JSON string` );
        jsonObject = JSON.parse(jsonString);
        
    } else {
        log("error", "utils.js:getInputValidations:jsonString", `${inputFileToParse} is NOT a valid JSON string` );
    }
    return jsonObject;
};

const getAnonymizationRules = (anonymizationPath) => {
    var jsonString  = '';
    var jsonObject  = {};

    const inputFileToParse = addSlash(anonymizationPath) + 'data_anonymization_rules.json';

    if (fs.existsSync(inputFileToParse)) {
        if (fs.statSync(inputFileToParse).isFile()){
            jsonString = jsonString = readJsonFromFile(inputFileToParse);
        }
    }

    if (isJsonString(jsonString)) {
        log("debug", "utils.js:getAnonymizationRules:jsonString", `${inputFileToParse} is a valid JSON string` );
        jsonObject = JSON.parse(jsonString);
    } else {
        log("error", "utils.js:getAnonymizationRules:jsonString", `${inputFileToParse} is NOT a valid JSON string` );
    }

    jsonObject = JSON.parse(jsonString);
    return jsonObject;
};

const createQueriesObject = (queriesPath) => {
    const dir = queriesPath;
    const fs = require('fs');
    const dirCont = fs.readdirSync( dir );
    const files = dirCont.filter( ( elm ) => /^sql\_.*\.json$/i.test(elm) );

    var inputFileToParse = '';
    var line = '';
    var queryCategory = '';
    var jsonString = '';
    var fileContent = "";
    var jsonObject = {};
    var queries = {};

    for (var i = 0; i < files.length; i++) {
        fileContent = "";
        jsonString = "";
        queryCategory = files[i].substring(4, files[i].length - 5); // "sql_" needs to be substracted from file name in the beginning as well as ".json" at the end. Example sql_countries.json

        inputFileToParse = addSlash(dir) + files[i];

        if (fs.existsSync(inputFileToParse)) {
            if (fs.statSync(inputFileToParse).isFile()){
                jsonString = jsonString = readJsonFromFile(inputFileToParse);
            }
        }
    
        if (isJsonString(jsonString)) {
            log("debug", "utils.js:createQueriesObject:jsonString", `${inputFileToParse} is a valid JSON string` );
            jsonObject = JSON.parse(jsonString);
            queries[queryCategory] = jsonObject;
        } else {
            log("error", "utils.js:createQueriesObject:jsonString", `${inputFileToParse} is NOT a valid JSON string` );
        }
    }
    return queries;
};

const getAnonymizedData = (anonymizationPath, tableName) => {
    var fileContent = '';

    var fileToParse = addSlash(anonymizationPath) + tableName+'.csv';
    var platform =  os.platform();
    var newLine = "";
    switch (platform)
    {
        case "aix":
            newLine = "\n";
            break;
        case "darwin":
            newLine = "\n";
            break;
        case "freebsd": 
            newLine = "\n";
            break;
        case "linux":
            newLine = "\n";    
            break;
        case "openbsd":
            newLine = "\n";
            break;
        case "sunos": 
            newLine = "\n";
            break;
        case "win32": 
            newLine = "\r\n";
            break;
       default: 
           ;
    }

    if (fs.existsSync(fileToParse)) {
        if (fs.statSync(fileToParse).isFile()){
            fileContent = fs.readFileSync(fileToParse, 'utf8').split(newLine);
        }
    }
    return fileContent;
};

const createTableAnonymizationFieldValuesToUse = (tenant, tableName, insertId, insertedFields) => {
    if (typeof global.anonymizationRules[tableName] != "undefined") {
        var rulesToApply = global.anonymizationRules[tableName];
        var arrFields = {};
        var tableField = "";
        var anoValueToUse = "";
        for (var key of Object.keys(rulesToApply)) {
            //console.log(key + " -> " + rulesToApply[key]["ano_rule"]);
            tableField = key;
            anoValueToUse = "";
            var ano_rule = rulesToApply[key]["ano_rule"];
            var arrRuleParts = ano_rule.split("&");
            for (var i = 0; i < arrRuleParts.length;i++){
                var ruleParts = arrRuleParts[i].split(":");
                //console.log(ruleParts[0] + '->' + ruleParts[1]);
                var ruleType  = ruleParts[0];
                var ruleValue = ruleParts[1];
                switch(ruleType) {
                    case "fixedString":
                        anoValueToUse = anoValueToUse + ruleValue;
                        break;
                    case "anolookup":
                        switch(ruleValue){
                            case "firstnames":
                                anoValueToUse = anoValueToUse + global.ad_firstnames[Math.floor(Math.random() * global.ad_firstnames.length)];
                                break;
                            case "lastnames":
                                anoValueToUse = anoValueToUse + global.ad_lastnames[Math.floor(Math.random() * global.ad_lastnames.length)];
                                break;
                            case "customers":
                                anoValueToUse = anoValueToUse + global.ad_customers[Math.floor(Math.random() * global.ad_customers.length)];
                                break;
                        }                        
                        break;
                    case "counter":
                        anoValueToUse = anoValueToUse + insertId;
                        break;
                    case "anofield":
                        if (typeof arrFields[ruleValue] == "undefined"){
                            anoValueToUse = anoValueToUse + "";
                        } else {
                            anoValueToUse = anoValueToUse + arrFields[ruleValue];
                        }
                        break;
                    case "reffield":
                        anoValueToUse = anoValueToUse + insertedFields[ruleValue];
                        break;
                    default:
                      // code block
                }
            }
            arrFields[tableField] = anoValueToUse;
        }

        var sqlSetFieldValuesPart = "";
        for(var property in arrFields) {
            sqlSetFieldValuesPart = sqlSetFieldValuesPart + "`@" + property + "` = " + "'" + arrFields[property] + "',";
        }
        sqlSetFieldValuesPart = sqlSetFieldValuesPart.slice(0, -1);

        global.connection_tenants[tenant]["DB"].getConnection( function(error, tempConnection){
            if(error){
                return false;
            } else {
                //console.log('Mysql connection established.');
                const tableNameIdRef = "@"+tableName+"@id@";
                var tableJsonObj = {};
                tableJsonObj[tableNameIdRef] = insertId;
                tableJsonObj["@fields@values@"] = sqlSetFieldValuesPart;
                
                tableJsonObj = JSON.stringify(tableJsonObj);
                console.log("tableJsonObj:");
                console.log(tableJsonObj);

                // var sqlObject = createSQL(tableName, "update", "updateById", tableJsonObj);
                var sqlObject = createSQL(tableName, "update", "updateById", {
                    [tableNameIdRef] : insertId,
                    "@fields@values@" : sqlSetFieldValuesPart
                });
                console.log("sqlObject:");
                console.log(sqlObject);
                if (sqlObject.success == true) {
                    tempConnection.query(sqlObject.sql, function(err, results){
                        if (err) {
                            console.log("anonymization error");
                            console.log(err);
                            tempConnection.release();
                            return false;
                        } else {
                            console.log("anonymization success");
                            var data = results;
                            tempConnection.release();
                            return true;
                        }
                    });
                } else {
                    tempConnection.release();
                    return false;
                }
            }            
        });    
    } else {
        return true;
    }

};

const createSQL = (file, type, sql, dynParamValues) => {
    var sqlQuery = '';
    var inputValidations = global.jsonInputValidations;
    var sqlReturnObject  = {
        sql : '',
        success: false,
        errorMessages: []
    };

    try {
        sqlQuery = global.sqls[file][type][sql];
    } catch (e) {
        log("error","utils.js:createSQL():lookup dynamic SQL to execute ", e);
        log("error","utils.js:createSQL():lookup dynamic SQL to execute : file           :", file);
        log("error","utils.js:createSQL():lookup dynamic SQL to execute : type           :", type);
        log("error","utils.js:createSQL():lookup dynamic SQL to execute : sql            :", sql);
        log("error","utils.js:createSQL():lookup dynamic SQL to execute : dynParamValues :", dynParamValues);
        throw "no sql statement retrieved for sql reference global.sqls["+file+"]["+type+"]["+sql+"]";
        throw e;
    }
    if (typeof(sqlQuery) == "undefined") {
        log("error","utils.js:createSQL():lookup dynamic SQL to execute ", "no sql retrieved");
        log("error","utils.js:createSQL():lookup dynamic SQL to execute : file           :", file);
        log("error","utils.js:createSQL():lookup dynamic SQL to execute : type           :", type);
        log("error","utils.js:createSQL():lookup dynamic SQL to execute : sql            :", sql);
        log("error","utils.js:createSQL():lookup dynamic SQL to execute : dynParamValues :", dynParamValues);
        throw "no sql statement retrieved for sql reference global.sqls["+file+"]["+type+"]["+sql+"]";
    }
    var sqlString = '';
    var index, len;
    var re = /@.*?@.*?@/g;
    var dynFieldRegexpCheck = /^@.*?@.*?@$$/;
    var arrDynamicFields = sqlQuery.match(re);
    var strDynamicFieldValueInError = '';
    var strDynamicFieldInError = '';
    var arrDynamicFieldValuesInError = [];
    
    // Check query parameter format to see that it contains the format @<query json file>@<parameter name>@
    var dynParamValuesCheck = true;
    var tmp = "";
    var inputValidationFilePart = '';
    var inputValidationParameterNamePart = '';
    var arrInputValidationParts = [];
    var strInputValidationRegExp = '';
    var fieldRef = "";
    var p1 = '';
    var p2 = '';
    var errorMessage = '';

    if (arrDynamicFields){
        for (index = 0, len = arrDynamicFields.length; index < len; ++index) {
            // The array arrDynamicFields contains the names of the dynamic fields mentioned in the SQLquery requested. Eg @login@email@ 
            // console.log("Going to check validation rule for field : " + arrDynamicFields[index]);
            if (dynFieldRegexpCheck.test(arrDynamicFields[index])){
                if (arrDynamicFields[index] === "@fields@values@") {
                    // When being in this block, then the dynamic field found in the SQLquery is equal to @fields@values@
                    var sqlSetFieldValuesPart = "";
                    if (typeof(dynParamValues["@fields@values@"]) == 'object') {
                        for(var property in dynParamValues["@fields@values@"]) {
                            var parameterValue = mysql.escape(dynParamValues["@fields@values@"][property]);
                            if (property != 'id') {
                                if (((parameterValue.slice(0,1) == "'") && (parameterValue.slice(-1) == "'")) || ((parameterValue.slice(0,1) == '"') && (parameterValue.slice(-1) == '"'))){
                                    sqlSetFieldValuesPart = sqlSetFieldValuesPart + "`" + property+ "`" + " = " + "'" + parameterValue.slice(1,-1) + "',";
                                } else {
                                    sqlSetFieldValuesPart = sqlSetFieldValuesPart + "`" + property+ "`" + " = " + "'" + parameterValue + "',";
                                }
                            }
                        }
                        sqlSetFieldValuesPart = sqlSetFieldValuesPart.slice(0, -1);
                    } else {
                        sqlSetFieldValuesPart = dynParamValues["@fields@values@"];
                    }
                    //console.log("sqlSetFieldValuesPart:");
                    //console.log(sqlSetFieldValuesPart);
                    /*
                    sqlQuery = sqlQuery.replace("@fields@values@",sqlSetFieldValuesPart); 
                    The above line is commmented out as the replace function has issues when the string to replace with ends with a $ sign.
                    Using the following code:
                        <script>
                            var myStr = 'freedom is not worth having if it does not include the freedom to make mistakes.';
                            var sql = "'K$'";
                            //sql = sql.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            //document.write('<p>' + sql + '</p>');
                            //var newStr = myStr.replace(/freedom/g, sql);
                            var newStr = myStr.split('freedom').join(sql);
                            
                            // Printing the modified string
                            document.write('<p>' + newStr + '</p>');
                        </script>
                    on the website https://www.tutorialrepublic.com/codelab.php?topic=faq&file=javascript-regex-to-replace-all-occurrences-of-a-string
                    one can test the incorrect behaviour of str.replace function.
                    */
                   sqlQuery = sqlQuery.split("@fields@values@").join(sqlSetFieldValuesPart);                  
                } else {
                    // When being in this block, then the dynamic field found in the SQLquery is of the correct format @...@...@ and not equal to @fields@values@
                    fieldRef = arrDynamicFields[index];
                    tmp = fieldRef;
                    tmp = tmp.slice(1,-1);
                    arrInputValidationParts = tmp.split("@");
                    // console.log(arrInputValidationParts);
                    p1 = '@' + arrInputValidationParts[0];          // example p1= @login
                    p2 = '@' + arrInputValidationParts[1] + '@';    // example p1= @email_address@
                    
                    if (typeof inputValidations[p1] != "undefined") {
                        // console.log("Field " + p1 + " found in input_vaildations.json file");
                        if (typeof inputValidations[p1][p2] != "undefined") {
                            // console.log("Field " + p2 + " found in input_vaildations.json file");
                            strInputValidationRegExp = inputValidations[p1][p2];
                            // console.log(dynParamValues);
                            // console.log("Field " + fieldRef + " with value " + dynParamValues[fieldRef] + " to check against validation rule " + strInputValidationRegExp);
                            dynParamValuesCheck = true;
                        } else {
                            errorMessage = "Field " + fieldRef + " does not have an input validation rule.";
                            // console.log(errorMessage);
                            arrDynamicFieldValuesInError.push(errorMessage);
                            dynParamValuesCheck = false;
                        }   
                    } else {
                        errorMessage = "Field " + fieldRef + " does not have an input validation rule.";
                        // console.log(errorMessage);
                        arrDynamicFieldValuesInError.push(errorMessage);
                        dynParamValuesCheck = false;
                    }
                    
                    if (dynParamValuesCheck == true){
                        strInputValidationRegExp = strInputValidationRegExp.slice(1,-1);
                        var regExpToCheck = new RegExp(strInputValidationRegExp);
                        //console.log("regExpToCheck = " + strInputValidationRegExp); 
                        if (typeof dynParamValues[fieldRef] != "undefined"){ //  example of p2 = @first_name@
                            if (regExpToCheck.test(dynParamValues[fieldRef])) {
                                //console.log("RegExp " + regExpToCheck + " on field value \"" + dynParamValues[fieldRef] +"\" returned true.");
                                var escapedInput = mysql.escape(dynParamValues[fieldRef]);
                                if (escapedInput.length > 0) {
                                    if (((escapedInput.slice(0,1) == "'") && (escapedInput.slice(-1) == "'")) || ((escapedInput.slice(0,1) == '"') && (escapedInput.slice(-1) == '"'))) {
                                        escapedInput = escapedInput.slice(1,-1);
                                    }
                                }
                                /*
                                sqlQuery = sqlQuery.replace(fieldRef,escapedInput);
                                The above line is commmented out as the replace function has issues when the string to replace with ends with a $ sign.
                                Using the following code:
                                    <script>
                                        var myStr = 'freedom is not worth having if it does not include the freedom to make mistakes.';
                                        var sql = "'K$'";
                                        //sql = sql.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                        //document.write('<p>' + sql + '</p>');
                                        //var newStr = myStr.replace(/freedom/g, sql);
                                        var newStr = myStr.split('freedom').join(sql);
                                        
                                        // Printing the modified string
                                        document.write('<p>' + newStr + '</p>');
                                    </script>
                                on the website https://www.tutorialrepublic.com/codelab.php?topic=faq&file=javascript-regex-to-replace-all-occurrences-of-a-string
                                one can test the incorrect behaviour of str.replace function.
                                */
                                sqlQuery = sqlQuery.split(fieldRef).join(escapedInput);
                            } else {
                                strDynamicFieldInError      = fieldRef;
                                strDynamicFieldValueInError = dynParamValues[fieldRef];
                                errorMessage = "Field " + strDynamicFieldInError + " contains non allowed value " + strDynamicFieldValueInError;
                                arrDynamicFieldValuesInError.push(errorMessage);
                                //console.log("RegExp " + regExpToCheck + " on field value \"" + dynParamValues[fieldRef] +"\" returned false.");
                            }
                        } else {
                            sqlQuery = sqlQuery.replace(arrDynamicFields[index],'');
                        }
                    }
                }
            } else {
                // console.log("RegExp test field string @...@...@ on field \"" + arrDynamicFields[index] +"\" returned false.");
                dynParamValuesCheck = false;
                errorMessage = "Field " + fieldRef + " does not comply to @...@...@ syntax.";
                arrDynamicFieldValuesInError.push(errorMessage);
            }
        }

    } else {

    }

    log("debug","utils.js:createSQL():sqlQuery", sqlQuery);
    
    if (arrDynamicFieldValuesInError.length === 0) {
        sqlReturnObject.sql = sqlQuery;
        sqlReturnObject.success = true;
        sqlReturnObject.errorMessages = [];
    } else {
        sqlReturnObject.sql = sqlQuery;
        sqlReturnObject.success = false;
        sqlReturnObject.errorMessages = arrDynamicFieldValuesInError;
    }
    return sqlReturnObject;
};

const createAlphabethicalMatrix = (queryResult) => {
    var resultMatrix = [];
    var emptyCustomer = {
        id        : '' ,
        active    : '' ,
        name      : '' ,
        code      : '' ,
        fgcolor   : '' ,
        bgcolor   : '' ,
        ou_id     : '' ,
        ou_code   : '' ,
        logo      : '' 
    };
    var matrix = {
        L_OTHERS : [],
        L_09 : [],
        L_A : [], L_B : [], L_C : [], L_D : [], L_E : [], L_F : [], L_G : [], L_H : [], L_I : [], L_J : [], L_K : [], L_L : [], L_M : [], 
        L_N : [], L_O : [], L_P : [], L_Q : [], L_R : [], L_S : [], L_T : [], L_U : [], L_V : [], L_W : [], L_X : [], L_Y : [], L_Z : [],
        nbrItems : {
            L_OTHERS : 0,
            L_09 : 0,
            L_A : 0, L_B : 0, L_C : 0, L_D : 0, L_E : 0, L_F : 0, L_G : 0, L_H : 0, L_I : 0, L_J : 0, L_K : 0, L_L : 0, L_M : 0, 
            L_N : 0, L_O : 0, L_P : 0, L_Q : 0, L_R : 0, L_S : 0, L_T : 0, L_U : 0, L_V : 0, L_W : 0, L_X : 0, L_Y : 0, L_Z : 0
        }
    };
    var maxNbr = 0;
    var i = 0;
    for (i = 0; i < queryResult.length;i++){
        var matrixKey = '';
        var customerCode = queryResult[i]['code'];
        var customerName = queryResult[i]['name'];
        var firstLetter = customerCode.slice(0,1);
        firstLetter = firstLetter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        firstLetter = firstLetter.toUpperCase();
        if (firstLetter.match(/^[A-Z]/)) {
            matrixKey = "L_" + firstLetter;
        } else {
            if (firstLetter.match(/^[0-9]/)) {
                matrixKey = "L_09";
            } else {
                matrixKey = 'L_OTHERS';
            }
        }
        matrix['nbrItems'][matrixKey]++;
        if (maxNbr < matrix['nbrItems'][matrixKey]) {
            maxNbr = matrix['nbrItems'][matrixKey];
        }
        matrix[matrixKey].push(queryResult[i]);
    }
    for (i = 0; i < maxNbr;i++){
        resultMatrix[i] = {};
        resultMatrix[i]['L_OTHERS'] = emptyCustomer;
        resultMatrix[i]['L_09'] = emptyCustomer;
        for (var j =65; j < 91; j++) {
            firstLetter = String.fromCharCode(j);
            matrixKey = "L_" + firstLetter;
            resultMatrix[i][matrixKey] = emptyCustomer;
        }
    }
    for (i = 0; i < maxNbr;i++){
        if (typeof(matrix['L_OTHERS'][i]) != "undefined") {
            resultMatrix[i]['L_OTHERS'] = JSON.stringify(matrix['L_OTHERS'][i]);
        } else {
            resultMatrix[i]['L_OTHERS'] = JSON.stringify(emptyCustomer);
        }
        if (typeof(matrix['L_09'][i]) != "undefined") {
            resultMatrix[i]['L_09'] = JSON.stringify(matrix['L_09'][i]);
        } else {
            resultMatrix[i]['L_09'] = JSON.stringify(emptyCustomer);
        }
        for (var j =65; j < 91; j++) {
            firstLetter = String.fromCharCode(j);
            matrixKey = "L_" + firstLetter;
            if (typeof(matrix[matrixKey][i]) != "undefined") {
                resultMatrix[i][matrixKey] = JSON.stringify(matrix[matrixKey][i]);
            } else {
                resultMatrix[i][matrixKey] = JSON.stringify(emptyCustomer);
            }
        }
    }
    return resultMatrix;
};

const retRes = (res, statusCode, success, message, nbrErrors, jsonData, errors) => {
    var myErrors = errors;
    if (isError(errors)) {
        myErrors = JSON.parse(JSON.stringify(errors, Object.getOwnPropertyNames(errors)));
    }
    
    var o = {};
    o.success = success;
    o.message = message || '';
    o.nbrErrors = nbrErrors || 0;
    if (global.evironment != "PROD"){
        o.errors = myErrors
    }
    o.data = jsonData || [];
    return res.status(statusCode).json(o);
};

const generateCode = (results, tenant, tableName, groupName, columnName, validationsPath, languagesPath, templatesPath, outDir) => {
    var contentTemplate                                 = "";
    var contentTemplateObj                              = {};
    var templateLong                                    = "";
    var templateShort                                   = "";
    var outputFile                                      = "";
    var outputFileToGenerate                            = "";
    var tableDefinition                                 = [];
    var pathGeneratedcodeBE                             = addSlash(outDir) + "BE";
    var pathGeneratedcodeFE                             = addSlash(outDir) + "FE";

    var mysql_data_type_definitions                     = getMysqlDataTypesTranslations(validationsPath); // Translate database table column definition into open API field definitions
    const input_validations_json_filename               =  "input_validations.json";

    tableName                                           = tableName.toLowerCase();
    groupName                                           = groupName.toLowerCase();
    columnName                                          = columnName.toLowerCase();
    
    var tableName_ori                                   = tableName;
    var tableName_capital                               = capitalize(tableName_ori);

    var fieldName                                       = columnName;
    var fieldName_capital                               = capitalize(columnName);

    var ctrl_create_input_validations_check             = "";
    var ctrl_create_data                                = "";
    var ctrl_create_data_rules                          = "";
    var ctrl_create_data_returned                       = "";

    var patternToApplyOri                               = "";
    var patternToApply                                  = "";
    var swaggerPatternToApply                           = "";
    var arrArguments                                    = [];
    var definitionRetrieved                             = "";
    var definitionToApply                               = "";
    var swaggerType                                     = "";
    var inputValidation                                 = "";
    var regex                                           = "";
    var match                                           = [];
    var columnType                                      = "";
    var columnTypeShort                                 = "";
    var columnCommment                                  = "";
    var nullable                                        = "";
    var columnArguments                                 = "";
    var indexOfOpenBracket                              = 0;
    var indexOfClosingBracket                           = 0;
    var defaultCharToUseForTestingPurposes              = "";

    const lang                                          = "EN";

    var LANGUAGE = getLanguage(languagesPath, lang);

    var user_tenant = tenant;
               
    columnType      = "";
    columnCommment  = "";
    nullable        = "";
    var columnDefinitions = {};
    var maxColumnLength   = 0;
    var minColumnLength   = 0;
    for (var i = 0; i < results.length; i++) {
        patternToApplyOri       = "";
        patternToApply          = "";
        swaggerPatternToApply   = "";
        arrArguments            = [];
        definitionRetrieved     = "";
        definitionToApply       = "";

        columnName              = results[i].Field.toLowerCase();
        columnType              = results[i].Type;
        nullable                = results[i].Null.toLowerCase();
        columnCommment          = results[i].Comment;

        if (nullable === "no") {
            minColumnLength = 1;
        }

        if (columnName.length > maxColumnLength) {
            maxColumnLength = columnName.length;
        }

        if (columnName.slice(0,1) != "@") {
            swaggerType             = "";
            inputValidation         = "";
            regex                   = "";
            match                   = [];
            columnTypeShort         = "";
            columnArguments         = "";
            indexOfOpenBracket      = 0;
            indexOfClosingBracket   = 0;
            indexOfOpenBracket      = columnType.indexOf('(');

            if (indexOfOpenBracket==-1){
                // The column type does not have brackets
                columnTypeShort = columnType;
            }else{
                // The column type contains brackets
                indexOfClosingBracket = columnType.indexOf(')');
                columnArguments = columnType.substring(indexOfOpenBracket+1,indexOfClosingBracket);
                columnTypeShort = columnType.substring(0,indexOfOpenBracket);
            }
            //log("debug","utils.js:generateCode:checking table column types",columnType+" has type "+columnTypeShort+" and arguments "+columnArguments); 
            definitionRetrieved                     = "";                    
            definitionRetrieved                     = mysql_data_type_definitions[columnTypeShort];
            definitionToApply                       = Object.assign({}, definitionRetrieved);
            patternToApplyOri                       = definitionRetrieved["pattern"];
            extjsFieldTypeToApply                   = definitionRetrieved["extjstype"];
            extjsFieldMaxLengthToApply              = definitionRetrieved["extjsMaxLength"] || "";
            extjsMatcherToApply                     = "";
            defaultStringToUseForTestingPurposes    = definitionRetrieved["defaultStringToUseForTestingPurposes"] || "";

            swaggerPatternToApply                   = patternToApplyOri.slice(1,-1);
            arrArguments                            = [];
            arrArguments                            = columnArguments.split(",");

            switch(definitionRetrieved["nbrArgs"]) {
                case "0":
                    // code block
                    swaggerPatternToApply       = "pattern: '"+swaggerPatternToApply+"'";
                    extjsMatcherToApply         = swaggerPatternToApply;
                    break;
                case "1":
                    // code block
                    patternToApply              = patternToApplyOri.replace("L", minColumnLength);
                    swaggerPatternToApply       = swaggerPatternToApply.replace("L", minColumnLength);
                    extjsMatcherToApply         = swaggerPatternToApply;
                    swaggerPatternToApply       = "pattern: '"+swaggerPatternToApply+"'";
                    break;
                case "2":
                    // code block
                    patternToApply              = patternToApplyOri.replace("L", minColumnLength);
                    patternToApply              = patternToApply.replace("X", arrArguments[0]);
                    extjsFieldMaxLengthToApply  = extjsFieldMaxLengthToApply.replace("X", arrArguments[0]);
                    swaggerPatternToApply       = swaggerPatternToApply.replace("L", minColumnLength);
                    swaggerPatternToApply       = swaggerPatternToApply.replace("X", arrArguments[0]);
                    extjsMatcherToApply         = swaggerPatternToApply;
                    swaggerPatternToApply       = "pattern: '"+swaggerPatternToApply+"'";
                    break;
                case "3":
                    // code block
                    patternToApply              = patternToApplyOri.replace("L", minColumnLength);
                    patternToApply              = patternToApply.replace("X", arrArguments[0]);
                    patternToApply              = patternToApply.replace("Y", arrArguments[1]);
                    swaggerPatternToApply       = swaggerPatternToApply.replace("L", minColumnLength);
                    swaggerPatternToApply       = swaggerPatternToApply.replace("X", arrArguments[0]);
                    swaggerPatternToApply       = swaggerPatternToApply.replace("Y", arrArguments[1]);
                    extjsMatcherToApply         = swaggerPatternToApply;
                    swaggerPatternToApply       = "pattern: '"+swaggerPatternToApply+"'";
                    break;
                case "X":
                    // code block
                    swaggerPatternToApply       = "enum: ["+columnArguments+"]";
                    extjsMatcherToApply         = "[" + columnArguments + "]";
                    break;
                default:
                    // code block
            } 
            definitionToApply["pattern"]                                = patternToApply;
            definitionToApply["swaggerPattern"]                         = swaggerPatternToApply;
            definitionToApply["extjsFieldType"]                         = extjsFieldTypeToApply;
            definitionToApply["extjsMatcher"]                           = extjsMatcherToApply;
            definitionToApply["extjsFieldMaxLengthToApply"]             = extjsFieldMaxLengthToApply;
            definitionToApply["defaultStringToUseForTestingPurposes"]   = defaultStringToUseForTestingPurposes;

            columnDefinitions[columnName]       = {
                "mysqlColumnTypeShort"     : columnTypeShort,
                "mysqlColumnTypeArguments" : columnArguments,
                "mySqlColumnNullable"      : nullable,
                "mysqlColumnComment"       : columnCommment,
                "codeDefinitions"          : definitionToApply
            };
            //log("debug", "utils.js:generateCode:column definitions to apply", definitionToApply);
        }
    }

    route_table_column_definitions                      = createRoutesColumnDefinitions(columnDefinitions, maxColumnLength);

    ctrl_create_input_validations_check                 = createControllersCreateInputValidationsCheck(columnDefinitions, tableName, maxColumnLength);
    ctrl_create_data                                    = createControllersCreateData(columnDefinitions, tableName,maxColumnLength);
    ctrl_create_data_rules                              = createControllersCreateDataRules(columnDefinitions, tableName, maxColumnLength);
    ctrl_create_dynamic_parameters_sql                  = createControllersCreateDynamicParametersSql(columnDefinitions, tableName, maxColumnLength);
    ctrl_create_data_returned                           = createControllersCreateDataReturned(columnDefinitions, tableName, maxColumnLength);
    ctrl_update_data                                    = createControllersUpdateData(columnDefinitions, tableName,maxColumnLength);
    ctrl_update_data_rules                              = createControllersUpdateDataRules(columnDefinitions, tableName, maxColumnLength);
    ctrl_update_data_returned                           = createControllersUpdateDataReturned(columnDefinitions, tableName,maxColumnLength);

    list_table_fields                                   = createSqlListTableFields(columnDefinitions, maxColumnLength);
    list_table_fields_without_id                        = createSqlListTableFieldsWithoutId(columnDefinitions, maxColumnLength);
    list_table_field_references_without_id              = createSqlListTableFieldReferencesWithoutId(columnDefinitions, tableName, maxColumnLength);

    route_table_list_columns_without_id_column          = createRouteTableListColumnsWithoutIdColumn(columnDefinitions, tableName, maxColumnLength);

    inputValidationsObject                              = getInputValidations(validationsPath);

    extjs_model_fields                                  = createExtjsModelFields(columnDefinitions, tableName);           
    extjs_model_field_validators                        = createExtjsModelFieldValidators(columnDefinitions, tableName);     
    
    tests_post_payload_correct                          = createTestsPostPayloadCorrect(columnDefinitions);
    tests_post_payload_incorrect_exceed_field_length    = createTestsPostPayloadIncorrectExceedFieldLength(columnDefinitions);
    tests_post_payload_incorrect_empty_field            = createTestsPostPayloadIncorrectEmptyField(columnDefinitions);
    tests_post_payload_correct_update                   = createTestsPostPayloadCorrect(columnDefinitions);

    var stringsToReplaceBE = {
        '$field_name$'                                          : fieldName,
        '$Field_name$'                                          : fieldName_capital,
        '$group_name$'                                          : groupName,
        '$table_name$'                                          : tableName_ori,
        '$Table_name$'                                          : tableName_capital,
        '$ctrl_create_input_validations_check$'                 : ctrl_create_input_validations_check,
        '$ctrl_create_data$'                                    : ctrl_create_data,
        '$ctrl_create_data_rules$'                              : ctrl_create_data_rules,
        '$ctrl_update_data$'                                    : ctrl_update_data,
        '$ctrl_update_data_rules$'                              : ctrl_update_data_rules,
        '$ctrl_update_data_returned$'                           : ctrl_update_data_returned,
        '$ctrl_create_dynamic_parameters_sql$'                  : ctrl_create_dynamic_parameters_sql,
        '$ctrl_create_data_returned$'                           : ctrl_create_data_returned,
        '$route_table_column_definitions$'                      : route_table_column_definitions,
        '$list_table_fields$'                                   : list_table_fields,
        '$list_table_fields_without_id$'                        : list_table_fields_without_id,
        '$list_table_field_references_without_id$'              : list_table_field_references_without_id,
        '$route_table_list_columns_without_id_colum$'           : route_table_list_columns_without_id_column,
        '$tests_post_payload_correct$'                          : tests_post_payload_correct,
        '$tests_post_payload_incorrect_exceed_field_length$'    : tests_post_payload_incorrect_exceed_field_length,
        '$tests_post_payload_incorrect_empty_field$'            : tests_post_payload_incorrect_empty_field,
        '$tests_post_payload_correct_update$'                   : tests_post_payload_correct_update
    };

    var stringsToReplaceFE = {
        '$extjs_model_fields$'                                  : extjs_model_fields,
        '$extjs_model_field_validators$'                        : extjs_model_field_validators,
        '$table_name$'                                          : tableName_ori,
        '$Table_name$'                                          : tableName_capital
    };

    // Note: In the above keys to search, a $ sign is used at the begin and end instead of the first used < and > signs.
    //       The reason for this is that the visual studio code error recognition engine would otherwise show a lot of errors in the template files.
    //       Only one template file shows errors currently as   
    
    // The list of template files to use for code generation API. In these templates, the above mentioned strings will be replaced where found in hte content of the template files..
    // Note: the input_validations.json file has other logic to fill and will be filled after the normal templates are used for code generation. 
    var tplController       = {template: 'controllers.tpl.js',        prefix: 'ctrl_',            extension:'.js'};
    var tplENsuccess        = {template: lang + '_success.tpl.json',  prefix: lang + '_success_', extension:'.json'};
    var tplENerror          = {template: lang + '_error.tpl.json',    prefix: lang + '_error_',   extension:'.json'};
    var tplRoutes           = {template: 'routes.tpl.js',             prefix: 'routes_',          extension:'.js'};
    var tplQueries          = {template: 'sqls.tpl.json',             prefix: 'sql_',             extension:'.json'};

    var tplExtjsModel       = {template: 'model.tpl.js',              prefix: 'model',            extension:'.js'};
    var tplExtjsStore       = {template: 'store.tpl.js',              prefix: 'store',            extension:'.js'};
    //var tplExtjsView        = {template: 'queries.tpl.json',          prefix: 'view',             extension:'.json'};       
    
    var tplTests            = {template: 'tests.tpl.js',              prefix: '',                 extension:'.test.js'};

    var arrTemplatesBE = [tplController, tplENsuccess, tplENerror, tplRoutes, tplQueries, tplTests];
    var arrTemplatesFE = [tplExtjsModel, tplExtjsStore];

    if (arrTemplatesBE.length > 0) {

        for (var i = 0; i < arrTemplatesBE.length; i++) {
            templateShort   = arrTemplatesBE[i]['template']
            templateLong    = addSlash(templatesPathBE) + templateShort;
            contentTemplate = fs.readFileSync(templateLong, 'utf8');
            contentTemplate = contentTemplate.toString();
            for(var j in stringsToReplaceBE){
                //console.log("Going to replace string " + j + " by " + stringsToReplaceBE[j] + " in " + templateLong);
                contentTemplate = replace_string_simple(contentTemplate, j, stringsToReplaceBE[j]);
            }
            var outputFileShort = arrTemplatesBE[i]['prefix'] + tableName + arrTemplatesBE[i]['extension'];
            outputFile = addSlash(pathGeneratedcodeBE) + outputFileShort;

            log("debug", "utils.js:generateCode:outputFile", outputFile);

            //console.log("contentTemplate");
            //console.log(contentTemplate);

            if (arrTemplatesBE[i]['template'] === (lang + "_success.tpl.json")){
                contentTemplateObj = JSON.parse(contentTemplate);
                // LANGUAGE contains the current EN.json dictionay info. In case an table name already existed with nfo, it will be overwritten.S
                LANGUAGE["successMessages"][tableName_ori] = contentTemplateObj;
            } else {
                if (arrTemplatesBE[i]['template'] === (lang +  "_error.tpl.json")){
                    contentTemplateObj = JSON.parse(contentTemplate);
                    LANGUAGE["errorMessages"][tableName_ori] = contentTemplateObj;
                } else {
                    fs.writeFileSync(outputFile, contentTemplate, 'UTF-8', (err) => {
                        // throws an error, you could also catch it here
                        if (err) throw err;
                        // success case, the file was saved
                        log("debug", "utils.js:generateCode:write code", `code saved for ${outputFileShort}!`);
                    });
                }
            }
        }
        
        // Adding the input validations in the input_validations.json file
        var prop = "@" + tableName_ori;
        var f = "";
        inputValidationsObject[prop] = {};
        Object.keys(columnDefinitions).forEach(function(key,index) {
            f = "@" + key + "@";
            inputValidationsObject[prop][f] = columnDefinitions[key]["codeDefinitions"]["pattern"];
        });
        
        // Creating the EN.json file
        var outputFileLanguageJson = addSlash(pathGeneratedcodeBE) + lang + ".json";
        fs.writeFileSync(outputFileLanguageJson, JSON.stringify(LANGUAGE, undefined, 4), 'UTF-8', (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
            // success case, the file was saved
            log("debug", "utils.js:generateCode:write code", `code saved for ${lang}.json!`);
        });
        
        var outputFileInputValidationJson = addSlash(pathGeneratedcodeBE) + input_validations_json_filename;
        fs.writeFileSync(outputFileInputValidationJson, JSON.stringify(inputValidationsObject, undefined, 4), 'UTF-8', (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;
            // success case, the file was saved
            log("debug", "utils.js:generateCode:write code", `code saved for ${input_validations_json_filename}!`);
        });
    }

    if (arrTemplatesFE.length > 0) {

        for (var i = 0; i < arrTemplatesFE.length; i++) {
            templateShort   = arrTemplatesFE[i]['template']
            console.log(templateShort);
            templateLong    = addSlash(templatesPathFE) + templateShort;
            contentTemplate = fs.readFileSync(templateLong, 'utf8');
            contentTemplate = contentTemplate.toString();
            for(var j in stringsToReplaceFE){
                contentTemplate = replace_string_simple(contentTemplate, j, stringsToReplaceFE[j]);
            }
            var outputFileShort = arrTemplatesFE[i]['prefix'] + tableName_capital + arrTemplatesFE[i]['extension'];
            outputFile = addSlash(pathGeneratedcodeFE) + outputFileShort;

            log("debug", "utils.js:generateCode:outputFile", outputFile);

            fs.writeFileSync(outputFile, contentTemplate, 'UTF-8', (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;
                // success case, the file was saved
                log("debug", "utils.js:generateCode:write code", `code saved for ${outputFileShort}!`);
            });
        }
    }
    return true;
};

const rr2r = function (reply, statusCode, success, lookupKey1, lookupKey2, nbrErrors, jsonData, errors, logCodeReference, logInfo) {
    // rr2r : return result to requestor
    var logType = "";
    var languageReferenceKey1 = "";
    var languageReferenceKey2 = lookupKey1;
    var languageReferenceKey3 = lookupKey2;
    var myErrors = errors;
    if (success) {
        logType = "debug";
        languageReferenceKey1 = "successMessages";
    } else {
        logType = "error";
        languageReferenceKey1 = "errorMessages";
    }
    if (logCodeReference !== "") {
        if (logType == "error") {
            if (isError(errors)) {
                myErrors = JSON.parse(JSON.stringify(errors, Object.getOwnPropertyNames(errors)));
            }
            log(logType, logCodeReference, myErrors);
        } else {
            if (logInfo) {
                log(logType, logCodeReference, logInfo);
            }
        }
    }

    var o = {};
    o.success = success;
    o.status  = statusCode;
    o.nbrErrors = nbrErrors || 0;
    if (global.evironment != "PROD"){
        o.errors = myErrors
    }
    o.data = jsonData || [];
    //return res.status(statusCode).json(o);

   
    if (global.evironment != "PROD"){
        o.errors = myErrors || []
    }
    

    try {
        returnMessage = global.language[languageReferenceKey1][languageReferenceKey2][languageReferenceKey3];
        o.message = returnMessage || '';
        reply
        .code(statusCode)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(o);

    } catch (e) {
        statusCode      = 505;
        o.status        = statusCode;
        returnMessage   = "lookup error in global.language";
        o.message       = returnMessage;
        o.success       = false;
        o.nbrErrors     = 1;
        o.errors        = [e];
        o.data          = [];
        reply
        .code(statusCode)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(o);
    }
};

const createRoutesColumnDefinitions = (columnDefinitions, maxColumnLength) => {
    var cfieldName          = "";
    var fieldType           = "";
    var maxLength           = 0;
    var schemaDefinitions   = "";

    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            schemaDefinitions += "                    " + pad(key, (maxColumnLength + 1), " ", "R")  + ":";
            schemaDefinitions += " { type : '"+ columnDefinitions[key]["codeDefinitions"]["swaggertype"] + "', ";
            schemaDefinitions += columnDefinitions[key]["codeDefinitions"]["swaggerPattern"] + ", ";
            schemaDefinitions += "description : '"+ columnDefinitions[key]["mysqlColumnComment"] + "' },\n";
        }
    });
    schemaDefinitions = schemaDefinitions.slice(0,schemaDefinitions.lastIndexOf(","));
    return schemaDefinitions;
};

const createControllersCreateInputValidationsCheck = (columnDefinitions, tableName, maxColumnLength) => {
    var data        = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        data += "       if (typeof(global.jsonInputValidations['@"+tableName+"']['@"+key+"@']) === 'undefined'){\n";
        data += "           throw \"global.jsonInputValidations['@"+tableName+"']['@"+key+"@'] is not found\";\n";
        data += "       }\n";
    });
    return data;
};

const createControllersCreateData = (columnDefinitions, tableName, maxColumnLength) => {
    var data        = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            data += "        " + pad(key, (maxColumnLength + 4), " ", "R") + ": req.body."+key+",\n";
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createControllersCreateDataReturned = (columnDefinitions, tableName, maxColumnLength) => {
    var data        = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            data += "                                    " + pad("\""+key+"\"", (maxColumnLength + 4), " ", "R") + ": req.body."+key+",\n";
        } else {
            data += "                                    " + pad("\""+key+"\"", (maxColumnLength + 4), " ", "R") + ": results.insertId,\n";
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createControllersCreateDataRules = (columnDefinitions, tableName, maxColumnLength) => {
    var data        = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
             data += "        "+ pad(key, (maxColumnLength + 1), " ", "R") + ": ['required', 'regex:'+global.jsonInputValidations['@"+tableName.toLowerCase()+"']['@"+key+"@']],\n";
        }
    }); 
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createControllersUpdateDataRules = (columnDefinitions, tableName, maxColumnLength) => {
    var data        = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            data += "        "+ pad(key, (maxColumnLength + 1), " ", "R") + ": [            'regex:'+global.jsonInputValidations['@"+tableName.toLowerCase()+"']['@"+key+"@']],\n";
        } else {
            data += "        "+ pad(key, (maxColumnLength + 1), " ", "R") + ": ['required', 'regex:'+global.jsonInputValidations['@"+tableName.toLowerCase()+"']['@"+key+"@']],\n";
        }
    }); 
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createControllersCreateDynamicParametersSql = (columnDefinitions, tableName, maxColumnLength) => {
    var data        = "";
    var maxLength   = maxColumnLength + tableName.length + 3;
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            data += "                                "+ pad("\"@"+tableName+"@"+key+"@\"", (maxLength + 4), " ", "R") + ": req.body."+key+",\n";
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createControllersUpdateData = (columnDefinitions, tableName, maxColumnLength) => {
    var data        = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            data += "        " + pad(key, (maxColumnLength + 4), " ", "R") + ": req.body."+key+",\n";
        } else {
            data += "        " + pad(key, (maxColumnLength + 4), " ", "R") + ": req.params.id,\n";
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createControllersUpdateDataReturned = (columnDefinitions, tableName, maxColumnLength) => {
    var data        = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            data += "       " + pad("+key+", (maxColumnLength + 4), " ", "R") + ": [               'regex:'+global.jsonInputValidations['@"+ tableName+"']['@"+key+"@']],\n";
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createSqlListTableFields = (columnDefinitions, maxColumnLength) => {
    var data = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        data += "                 "+key+",\n";
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createSqlListTableFieldsWithoutId = (columnDefinitions, maxColumnLength) => {
    var data = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            data += "                 "+key+",\n";
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createSqlListTableFieldReferencesWithoutId = (columnDefinitions,tableName, maxColumnLength) => {
    var data = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            data += "                 '@"+tableName+"@"+key+"@',\n";
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createRouteTableListColumnsWithoutIdColumn = (columnDefinitions, tableName, maxColumnLength) => {
    var data = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            data += '"' + key + '",';
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
}

const createExtjsModelFields = (columnDefinitions, tableName) => {
    var data = "";
    /* example code to generate
    { name: 'id'                            , type: 'int', useNull: true, persist: false}, // persist: false is needed for the automatic REST put call
    { name: 'active'                        , type: 'int' },
    { name: 'description'                   , type: 'string' },
    { name: 'code'                          , type: 'string' },
    { name: 'customer_reference'            , type: 'string' },
    { name: 'startdate'                     , type: 'date', dateFormat: 'Y-m-d' },
    { name: 'enddate'                       , type: 'date', dateFormat: 'Y-m-d' },
    { name: 'customer_id'                   , type: 'int' },
    { name: 'customer_code'                 , type: 'string' },
    { name: 'customer_name'                 , type: 'string' },
    { name: 'contract_mode_id'              , type: 'int' },
    { name: 'contract_mode_code'            , type: 'string' },
    { name: 'invoice_currency_id'           , type: 'int' },
    { name: 'budget'                        , type: 'float' },
    { name: 'invoice_currency_code'         , type: 'string' },
    { name: 'invoice_base_id'               , type: 'int' },
    { name: 'invoice_base_description'      , type: 'string' }
    */
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            if (columnDefinitions[key]['codeDefinitions']['extjsFieldType'] === 'date' ) {
                data += "       { name: '"+key+"', type: '"+columnDefinitions[key]['codeDefinitions']['extjsFieldType']+"', dateFormat: 'Y-m-d'},\n";
            } else {
                data += "       { name: '"+key+"', type: '"+columnDefinitions[key]['codeDefinitions']['extjsFieldType']+"'}, \n";
            }
        } else {
            data += "       { name: 'id' , type: 'int', useNull: true, persist: false},\n"
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const createExtjsModelFieldValidators = (columnDefinitions, tableName) => {
    /*  example code to generate
        active: [
            { type: 'format', matcher: /^[0-1]$/ }
        ],
        description: [
            { type: 'length', min: 1, max: 255 }
        ],
        code: [
            { type: 'length', min: 1, max: 50 }
        ],
        customer_reference: [
            { type: 'length', min: 0, max: 50 }
        ],
        customer_id: [
            { type: 'format', matcher: /[0-9]{1,11}/ }
        ],
        customer_code: [
            { type: 'length', min: 1, max: 8 }
        ],
        customer_name: [
            { type: 'length', min: 1, max: 50 }
        ],
        contract_mode_id: [
            { type: 'format', matcher: /[0-9]{1,11}/ }
        ],
        contract_mode_code: [
            { type: 'length', min: 1, max: 20 }
        ],
        invoice_currency_id: [
            { type: 'format', matcher: /[0-9]{1,11}/ }
        ],
        invoice_currency_code: [
            { type: 'length', min: 1, max: 10 }
        ],
        budget: [
            { type: 'format', matcher: /^[0-9]{1,12}([\.|\,])?([0-9]{0,2})?$/ }
        ],
        invoice_base_id: [
            { type: 'format', matcher: /[0-9]{1,11}/ }
        ],
        invoice_base_description: [
            { type: 'length', min: 1, max: 50 }
        ]
    */
    var data = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        var minValue = 0;
        if (columnDefinitions[key]['mySqlColumnNullable'] === "no"){
            minValue = 1;
        }
        if (key != "id") { 
            if (columnDefinitions[key]['codeDefinitions']['extjsFieldType'] === 'string' ) {
                data += "       "+key+": [\n";
                data += "          { type: 'length', min: "+minValue+", max: "+columnDefinitions[key]['codeDefinitions']['extjsFieldMaxLengthToApply']+"}\n";
                data += "       ],\n";          
            } else {
                data += "       "+key+": [\n";
                data += "          { type: 'format', matcher: /"+columnDefinitions[key]['codeDefinitions']['extjsMatcher']+"/}\n";
                data += "       ],\n"    
            }
        } 
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
};

const itif = (condition) => condition ? it : it.skip;

const createTestsPostPayloadCorrect = (columnDefinitions) => {
    var data = "";
    var patternToMatch = "";
    var patternMatchedString = "";
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            if (columnDefinitions[key]["codeDefinitions"]["defaultStringToUseForTestingPurposes"] == "") {
                patternToMatch = columnDefinitions[key]["codeDefinitions"]["swaggerPattern"].slice(10,-1); // in the string "pattern: '<patern definition>'" the first part and the last quote will be removed
                patternToMatch = '/' + patternToMatch + '/';
                patternMatchedString = new randexp(patternToMatch).gen();
                patternMatchedString = patternMatchedString.slice(1,-1);
                patternMatchedString = escapeRegExp(patternMatchedString);
                patternMatchedString = JSON.stringify(patternMatchedString);
                patternMatchedString = patternMatchedString.slice(1,-1);

                data += '          "'+key+'" : "'+patternMatchedString+'",\n';   
            } else {
                patternMatchedString = columnDefinitions[key]["codeDefinitions"]["defaultStringToUseForTestingPurposes"];
                data += '          "'+key+'" : "'+patternMatchedString+'",\n';   
            }
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
}

const createTestsPostPayloadIncorrectExceedFieldLength = (columnDefinitions) => {
    var data                 = "";
    var patternToMatch       = "";
    var patternMatchedString = "";
    var maxLength            = 9999999999999999;
    var curLength            = 0;
    var keySelected          = "";
    // Going to select which field to exceed the length of. This fields should be preferable a varchar or char field.
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            if ((columnDefinitions[key]["mysqlColumnTypeShort"] === 'char') || (columnDefinitions[key]["mysqlColumnTypeShort"] === 'varchar')){
                curLength = parseInt(columnDefinitions[key]["codeDefinitions"]["extjsFieldMaxLengthToApply"]);
                if (curLength < maxLength) {
                    maxLength = curLength;
                    keySelected = key;
                }
            }
        }
    });
    //console.log("keySelected = " + keySelected + " which has max length of " + maxLength);
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            if (key === keySelected) {
                var stringThatExceedsMaxLength = "";
                stringThatExceedsMaxLength = "X".repeat(maxLength + 1);
                data += '          "'+key+'" : "'+ stringThatExceedsMaxLength +'",\n'; 
            } else{
                if (columnDefinitions[key]["codeDefinitions"]["defaultStringToUseForTestingPurposes"] === "") {
                    patternToMatch = columnDefinitions[key]["codeDefinitions"]["swaggerPattern"].slice(10,-1); // in the string "pattern: '<patern definition>'" the first part and the last quote will be removed
                    patternToMatch = '/' + patternToMatch + '/';
                    patternMatchedString = new randexp(patternToMatch).gen();
                    patternMatchedString = patternMatchedString.slice(1,-1);
                    patternMatchedString = escapeRegExp(patternMatchedString);
                    patternMatchedString = JSON.stringify(patternMatchedString);
                    patternMatchedString = patternMatchedString.slice(1,-1);
                    data += '          "'+key+'" : "'+patternMatchedString+'",\n';   
                } else {
                    patternMatchedString = columnDefinitions[key]["codeDefinitions"]["defaultStringToUseForTestingPurposes"];
                    data += '          "'+key+'" : "'+patternMatchedString+'",\n';   
                }
            } 
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
}

const createTestsPostPayloadIncorrectEmptyField = (columnDefinitions) => {
    var data                 = "";
    var patternToMatch       = "";
    var patternMatchedString = "";
    var keySelected          = "";
    // Going to select which mandatory field to use to empty.
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            if ((columnDefinitions[key]["mysqlColumnTypeShort"] === 'char') || (columnDefinitions[key]["mysqlColumnTypeShort"] === 'varchar')){
                if (columnDefinitions[key]["mySqlColumnNullable"] === 'no') {
                    keySelected = key;
                }
            }
        }
    });
    //console.log("keySelected = " + keySelected + " which has max length of " + maxLength);
    Object.keys(columnDefinitions).forEach(function(key,index) {
        if (key != "id") {
            if (key === keySelected) {
                data += '          "'+key+'" : "",\n'; 
            } else{
                if (columnDefinitions[key]["codeDefinitions"]["defaultStringToUseForTestingPurposes"] === "") {
                    patternToMatch = columnDefinitions[key]["codeDefinitions"]["swaggerPattern"].slice(10,-1); // in the string "pattern: '<patern definition>'" the first part and the last quote will be removed
                    patternToMatch = '/' + patternToMatch + '/';
                    patternMatchedString = new randexp(patternToMatch).gen();
                    patternMatchedString = patternMatchedString.slice(1,-1);
                    patternMatchedString = escapeRegExp(patternMatchedString);
                    patternMatchedString = JSON.stringify(patternMatchedString);
                    patternMatchedString = patternMatchedString.slice(1,-1);
                    data += '          "'+key+'" : "'+patternMatchedString+'",\n';   
                } else {
                    patternMatchedString = columnDefinitions[key]["codeDefinitions"]["defaultStringToUseForTestingPurposes"];
                    data += '          "'+key+'" : "'+patternMatchedString+'",\n';   
                }
            } 
        }
    });
    data = data.slice(0,data.lastIndexOf(","));
    return data;
}

module.exports = {
    createRegressionTestSsoTicket,
    log,
    rr2r,
    capitalize,
    replaceUnderscoreBySpace,
    replace_string,
    replace_string_simple,
    makeSingleString,
    getArchiveDirectories,
    getArchiveFiles,
    zeroPad,
    pad,
    spacePad,
    createUniqueID,
    createDateTimeStamp,
    addSlash,
    isEmptyObject,
    isObject,
    columnToLetter,
    letterToColumn,
    getMysqlDataTypesTranslations,
    getLanguage,
    isJsonString,
    readJsonFromFile,
    getInputValidations,
    getAnonymizationRules,
    createQueriesObject,
    getAnonymizedData,
    createTableAnonymizationFieldValuesToUse,
    createSQL,
    createAlphabethicalMatrix,
    retRes,
    generateCode,
    createRoutesColumnDefinitions,
    createControllersCreateInputValidationsCheck,
    createControllersCreateData,
    createControllersCreateDataRules,
    createControllersCreateDynamicParametersSql,
    createControllersCreateDataReturned,
    createControllersUpdateData,
    createControllersUpdateDataRules,
    createControllersUpdateDataReturned,
    createSqlListTableFields,
    createSqlListTableFieldsWithoutId,
    createSqlListTableFieldReferencesWithoutId,
    createExtjsModelFields,
    createExtjsModelFieldValidators,
    itif,
    createTestsPostPayloadCorrect,
    createTestsPostPayloadIncorrectExceedFieldLength,
    createTestsPostPayloadIncorrectEmptyField
};