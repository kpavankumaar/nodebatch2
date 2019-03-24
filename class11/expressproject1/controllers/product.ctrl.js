var products = [
    { id: 1, brand: 'nokia', model: 'x6', price: 300, inStock: true },
    { id: 2, brand: 'sony', model: 'Erricson', price: 800, inStock: true },
    { id: 3, brand: 'samsung', model: 'j7', price: 1000, inStock: false }
]
var productCtrl = {
    get: function (req, res) {
        res.status(200)
        res.json(products);
    },
    getById: function(req,res){
        console.log(req.params);
        var id = +req.params.id;
        for (let i = 0; i < products.length; i++) {
            if(products[i].id === id){
                res.status(200);
                res.json(products[i]);
            }
            
        }
        res.status(404);
        res.send('Not Found');
    },
    save:function(req,res){
        var product = req.body;
        console.log(product,req.body);
        products.push(product);
        res.status(201);// created
        res.send(req.body);
    },
    delete: function(req,res){
        var id = +req.params.id;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products.splice(i,1);
                res.status(204);
                res.send();
            }

        }
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