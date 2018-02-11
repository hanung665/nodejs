const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('passport-jwt');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config/database');
const port = Number(process.env.PORT || 3000);
const routes = require('./routes/routes');

mongoose.connect(config.db);
mongoose.Promise = global.Promise;
require('./config/passport')(passport);

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
routes(app, passport);


app.listen(port, ()=>{
  console.log('Server runnnig on port: '+port);
});

