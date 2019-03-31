
const Product = require('../models/product.model')
var productCtrl = {
    get: function (req, res) {
        Product.find(function (err, product) {
            if (!err) {
                res.status(200)
                res.json(product)
            } else {
                res.status(400);
                res.send();
            }
        })
    },
    getById: function(req,res){
        console.log(req.params);
        var id = req.params.id;
        Product.findById(id,function(err, product){
            if (!err) {
                res.status(200);
                res.send(product);
            }else{
                res.status(404);
                res.send('Not Found');
            }
        })
        
    },
    save:function(req,res){
        
        var product = new Product(req.body)
        product.save(function(err, savedProduct){
            if (!err) {
                res.status(201);
                res.send(savedProduct);
            }else{
                res.status(500);
                res.send('Internal se')
            }
        })
        
        
    },
    delete: function(req,res){
        var id = req.params.id;
        Product.findByIdAndRemove(id,function(err){
            if(!err){
                res.status(204);
                res.send();
            }else{
                res.status(500);
                res.send('Internal server error');
            }
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
        }, function (err) {
            if (!err) {
                res.status(204);
                res.send();
            } else {
                res.status(500);
                res.send('Internal server error');
            }
        })
    },
    patch: function(req,res){
        var id = req.params.id;

        Product.findById(id,function(err,productData){
            if (productData) {
                for (const key in req.body) {
                    productData[key] = req.body[key];
                }
                Product.findByIdAndUpdate(id, productData,function(err){
                    if(!err){
                        res.status(204);
                        res.send();
                    }else{
                        res.status(500);
                        res.send('internal server error');
                    }   
                })
            }else{
                res.status(400);
                res.send('document not found')
            }
        })
    }
}
module.exports = productCtrl;