var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = require('../../config/connection');
var Cart = require('../../models/Cart');
var islogin = require('../../middleware/islogin');

router.get('/search', function(req, res, next) {

    console.log(req.query);
    res.cookie('checkin', req.query.checkin);
    res.cookie('checkout', req.query.checkout);
    res.locals.checkin = req.cookies.checkin;
    res.locals.checkout = req.cookies.checkout;
    req.session.destroy();
    res.send("oke");
});



module.exports = router;