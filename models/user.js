const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


var userSchema = new Schema({
    name: { type: String, index: true, required: true, maxlength: 30, minlength: 5 },
    username: { type: String, lowercase: true, required: true, maxlength: 20, minlength: 5 },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String,required: true, minlength: 5 }
});

const User = module.exports = mongoose.model('User', userSchema, 'users');

//Create New User
module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

//To get User by Id
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

//To get User by Username
module.exports.getUserByUsername = function(username, callback){
    var query = {username : username}
    User.findOne(query, callback);
}


//To get User by Name
module.exports.getUserByName = function(name, callback){
    var query = {name : name}
    User.findOne(query, callback);
}

//Password comparetor
module.exports.comparePassword = function(candidatePassword, hashPassword, callback){
    bcrypt.compare(candidatePassword, hashPassword, function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
}