const express = require('express');
const path = require('path');
const app = express();
var router = app.router();
const port = 3000;
app.use(express.static(path.join(__dirname,'public')));
// app.use(express.static('files'))

app.get('/',function(req,res){
    res.send('Hello world');
});
app.post('/', function(req,res){
    res.send('Got the post request')
})
app.put('/user',function(req,res){
    res.send('got a put request at /user');
})
app.delete('/user',function(req,res){
    res.send('Got a delete request at /user');
});
app.get('/sample.text',function(req,res){
    res.send('random.text');
})
app.get('/ab*cd', function (req, res) {
    res.send('ab*cd');
})
app.get('/ab?cd', function (req, res) {
    res.send('ab?cd');
})
app.get('/ab+cd', function (req, res) {
    res.send('ab+cd');
})
app.get(/.*fly$/, function (req, res) {
    res.send('/.*fly$');
})
// app.get('/ab*cd', function (req, res) {
//     res.send('ab*cd');
// })

app.get('/example/b',function(req,res,next){
    console.log('response will be sent to next function');
    next();
},function(req,res){
     res.send('Hello');
});
var cb1 = function(req,res,next){
    next();
}
var cb2 = function (req, res, next) {
    next();
}
var cb3 = function (req, res) {
    console.log('cb3');
    // res.download('myapp/public/images/leaf.jpg');
    res.download(path.join(__dirname, 'public/images/leaf.jpg'),function(err){
        if(err){
            // so check res.headersSent
        }else{
            // response.status value is not updated  in the client  check
            res.status(201).end('successfully downloaded the file ');
        }
    });
    
}
app.get('/example/c',[cb1,cb2,cb3])

// router 
app.route('/product').get(function(req,res){
    res.send('get a random Product');
})
.post(function(req,res){
    res.send('added new product');
})
.put(function(req,res){ 
    res.send('update the product');
})

// router 
router.use(function(req,res,next){
    console.log('TIme:', Data.now());
    next();
})
router.get('/',function(req, res){  
    res.send('this is a message from router get method');
})




app.listen(port, ()=> console.log(`app listening to port ${port}`));
