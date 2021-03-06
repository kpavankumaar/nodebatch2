// helpers for various tasks 
// dependencies 
var crypto = require('crypto');
var config = require('./config')
// container for the helpers 

var helpers = {};

// parse json string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    }catch(e){
        return {};
    }
}
// create a SHA256
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    }else {
        return false;
    }
}       

module.exports = helpers;