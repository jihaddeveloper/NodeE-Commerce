const express = require('express');
const router = express.Router();

//Register
router.get('/register', function(req, res, next) {
    res.render('register');
});

//Login
router.get('/login', function(req, res, next) {
    res.render('login');
});

module.exports = router;