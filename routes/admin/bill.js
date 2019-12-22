var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = require('../../config/connection');

/* GET home page. */
router.get('/admin/bill', function(req, res, next) {

    let sql = `CALL getBill(null)`;

    pool.query(sql, function(error, results, fields) {
        if (error) {
            console.log(error);
            // return res.redirect('/');
        }
        if (results[0].length != 0) {


            console.log(results[0]);
            res.render('Admin/bill', { title: 'Bill', data: results[0] });


        } else {
            return res.redirect('/admin/home');
        }


    });


});

router.get('/admin/bill-detail/:id', function(req, res, next) {

    let sql = `CALL getBillRoom(?)`;

    console.log(req.params.id);
    pool.query(sql, req.params.id, function(error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log(results[0]);

            let sql2 = `CALL getBillService(?)`;
            pool.query(sql2, req.params.id, function(error, result, fields) {
                if (error) {
                    console.log(error);
                } else {
                    // console.log(result);
                    res.render('Admin/bill-detail', { title: "Bill detail", data: results[0], billservice: result[0] })

                }
            })



        }

    });


});

router.get('/admin/forward-bill/:id/:status', function(req, res, next) {

    let sql = `CALL getBillRoom(?)`;

    console.log(req.params.id);
    // console.log(results[0]);
    if (req.params.status == 1) {
        let sql2 = `CALL forwardBill(?)`;
        pool.query(sql2, req.params.id, function(error, result, fields) {
            if (error) {
                console.log(error);
                res.redirect('/admin/bill');
            } else {
                console.log(result);
                res.redirect('/admin/bill');

            }
        })
    } else {
        res.redirect('/admin/bill');
    }
});


router.get('/admin/bill-service/:id', function(req, res, next) {

    let sql2 = `CALL getServiceList(?)`;
    pool.query(sql2, req.params.id, function(error, result, fields) {
        if (error) {
            console.log(error);
            res.redirect('/admin/bill');
        } else {
            console.log(result);
            res.render('Admin/bill-service', { title: "Bill Service", data: result[0], bill_id: req.params.id })
        }
    })
});

router.get('/add-bill-service', function(req, res, next) {
    console.log(req.query.service_id, req.query.bill_id, req.query.qty);
    let sql2 = `CALL addService(?,?,?)`;
    pool.query(sql2, [req.query.service_id, req.query.bill_id, req.query.qty], function(error, result, fields) {
        if (error) {
            console.log(error);
            res.send('no')

        } else {
            // console.log(result);
            res.send('oke')

        }
    })

});



module.exports = router;