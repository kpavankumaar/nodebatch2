/*
* Primary file for api
* 
*/
// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
// configure the server to respond to all requests with a string
var server = http.createServer(function(req,res){
    console.log('request url ', req.url);
    // parse url 
    var parsedUrl = url.parse(req.url, true);
    console.log('parsed url ', parsedUrl);
    // get the path 
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/\//g, '')
    // get the queryString as an object
    var queryStringObject = parsedUrl.query;
    // get the http method 
    var method = req.method.toLowerCase();
    //  get the headers 
    var headers = req.headers;
    console.log('headers', headers);
    // get payload if any 
    var decoder = new StringDecoder('utf-8');
    var buffer = ''
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();
        // send the response
        res.end('Hello world !\n');
        
        // log the request / response

        console.log('request received with this payload: ', typeof buffer);
    })
    // console.log(JSON.parse(buffer));

    
});

// start the server
server.listen(3000,function(){
    console.log('the server is up and running now')
});
