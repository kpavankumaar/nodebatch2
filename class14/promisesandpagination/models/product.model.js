const mongoose = require('mongoose');

module.exports = mongoose.model('Product',{
    brand:{type:String,required: [true,'brand is required'], minlength: 3 ,maxlength:10},
    model: { type: String, required: [true, 'model is mandatory'] },
    price:Number,
    inStock:Boolean
})