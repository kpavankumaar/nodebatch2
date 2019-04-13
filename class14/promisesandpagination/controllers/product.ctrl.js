
const Product = require('../models/product.model');
const productSvc = require('../services/product.svc');
var productCtrl = {
    get: function (req, res) {
        console.log(typeof(req.params.pageIndex), req.params.pageSize);
        let pageIndex = +req.params.pageIndex || 0 ;

        let pageSize = +req.params.pageSize || 10;
        let sort = req.query.sort;
        console.log(pageIndex,pageSize);
        Product.count()
        .exec()
        .then(function(cnt){
            console.log(cnt , pageSize);
            let totalPages = Math.ceil(cnt/pageSize);
            let metaData = {
                count: cnt,
                totalPages: totalPages,
                hasPrevious: pageIndex > 0 ,
                hasNext: pageIndex < totalPages - 1
            }
            Product.find({},{__v:0})
                .sort()
                .skip(pageIndex * pageSize)
                .limit(pageSize)
                .exec()
                .then(function (product) {
                    console.log(product);
                    let response = {
                        metaData : metaData,
                        data:product
                    }
                    res.status(200)
                    res.json(response)

                })
                .catch(function (err) {
                    res.status(400);
                    res.send();
                })

        })
        
    },
    getById: async function(req,res){
        console.log(req.params);
        var id = req.params.id;
        try {
            var product = await productSvc.getProductById(id);
            res.status(200);
            res.json(product);    
        } catch (error) {
            res.status(404);
            res.send("Not found ");    
        }
        
    },
    save: async function(req,res){
        try {
            var savedProduct = await productSvc.save(req.body);
            res.status(201);
            res.json(savedProduct);    
        } catch (error) {
            res.status(500);
            res.send(error);    
        }    
    },
    delete: async function(req,res){
        var id = req.params.id;
        try {
            await productSvc.delete(id);
            res.status(204);
            res.send();
        } catch (error) {
            res.status(500)
            res.send("internal server error ");
        }
    },
    update:async function(req,res){
        
        var id = req.params.id;
        console.log(product, id);
        try {
            await productSvc.update(id, req.body);
            res.status(204);
            res.send();

        } catch (error) {
            res.status(500);
            res.send('Internal server error');
            
        }
    },
    patch:async function(req,res){
        var id = req.params.id;
        try {
            await productSvc.patch(id, req.body)
            res.status(204);
            res.send()
        } catch (error) {
            res.status(500);
            res.send('Internal server error ');
        }
        
    }
}
module.exports = productCtrl;