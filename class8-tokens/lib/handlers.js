
//dependencies 

var _data = require('./data');
var helpers = require('./helpers');
// Define all handlers 
var handlers = {}

// sample  handler
handlers.sample = function (data, callback) {
    console.log('sample data');
    callback(406, { 'name': 'sample handler' })
}
handlers.users =function(data,callback){
    // method used by the client 
    console.log('users' , data.method);
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){

        handlers._users[data.method](data, callback);
    }
    
}
// Container for all the user methods 

handlers._users = {}
// users -post
// requred data : firstname, lastname, phone, password, tosAgreement
// optional data:
handlers._users.post = function(data,callback){
    // read the files inside the users folder
    // if data doesnot exist we create the file and store json data 
    console.log('data.payload',typeof(data.payload));
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length> 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    console.log(firstName , lastName , phone ,password , tosAgreement)
    if(firstName && lastName && phone && password && tosAgreement){ 
        var hashedPassword = helpers.hash(password);
        // create the user object 
        if(hashedPassword){
            var userObject = {
                'firstName': firstName,
                'lastName': lastName,
                'phone': phone,
                'hashedPassword':hashedPassword,
                'tosAgreement': true
            }
            _data.create('users', phone, userObject, function (err) {
                console.log('handlers create fn call response ', err);
                if(!err){
                    callback(201);
                }else{
                    callback(500, {'Error':'couldnot create user , user may already exist'});
                }
            })
        }
        
    }else{
        callback(404,{'Error': 'Missing required fields '})
    }
    
    
}
//users - get 
// required data
// optional data 
handlers._users.get = function (data,callback) {
    // identify the user from users directory 
    // donot send the password to the client 
    
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    
    if(phone){
        // check with token and then verify with the phone details 
        // get the token from headers

        var token = typeof(data.headers.token) === 'string'? data.headers.token: false;
        console.log('token details inside get', token);
        handlers._tokens.verifyToken (token, phone,function(tokenIsValid){
            if (tokenIsValid) {
                _data.read('users', phone, function (err, data) {
                    if (!err && data) {
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });        
            }else{
                callback(403,{'Error':'missing required token or token is invalid'} );
            }
        });
        
        
    }else{
        callback(400, {'Error':'missing required field'})
    }
    console.log('data inside get method ');
    

}
//users - get 
// requred data : phone
// optional data:firstname  lastname, password, tosAgreement
handlers._users.put = function (data,callback) {
    // read the file from users directory 
    // if the user exists then update the user with new data 
    var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password.trim() : false;
    

    if (phone){
        // Error if nothing is sent to update
        if(firstName || lastName  || password){
            // check if we have file with phone.json
            var token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
            handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
                if (tokenIsValid) {
                    _data.read('users', phone, function (err, userData) {
                        console.log('userData', userData);
                        if (!err && userData) {
                            if (firstName) {
                                userData.firstName = firstName
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            _data.update('users', phone, userData, function (err) {
                                if (!err) {
                                    callback(200)
                                } else {
                                    callback(500, { 'Error': 'couldnot update the user ' })
                                }
                            })
                        } else {
                            callback(400, { 'Error': 'specified user doesnot exist ' });
                        }

                    })
                } else {
                    callback(403, { 'Error': 'missing required token or token is invalid' });
                }
            })
            
        }else{
            callback(400,{'Error': 'Missing fields to update'})
        }
    }else{
        callback(400,{'Error': 'Missing required fields'});
    }
}
//users - get 
// required data
// optional data 
handlers._users.delete = function (data,callback) {
    // if the  file exists then delete the file 
    var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        var token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
            if (tokenIsValid) {
                _data.read('users', phone, function (err, data) {
                    if (!err && data) {
                        _data.delete('users', phone, function (err) {
                            if (!err) {
                                callback(200)
                            } else {
                                callback(500, { 'Error': 'could not delete specified user.' });
                            }
                        })
                    } else {
                        callback(400, { 'Error': 'specified user does not exist ' });
                    }
                })
            } else {
                callback(403, { 'Error': 'missing required token or token is invalid' });
            }
        })
        
    }
}
// { phone: phone,id:tokenid, expires: expires}
// create tokens 

handlers.tokens = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._tokens[data.method](data,callback)
    }else{
        callback(405);
    }
}

