const userSvc = require('../services/user.svc');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class UserCtrl{
    async register(req,res){
        let hashedPassword = bcrypt.hashSync(req.body.password,2)
        req.body.password = hashedPassword;
        try{
            console.log(req.body + ' userCtrl');
            await userSvc.register(req.body);
            res.status(200);
            res.send('user is successfully registered');
        }
        catch(err){
            if(err.errmsg.indexOf("duplicate key error")> -1){
                res.status(400);
                res.send('user already exists');
            }else{
                res.status(500);
                res.send('Internal server error');
            }
        }
    }
    async login(req,res){
        let user = await userSvc.getUser(req.body.username);
        let result = bcrypt.compareSync(req.body.password,user.password);
        console.log("************* result *********",result);
        if(result){
            let token = jwt.sign({username:req.body.username},'testrun',{expiresIn:"1h"});
            let response = {
                username: req.body.username,
                token:token
            }
            res.status(200);
            res.json(response);
        }else{
            res.status(201);
            res.send('unauthorized');
        }
    }
}
module.exports = new UserCtrl();