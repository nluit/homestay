var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = require('../../config/connection');
var middleware = require('../../middleware/middleware');

/* GET home page. */
router.get('/admin/facility', middleware.auth, function(req, res, next) {
    pool.query('SELECT * FROM facility', function(error, results, fields) {
        if (error) console.log(error);
        res.render('Admin/facility', { title: 'Facility', data: results });
    });
});



module.exports = router;