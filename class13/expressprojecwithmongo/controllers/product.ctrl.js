
const Product = require('../models/product.model')
var productCtrl = {
    get: function (req, res) {
        console.log(req.params.pageIndex, req.params.pageSize)
        let pageIndex = req.params.pageIndex;

        let pageSize = req.params.pageSize;
        Product.find()
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .exec()
        .then(function(product) {
                console.log(product);
                res.status(200)
                res.json(product)
            
        })
        .catch(function(err) {
            res.status(400);
            res.send();
        })
    },
    getById: function(req,res){
        console.log(req.params);
        var id = req.params.id;
        Product.findById(id)
        .exec()
        .then(function(product){
            res.status(200);
            res.json(product);
        })
        .catch(function(err){
            res.status(404);
            res.send("Not found ");
        })
        
    },
    save:function(req,res){
        
        var product = new Product(req.body)
        product.save()
        .then(function(savedProduct){
            res.status(201);
            res.json(savedProduct);
        })
        .catch(function(err){
            res.status(500);
            res.send('internal serve error');
        })
        
        
    },
    delete: function(req,res){
        var id = req.params.id;
        Product.findByIdAndRemove(id)
        .exec()
        .then(function(product){
            res.status(204);
            res.send();
        })
        .catch(function(err){
            res.status(500)
            res.send("internal server error ");
        })
    },
    update:function(req,res){
        var product = req.body;
        var id = req.params.id;
        console.log(product, id);
        Product.findByIdAndUpdate(id,{
            $set:{
                brand: req.body.brand,
                model: req.body.model,
                price: req.body.price,
                inStock: req.body.inStock
            }
        })
        .exec()
        .then(function(){
            res.status(204);
            res.send();
        })
        .catch(function(){
            res.status(500);
            res.send('Internal server error');
        })
    },
    patch: function(req,res){
        var id = req.params.id;

        Product.findById(id,function(err,productData){
            if (productData) {
                for (const key in req.body) {
                    productData[key] = req.body[key];
                }
                Product.findByIdAndUpdate(id, productData)
                .exec()
                .then(function(){
                    res.status(204);
                    res.send();
                })
                .catch(function(){
                    res.status(500);
                    res.send('internal server error');
                })
            }else{
                res.status(400);
                res.send('document not found')
            }
        })
    }
}
module.exports = productCtrl;