handlers._tokens = {};
// TOKENS POST 
// require data: Phone , password
// optional data;none
handlers._tokens.post = function(data,callback){

    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password.trim() : false;
    // verify the user details from user directory in .data directory
    // if phone and password is authenticated then create a token 
    if(phone && password){
        // hash the password and verify with the existing password 
        _data.read('users',phone,function(err,data){
            if(!err && data){
                var hashedPassword = helpers.hash(password);
                // user login authentication
                if (hashedPassword === data.hashedPassword) {
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 2;
                    var tokenDataObject = {
                        'tokenId':tokenId,
                        'phone':phone,
                        'expires':expires
                    }

                    // storing token
                    _data.create('tokens',tokenId,tokenDataObject,function(err){
                        if(!err){
                            callback(200, tokenDataObject);
                        }else{
                            callback(500, {'Error': 'couldnot create the new token'});
                        }
                    })
                }

            }else{
                callback(400, {'Error':'couldnot find the specified user'});
            }
        })

    }else{
        callback(400, {'Error': 'missing required fields'});
    }
}
// tokens get 
// required data: id, 
// optional data :none
handlers._tokens.get = function (data,callback) {
    // check that id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        _data.read('tokens',id,function(err,tokendData){
            if(!err && tokenData){
                callback(200,tokendData);
            } else {
                callback(404);
            }
        })
    }else{
        callback(400,{'Error':'Missing valid token id '});
    }
}

// tokens put
// require data : id, extend
// optional data :none
handlers._tokens.put = function (data,callback) {
    var id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if(id && extend){
        _data.read('tokens',id,function(err, tokenData){
            if(tokenData.expires > Date.now()){
                tokenData.expires = Date.now() + 1000 * 60 * 60;
                // store the new updates
                _data.update('tokens',id,tokenData,function(err){
                    if(!err){
                        callback(200)
                    }else{
                        callback(500,{'Error':'couldnot update the tokens expiration'});
                    }
                })
            }
        })

    }else{
        callback(400,{'Error':' missing required fields'});
    }   
}


// tokens Delete
// required Data : id
// optional data 
handlers._tokens.delete = function (data,callback) {
    var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        _data.delete('tokens',id,function(err){
            if(!err){
                callback(200);
            }
        })
    }else{
        callback(400,{'Error':'missing required token id'});
    }

}

handlers._tokens.verifyToken= function(id, phone, callback){
    _data.read('tokens',id,function(err,tokenData){
        if(!err){
            // check the token for a user if it expired or not
            if(tokenData.phone === phone && tokenData.expires > Date.now()){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            console.warn('not a valid token')
            callback(false);
        }
    })

}
// checks 
handlers.checks = function(data,callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
}
// container
handlers._checks = {};


// post 
// Required data : Protocol,url ,method , successCodes, timeoutSeconds
// optional data: none 
handlers._checks.post = function(data,callback){
    // validate     
    var protocol = typeof (data.payload.protocol) == 'string' && [https,http].indexOf(data.payload.protocol) > -1 ? data.payload.protocol: false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim(): false;
    var method = typeof (data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method: false;
    var successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ?data.payload.successCodes: false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds >=1 && data.payload.timeoutSeconds <= 5? data.payload.timeoutSeconds :false;
    if(protocol && url && method && successCodes && timeoutSeconds){
        // get token from headers 
        var token = typeof(data.headers.token)=='string' ? data.headers.token : false;
        // lookup the user phone bu reading the token 
        _data.read('tokens', token,function(err, tokenData){
            if(!err && tokenData){
                var userPhone = tokenData.phone;
                _data.read('users',userPhone,function(err, userData){
                    if(!err && userData ){
                        var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks: [];
                        // verify that user has less than the number of max-checks per user
                        if(userChecks.length < 5){
                            // create a random Id for check
                            var checkId = helpers.createRandomString(20);
                            // create the check object including userphone
                            var checkObject = {
                                'id': checkId,
                                'userPhone': userPhone,
                                'protocol': protocol,
                                'url': url,
                                'method':method,
                                'successcodes': successCodes,
                                'timeoutSeconds': timeoutSeconds
                            };
                            // save the object
                            _data.create('checks',checkId,checkObject,function(err){
                                if(!err){
                                    // Add check id to the users object
                                    userData.checks = userChecks ;
                                    userData.checks.push(checkId);
                                    // save the new user data 
                                    _data.update('users', userPhone,userData,function(){
                                        if(!err){
                                            // return the data about the new check 
                                            callback(200,checkObject);

                                        }else{
                                            callback(500,{'Error': 'couldnot update the user with the new check '})
                                        }
                                    })
                                }else{
                                    callback(500,{'Error': 'couldnot create the new check '});
                                }

                            })
                        }else{
                            callback(400, {'Error': 'the user already has the maximum number  of checks 5'});
                        }
                    }else{
                        callback(403);
                    }
                })
            }else{
                callback(403);
            }
        })
    }else{
        callback(400,{'Error':'Missing required inputs  or inputs are invalid'});
    }

}

// get


// put 
// delete 



// not found handler 
handlers.notFound = function (data, callback) {
    callback(404);
}

// export the handlers 
module.exports = handlers