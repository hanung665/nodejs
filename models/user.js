const mongoose = require('mongoose');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
  email:{
    type: String,
    require: true,
    unique: true
  },
  password:{
    type: String,
    require: true
  }
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByEmail = function(email, callback){
  User.findOne({email:email}, callback);
}

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(myPassword, hash, callback){
  bcrypt.compare(myPassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  });
}
