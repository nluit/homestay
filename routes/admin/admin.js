var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var pool = require('../../config/connection');

var middleware = require('../../middleware/middleware');

/* GET home page. */
router.get('/admin/home', middleware.auth, function(req, res, next) {
    res.render('Admin/index', { title: 'Express' });
});

router.get('/admin/add-room-type', middleware.auth, function(req, res, next) {
    pool.query('SELECT * FROM feature', function(error, results, fields) {
        if (error) throw error;
        pool.query('SELECT MAX(ROOMTYPE_ID)+1 as MAXID FROM roomtype', function(error, result, fields) {
            if (error) throw error;
            console.log(result[0].MAXID);
            res.render('Admin/roomtype', { title: 'Room Type', data: results, id: result });
        });
    });
});


router.post('/admin/room-type', middleware.auth, function(req, res, next) {

    console.log(req.body);
    var roomtype = {
        ROOMTYPE_ID: req.body.TypeID,
        ROOMTYPE_NAME: req.body.Name,
        ROOMTYPE_MAXCUSNUM: req.body.maxCustomer,
        ROOMTYPE_SIZE: req.body.size,
        ROOMTYPE_PRICE: req.body.price,
        ROOMTYPE_DESC: req.body.Descriptions
    };
    pool.query('INSERT INTO roomtype SET ?', roomtype, function(error, results, fields) {
        if (error) console.log(error);
        else {
            console.log("success!");
            for (let i = 0; i < req.body.feature.length; i++) {
                var data = { ROOMTYPE_ID: req.body.TypeID, FEATURE_ID: req.body.feature[i] }
                console.log(data);
                pool.query('INSERT INTO roomtype_feature SET ?', data, function(error, results, fields) {
                    if (error) console.log(error);
                    // else {
                    console.log("success")
                        // }
                });
            }
        }
        res.redirect('/admin/add-room-type');
    });
});

// 
router.get('/admin/list-room-type', middleware.auth, function(req, res, next) {

    pool.query('SELECT * FROM roomtype ORDER BY ROOMTYPE_ID ASC ', function(error, results, fields) {

        if (error) throw error;
        console.log(results)
        res.render('Admin/list-room-type', { title: 'List Room Type', data: results });

    });


});


module.exports = router;