
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
                    var expires = Date.now() * 1000 * 60 * 60;
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
handlers._tokens.get = function () {

}

// tokens put
// require data : id, extend
// optional data :none
handlers._tokens.put = function () {

}

// tokens Delete
// required Data : id
// optional data 
handlers._tokens.delete = function () {

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



// not found handler 
handlers.notFound = function (data, callback) {
    callback(404);
}

// export the handlers 
module.exports = handlers