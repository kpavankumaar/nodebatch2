// helpers for various tasks 
// dependencies 
var crypto = require('crypto');
var config = require('./config')
var twilio = require('twilio');
var https = require('https');
var queryString = require('querystring');
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
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        // possible character for random string 
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        var str =''
        for (let i = 0; i < strLength; i++) {
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
            
        }
        return str

    }else{
        return false;
    }
}
helpers.sendTwilioSms = function(phone,msg,callback){
    // var accountSid = 'ACed885cecb0a4e9cd104e19070e90a3be'; // Your Account SID from www.twilio.com/console
    // var authToken = '82576f7304a9d1103f5751080ff9d831';   // Your Auth Token from www.twilio.com/console

    // var twilio = require('twilio');
    // var client = new twilio(accountSid, authToken);
    // console.log('***********Message Id from twilio **********************', 'test msg from twilio');
    // client.messages.create({
    //     body: 'Hello from Node',
    //     to: '+12345678901',  // Text this number
    //     from: '+12345678901' // From a valid Twilio number
    // })
    //     .then((message) => console.log('***********Message Id from twilio **********************',message.sid));
    var payload = {
        'From': '+12345678901',
        'To': '12345678901',
        'Body': 'Hello from node'
    }
    var stringPayload = queryString.stringify(payload);
    // configure the requests 
    var requestDetails = {
        'protocol': 'https',
        'hostname': 'api.twillio.com',
        'method': 'post',
        'path': '/'
    }
}

module.exports = helpers;