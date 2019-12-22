var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = require('../../config/connection');

/* GET home page. */
router.get('/Auth/login', function(req, res, next) {
    res.render('Admin/Auth/login', { title: 'Login' });
});
router.post('/Auth/login', function(req, res, next) {

    var email = req.body.email;
    var password = req.body.password;

    if (email == "admin@gmail.com" && password == "admin123") {
        res.cookie('email', email);
        res.cookie('password', password);
        res.redirect('/admin/home');
    } else
        res.redirect('/Auth/login');

});
router.get('/Auth/logout', function(req, res, next) {
    var cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', { expires: new Date(0) });
    }

    res.redirect('/Auth/login');
});

module.exports = router;