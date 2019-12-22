var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var config = require("../../config/config.json");
var pool = require('../../config/connection');

/* GET home page. */
router.get('/', function(req, res, next) {

    pool.query('SELECT * FROM roomtype', function(error, results, fields) {
        var page = parseInt(req.query.page) || 1;
        var perPage = 6;
        var start = (page - 1) * perPage;
        var end = page * perPage
        if (error) throw error;
        var numPage = parseInt((results.length - 1) / 6) + 1;
        console.log(page);

        let sql = `CALL getFacility()`;
        pool.query(sql, function(error, result, fields) {
            if (error) throw error;
            console.log(result);
            res.render('pages/index', { title: 'Home', data: results.slice(start, end), numpage: numPage, cur: page, fac: result[0] });

        });

    });
});



router.get('/room/:id', function(req, res, next) {
    let sql = `CALL getRoom(?,?,?,?)`;
    pool.query(sql, [1, req.id, req.cookies.checkin, req.cookies.checkout], function(error, r1, fields) {
        if (error) throw error;
        pool.query(sql, [2, req.params.id, req.cookies.checkin, req.cookies.checkout], function(error, r2, fields) {
            if (error) throw error;
            pool.query(sql, [3, req.params.id, req.cookies.checkin, req.cookies.checkout], function(error, r3, fields) {
                if (error) throw error;
                pool.query(sql, [4, req.params.id, req.cookies.checkin, req.cookies.checkout], function(error, r4, fields) {
                    if (error) throw error;
                    pool.query(sql, [5, req.params.id, req.cookies.checkin, req.cookies.checkout], function(error, r5, fields) {
                        if (error) throw error;

                        var data = [];
                        if (r1[0].length != 0) data.push(r1[0]);
                        if (r2[0].length != 0) data.push(r2[0]);
                        if (r3[0].length != 0) data.push(r3[0]);
                        if (r4[0].length != 0) data.push(r4[0]);
                        if (r5[0].length != 0) data.push(r5[0]);

                        res.render('pages/rooms/room', { title: 'Room', data: data });
                    });
                });
            });


        });
    });
});

router.get('/room-info/:id', function(req, res, next) {
    if (req.cookies.checkin || req.cookies.checkin) {
        let sql = `CALL getRoomInfo(?,?,?)`;
        let sql2 = `CALL getRoomFeature(?)`

        pool.query(sql, [req.params.id, req.cookies.checkin, req.cookies.checkout], function(error, results, fields) {
            if (error) {
                console.log(error);
                return res.redirect('/');
            }
            if (results[0].length != 0) {
                pool.query(sql2, req.params.id, function(error, result, fields) {
                    if (error) throw error;
                    // console.log(results);
                    // console.log(result);
                    res.render('pages/rooms/room-info', { title: 'room info', data: results[0], feature: result[0] })

                });
            } else {
                return res.redirect('/');
            }


        });
    } else {
        res.redirect('/')
    }

});


router.get('/facility', function(req, res, next) {
    let sql = `CALL getFacility()`;
    pool.query(sql, function(error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.render('pages/facility', { title: "facility", data: results[0] });
    });
});

router.get('/facility/:id', function(req, res, next) {
    let sql = `CALL getFacilityRoom(?,?,?)`;
    pool.query(sql, [req.params.id, req.cookies.checkin, req.cookies.checkout], function(error, results, fields) {
        if (error) throw error;
        console.log(results);
        if (results[0].length != 0) {
            res.render('pages/facility-room', { title: "Fac_Room", data: results[0] });
        } else {
            return res.redirect('/');
        }
    });
});

module.exports = router;