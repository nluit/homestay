var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = require('../../config/connection');
var Cart = require('../../models/Cart');
var islogin = require('../../middleware/islogin');

router.get('/contact', function(req, res, next) {

    res.render('pages/contact', { title: "Contact" })
});

router.get('/about', function(req, res, next) {

    res.render('pages/about', { title: "About" })
});



module.exports = router;