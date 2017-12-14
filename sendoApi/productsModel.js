const mongoose= require('mongoose');
const Schema= mongoose.Schema;

var product= new Schema({
    name: {type: String, required: true,dropDups: true},
    title1: {type: String, required : true},
    title2: {type: String},
    title3: {type: String, required : true},
    link: {type: String, required : true},
    linkProduct: {type:String,required:true,unique:true,dropDups: true},
    currentPrice : {type: String,required: true},
    oldPrice : {type: String},
    wireHouse : {type: String},
    urlImg: {type:String,required:true}
})

module.exports = mongoose.model('product',product);

