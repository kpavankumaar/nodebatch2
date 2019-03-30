
class DefaultCtrl{
    get(req,res){
        res.status(200);
        res.send('welcome to express ');
    }

}

module.exports = new DefaultCtrl();