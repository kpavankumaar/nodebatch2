const Product = require('../models/product.model');

class ProductService{
    get(){

    }
    getProductById(id){
        return Product.findById(id).exec()
    }
    save(data){
        var product = new Product(data)
        return product.save()
    }
    delete(id){
        return Product.findByIdAndRemove(id).exec();
    }
    update(id,obj){
        return Product.findByIdAndUpdate(id, {
            $set: {
                brand: req.body.brand,
                model: req.body.model,
                price: req.body.price,
                inStock: req.body.inStock
            }
        }).exec();
    }
    patch(id, data){
        Product.findById(id, function (err, productData) {
            if (productData) {
                for (const key in req.body) {
                    productData[key] = req.body[key];
                }
                return Product.findByIdAndUpdate(id, productData).exec();
            }
        })
    }
}


module.exports = new ProductService();