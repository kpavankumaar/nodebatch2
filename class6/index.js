/*
* Primary file for api
* 
*/
// Dependencies
var https = require('https')
var http = require('http');
var url = require('url');
var fs = require('fs');
var helpers = require('./lib/helpers');
var handlers = require('./lib/handlers');
var config = require('./lib/config');

var StringDecoder = require('string_decoder').StringDecoder;
// configure the server to respond to all requests with a string
var httpServer = http.createServer(function (req, res) {
    
    unifiedServer(req,res);
        // //console.log(JSON.parse(buffer));


});

// start the server
httpServer.listen(config.httpPort, function () {
    console.log('the server is up and running now on port'+ config.httpPort + ' in '+ config.envName + ' mode');
});
// instantiate the https server 
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsServerOptions ,function(req,res){
    
    unifiedServer(req,res);
})
httpsServer.listen(config.httpsPort,function(){
    console.log('https server is listening ', config.httpsPort);
})

// all the server logic for both the http and https
var unifiedServer = function(req,res){
    //console.log('request url ', req.url);
    // parse url 
    console.log('unified server');
    var parsedUrl = url.parse(req.url, true);
    //console.log('parsed url ', parsedUrl);
    // get the path 
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/\//g, '')
    // get the queryString as an object
    var queryStringObject = parsedUrl.query;
    
    // get the http method 
    var method = req.method.toLowerCase();
    //  get the headers 
    var headers = req.headers;
    // get payload if any 
    var decoder = new StringDecoder('utf-8');
    var buffer = ''
    
    req.on('data', function (data) {
        console.log('request.on data event', data);
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        console.log('request on end event');
        buffer += decoder.end();
        // var parsedBuffer = JSON.parse(buffer);
        // check the router for a matching path for a handler .if one is not found , use the not found handler instead
        var chooseHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        // construct the data object to send to the handler
        console.log('choosehandler ', chooseHandler);
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        }
        
        console.log('data', data);
        // route the request to the handler specified in the router 
        chooseHandler(data, function (statusCode, payload) {
            // use the status code returned from the handler, or set the default status to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            // use the  payload returned from the handler , or set the default payload to empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // convert the payload to a string 
            var payloadString = JSON.stringify(payload);

            // return the response 
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log("return this response:", statusCode, payloadString);

        });

        console.log(chooseHandler + ' method for ' + trimmedPath);
        // send the response



        // log the request / response

        //console.log('request received with this payload: ', typeof buffer);
        // 
    })

}
// define the request router 
var router = {
    'sample': handlers.sample,
    'users': handlers.users
}
