const express = require('express');
const router  = express.Router();


router.post('/register',userCtrl.register);
router.post('/login', userCtrl.login);