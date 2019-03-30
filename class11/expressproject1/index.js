var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var defaultCtrl = require('./controllers/default.ctrl');
// var productCtrl = require('./controllers/product.ctrl');
var defaultRouter = require('./routes/default.router');
var productRouter = require('./routes/product.router');


app.use(bodyParser.json());
app.use('/',defaultRouter);
app.use('/api/products',productRouter);
// app.get('/',defaultCtrl.get);
// app.get('/products',productCtrl.get);
app.listen(3000,function(){
    console.log('we are listening to port 3000');
})
