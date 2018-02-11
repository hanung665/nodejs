const passport =require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
//require('../config/passport')(passport);
module.exports = function(app, passport){
  app.get('/', (req, res)=>{
    res.json('Cuma ngetes otorisasi menggunakan JWT kok!');
  });
  app.post('/signup', (req, res)=>{
    var newUser = new User({
      email:req.body.email,
      password:req.body.password
    });
    User.createUser(newUser, (err, success)=>{
      if(err){
        res.json({success:false, msg:'User is not registered'});
      }else{
        res.json({success:true, msg:'User registered'});
      }
    });
  });
  app.post('/login', (req,res)=>{
    var email=req.body.email;
    var password=req.body.password;
    User.getUserByEmail(email, (err, user)=>{
      if(err) throw err;
      if(!user){
        res.json({success:false, msg:'User not found'});
      }
      User.comparePassword(password, user.password, (err, isMatch)=>{
        if(err) throw err;
        if(isMatch){
//          var token = jwt.sign(user, config.secret,{expiresIn:600000});
//          res.json({success:true, token:token, user:{
          var token = jwt.sign(user.toJSON(), config.secret,{expiresIn:600000});
          res.json({success:true, token:'JWT '+ token, user:{
                                                          id: user._id,
                                                          email: user.email,
                                                          password: user.password
                                                          }
            });
        } else {
          return res.json({success: false, message:'Password doesn\'t match'});
        }
      });
    });
  });
  app.get('/profile', passport.authenticate('jwt',{session:false}),function(req, res, next){
    res.json(req.user);     //user undefined
//    res.send('Authorized');         //berhasil
//    console.log('Authorized');      //berhasil
  });
  app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
  });
}
