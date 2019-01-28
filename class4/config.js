/*
 *
 * create and export configuration variable s
 */

 // container for all environments 

 var environments = {};

 // staging(default ) environment
 environments.staging ={
     'port': 3000,
     'envName' : 'staging'
 }
 // production environment 

 environments.production = {
     'port': 5000,
     'envName': 'production'
 }

 // Determine which environment was passed in cli
 var currentEnvironment = typeof(process.env.NODE_ENV) == 'string'? process.env.NODE_ENV.toLowerCase() : '';
 console.log(currentEnvironment);

 // check that the currentEnvironment is among the above definitions else default it to staging
var environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmentToExport;