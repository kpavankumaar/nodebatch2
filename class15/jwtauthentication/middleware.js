const jwt = require("jsonwebtoken");
let middleware = {
    authenticate : function(req,res,next){    
        console.log(req.headers)
        let base64String = req.headers["authorization"].replace("Basic ", "");
        let decodedString = new Buffer(base64String, 'base64').toString();
        let tokens = decodedString.split(":");

        let username = tokens[0];
        let password = tokens[1];
        if (username == 'krishna9@gmail.com' && password == 'krishna@234') {
            next()
        } else {
            res.status(401);
            res.send('unauthorized');
        }
    },
    tokenAuth: function(req,res,next){
        let token = req.headers['authorization'];
        let result = jwt.verify(token, 'testrun',function(err){
            if(err){    
                res.status(401)
                res.send('unauthorized');
            }else{
                next();
            }
        })
    }

}
module.exports = middleware;