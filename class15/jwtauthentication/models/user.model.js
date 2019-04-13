const mongoose = require('mongoose');

let UserModel = mongoose.model("User",{
    username: {type:String, required:true},
    password: { type: String, required: [true, 'enter password '] },
    active: {type:Boolean, default: true},
    lastUpdated:{type: Date, default: Date.now}
})

module.exports  = UserModel;