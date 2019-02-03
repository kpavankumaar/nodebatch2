
// Define all handlers 
var handlers = {}

// sample  handler
handlers.sample = function (data, callback) {
    callback(406, { 'name': 'sample handler' })
}
handlers.users =function(data,callback){
    // method used by the client 
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);
    }
    
}
// Container for all the user methods 

handlers._users = {}
// users -post
// requred data 
// optional data:
handlers._users.post = function(data,callback){
    // read the files inside the users folder
    // if data doesnot exist we create the file and store json data 
    
}
//users - get 
// required data
// optional data 
handlers._users.get = function (data,callback) {
    // identify the user from users directory 
    // donot send the password to the client 

}
//users - get 
// required data
// optional data 
handlers._users.put = function (data,callback) {
    // read the file from users directory 
    // if the user exists then update the user with new data 

}
//users - get 
// required data
// optional data 
handlers._users.delete = function (data,callback) {
    // if the  file exists then delete the file 

}



// not found handler 
handlers.notFound = function (data, callback) {
    callback(404);
}

// export the handlers 
module.exports = handlers