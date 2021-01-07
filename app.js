'use strict';

const fs                        = require("fs");
const os                        = require("os");
const mysql                     = require("mysql2");

const fastify                   = require('fastify');
const fastifySwagger            = require('fastify-swagger');

global.port                     = process.env.PORT || 3001;
global.evironment               = process.env.ENVIRONMENT;
global.logLevel                 = process.env.LOG_LEVEL;
global.logLevel                 = process.env.LOG_LEVEL;

// const path = require('path');
// const pino = require('pino');
// const log = pino({
//   prettyPrint: {
//     // Adds the filename property to the message
//     messageFormat: '{filename}: {msg}',

//     // need to ignore 'filename' otherwise it appears beneath each log
//     ignore: 'pid,hostname', 
//   },
// }).child({ filename: './BE/_logs/log.txt' });

const log = require('pino')({ 
  level: global.logLevel
});

global.log = log;

// Define all global variables

const utils                     = require('./BE/utils/utils');

global.protocol                 = "https";
global.hostname                 = os.hostname();

global.rootFsPath               = __dirname;
global.rootUrl                  = global.protocol + "://" + global.hostname + ":" + global.port;
global.rootPath                 = ".";
global.logPath                  = "./BE/_logs/";

global.backEndPath              = utils.addSlash(global.rootPath)       + "BE";
global.backEndApiPath           = utils.addSlash(global.backEndPath)    + "api";
global.apiRoutesPath            = utils.addSlash(global.backEndApiPath) + "routes";
global.apiControllersPath       = utils.addSlash(global.backEndApiPath) + "controllers";
global.apiMiddlewarePath        = utils.addSlash(global.backEndApiPath) + "middleware";
global.sqlsPath                 = utils.addSlash(global.backEndPath)    + "sqls";
global.queriesPath              = utils.addSlash(global.backEndPath)    + "queries";
global.certsPath                = utils.addSlash(global.backEndPath)    + "certs";
global.templatesPath            = utils.addSlash(global.backEndPath)    + "templates";
global.templatesPathBE          = utils.addSlash(global.templatesPath)  + "BE";
global.templatesPathFE          = utils.addSlash(global.templatesPath)  + "FE";
global.generatedCodePath        = utils.addSlash(global.backEndPath)    + "templates/generated_code";
global.validationsPath          = utils.addSlash(global.backEndPath)    + "validations";
global.languagesPath            = utils.addSlash(global.backEndPath)    + "languages";
global.anonymizationPath        = utils.addSlash(global.backEndPath)    + "anonymizations";
global.tenantsRootDir           = utils.addSlash(global.backEndPath)    + "tenants"; 
global.certsPath                = utils.addSlash(global.backEndPath)    + "certs";

global.frontEndPath             = utils.addSlash(global.rootPath)       + "FE";
global.frontEndPublicPath       = utils.addSlash(global.frontEndPath)   + "public";

global.jsonInputValidations     = utils.getInputValidations(global.validationsPath);
global.language                 = utils.getLanguage(global.languagesPath,"EN");
global.anonymizationRules       = utils.getAnonymizationRules(global.anonymizationPath);
global.ad_firstnames            = utils.getAnonymizedData(global.anonymizationPath, "firstnames");
global.ad_lastnames             = utils.getAnonymizedData(global.anonymizationPath, "lastnames");
global.ad_customers             = utils.getAnonymizedData(global.anonymizationPath, "customers");
global.sqls                     = utils.createQueriesObject(global.sqlsPath);

global.PRIVATE_KEY              = fs.readFileSync(utils.addSlash(global.certsPath) + 'key_'         + global.hostname + '.pem');
global.PUBLIC_KEY               = fs.readFileSync(utils.addSlash(global.certsPath) + 'certificate_' + global.hostname + '.pem');

global.hostname                 = "localhost";

