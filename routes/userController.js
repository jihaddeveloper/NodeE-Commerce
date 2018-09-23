const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//Register Forn View
router.get('/register', function (req, res, next) {
    res.render('register');
});

//Register Action
router.post('/register', function (req, res, next) {

    //Getting Input from View Page
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    //console.log(name);

    //Validation
    req.checkBody('name', 'Name is reqiured').notEmpty();
    req.checkBody('username', 'Username is reqiured').notEmpty();
    req.checkBody('email', 'Email is reqiured').notEmpty();
    req.checkBody('email', 'Email is reqiured').isEmail();
    req.checkBody('password', 'Password is reqiured').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        console.log('Errors');
        res.render('register', {
            errors: errors
        });
    } else {
        newUser = new User({
            name: name,
            username: username,
            email: email,
            password: password
        });

        User.createUser(newUser, function (err, User) {
            if (err) throw err;
            console.log(User);
        });

        req.flash('success_msg', 'You are registered now and can login');

        res.redirect('/users/login');
    }
});

//Login Form View
router.get('/login', function (req, res, next) {
    res.render('login');
});

//Login Authentication
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) {
                throw err;
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Incorrect password.'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.getUserById(id, function(err, user){
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function (req, res) {
        res.redirect('/');
    });


//Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;