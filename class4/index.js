/*
* Primary file for api
* 
*/
// Dependencies
var http = require('http');
var url = require('url');
var config = require('./config');
var StringDecoder = require('string_decoder').StringDecoder;
// configure the server to respond to all requests with a string
var server = http.createServer(function (req, res) {
    //console.log('request url ', req.url);
    // parse url 
    var parsedUrl = url.parse(req.url, true);
    //console.log('parsed url ', parsedUrl);
    // get the path 
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/\//g, '')
    // get the queryString as an object
    var queryStringObject = parsedUrl.query;
    //console.log('queryStringObject', queryStringObject)
    // get the http method 
    var method = req.method.toLowerCase();
    //  get the headers 
    var headers = req.headers;
    //console.log('headers', headers);
    // get payload if any 
    var decoder = new StringDecoder('utf-8');
    var buffer = ''
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();
        // check the router for a matching path for a handler .if one is not found , use the not found handler instead
        var chooseHandler = typeof(router[trimmedPath]) !=='undefined' ? router[trimmedPath]:handlers.notFound;
        // construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        // route the request to the handler specified in the router 
        chooseHandler(data,function(statusCode , payload){
            // use the status code returned from the handler, or set the default status to 200
            statusCode = typeof(statusCode) =='number'? statusCode : 200;
            // use the  payload returned from the handler , or set the default payload to empty object
            payload = typeof(payload) == 'object'? payload:{};

            // convert the payload to a string 
            var payloadString = JSON.stringify(payload);

            // return the response 
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log("return this response:", statusCode , payloadString);

        });
        
        console.log(chooseHandler +' method for '+ trimmedPath);
        // send the response

        

        // log the request / response

        //console.log('request received with this payload: ', typeof buffer);
        // 
    })
    // //console.log(JSON.parse(buffer));


});

// start the server
server.listen(config.port, function () {
    console.log('the server is up and running now on port'+ config.port + ' in '+ config.envName + ' mode');
});

// Define all handlers 
var handlers = {}

// sample  handler
handlers.sample = function (data, callback){
    callback(406,{'name':'sample handler'})
}
// not found handler 
handlers.notFound = function(data,callback){
    callback(404);
}
// define the request router 
var router = {
    'sample': handlers.sample
}