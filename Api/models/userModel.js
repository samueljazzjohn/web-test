const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email : {type:String,required:true,unique:true},
    password : {type:String,required:true},
    username : {type:String}
},{collection:'Users'}
);

module.exports = mongoose.model('UserModel',UserSchema)