// Define global connection needed for login verification purposes
global.connection = mysql.createPool({
    connectionLimit:    process.env.AUTH_DBCONNECTIONLIMIT,
    host:               process.env.AUTH_DBHOST,
    user:               process.env.AUTH_DBUSER,
    password:           process.env.AUTH_DBPASSWORD,
    port:               process.env.AUTH_DBPORT,
    database:           process.env.AUTH_DB
});

// define all tenants with their database and filesystem references
global.connection_tenants = {}; 
var possible_tenants = fs.readdirSync(global.tenantsRootDir);
global.tenants = possible_tenants;
possible_tenants.forEach(function(ctenant) {
    var ctenantUp = ctenant.toUpperCase();
    var ctconn = mysql.createPool({
        connectionLimit: process.env[ctenantUp + "_DBCONNECTIONLIMIT"],
        host:            process.env[ctenantUp + "_DBHOST"],
        user:            process.env[ctenantUp + "_DBUSER"],
        password:        process.env[ctenantUp + "_DBPASSWORD"],
        port:            process.env[ctenantUp + "_DBPORT"],
        database:        process.env[ctenantUp + "_DB"]
    });
    var ctenantLow = ctenant.toLowerCase();
    global.connection_tenants[ctenantLow] = {};
    global.connection_tenants[ctenantLow]["DB"] = ctconn;
    global.connection_tenants[ctenantLow]["FS"] = utils.addSlash(global.tenantsRootDir) + ctenantUp;
});

// Create fastify application
function build(opts={}) {
  const app = fastify({
    logger: log,
    https: {
      key: global.PRIVATE_KEY,
      cert: global.PUBLIC_KEY
    }
  });
  app.register(require('fastify-cookie'), {
      secret: process.env.AUTH_JWT_KEY, // for cookies signature
      parseOptions: {}     // options for parsing cookies
  })

  
  // Register fastify module to create swagger documentation / portal
  app.register(require('fastify-swagger'), {
      routePrefix: '/api-docs',
      exposeRoute: true,
      swagger: {
        info: {
          title: 'Fastify swagger',
          description: 'testing the fastify swagger api',
          version: '0.1.0'
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here'
        },
        host: global.hostname + ":" + global.port,
        schemes: [ global.protocol ],
        consumes: ['application/json'],
        produces: ['application/json']
      }
  })

  // List of all routes for aplication
  const routes_root                     = require("./BE/api/routes/routes_root");

  const routes_codeGenerator            = require("./BE/api/routes/routes_codeGenerator");
  const routes_countries                = require("./BE/api/routes/routes_countries");
  const routes_customers                = require("./BE/api/routes/routes_customers");
  const routes_languages                = require("./BE/api/routes/routes_languages");
  const routes_login                    = require("./BE/api/routes/routes_login");
  const routes_menu                     = require("./BE/api/routes/routes_menu");
  const routes_menu_item_rights         = require("./BE/api/routes/routes_menu_item_rights");
  const routes_organisational_units     = require("./BE/api/routes/routes_organisational_units");
  const routes_profile_menu_item_rights = require("./BE/api/routes/routes_profile_menu_item_rights");
  const routes_profiles                 = require("./BE/api/routes/routes_profiles");
  const routes_profile_menu_rights      = require("./BE/api/routes/routes_profile_menu_rights");
  const routes_user_types               = require("./BE/api/routes/routes_user_types");
  const appRoutes             = [
                                      routes_codeGenerator,               // codeGenerator tag
                                      routes_login,                       // login tag
                                      //routes_root,
                                      routes_countries,                   // countries tag
                                      routes_customers,                   // customers tag
                                      routes_menu,                        // menu tag
                                      routes_menu_item_rights,            // menu tag
                                      routes_organisational_units,        // organisatinal_units tag
                                      routes_profiles,                    // profiles tag
                                      routes_profile_menu_rights,         // profiles tag      
                                      routes_profile_menu_item_rights,    // profiles tag
                                      routes_user_types,                  // users tag
                                      routes_languages                    // users tag

                                ];

  appRoutes.forEach((router) => {
        router.forEach((route, index) => {
            app.route(route);
        });
  });
  return app;

}

module.exports = build;