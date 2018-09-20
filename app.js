//Imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');
const cookieparser = require('cookie-parser');
const handlebars = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;
const mongoDB = require('mongodb');
const db = mongoose.connection;
const dbConfig = require('./config/dbConnection');


//Application
const app = express();

//Port
const port = 3000 || process.env.port;

//Link of the Server
app.listen(port, function () {
    console.log('The server is live on http://127.0.0.1:3000/');
});

//DB Connection
mongoose.connect(dbConfig.dbConnection, (err) =>{
    if(!err)
        console.log('MongoDB connection Established, '+dbConfig.dbConnection);
    else
        console.log('Error in DB connection :' + JSON.stringify(err, undefined, 2));
});

//Middlewires
app.use(morgan('dev'));//Morgan to see Routes in shell/bash/command.
app.use(bodyParser.json());//Body Parser Middlewire
app.use(bodyParser.urlencoded({extended : false}));

//Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

//Templating/View Engine Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam+='[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Connect Flash
app.use(flash());

//Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//Import Routing Controllers
const home = require('./routes/indexController');
const user = require('./routes/userController');


//Routing
app.use('/', home);
app.use('/users', user);

