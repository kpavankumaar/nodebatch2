
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
        
    },
    update:function(req,res){
        var product = req.body;
        var id = +req.params.id;
        console.log(product, id);

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products[i].brand = product.brand;
                products[i].model = product.model;
                products[i].price = product.price;
                products[i].inStock = product.inStock;
                res.status(200);
                res.send();
            }

        }
    }
}
module.exports = productCtrl;