var express = require('express');
var router = express.Router();
var pool = require('../../config/connection');


/* GET home page. */

router.get('/admin/list-service', function(req, res, next) {
    pool.query('SELECT * FROM service', function(error, results, fields) {
        if (error) throw error;
        res.render('Admin/service', { data: results })
    });

});

router.get('/admin/add-service', function(req, res, next) {
    pool.query('SELECT * FROM facility', function(error, results, fields) {
        if (error) throw error;
        pool.query('SELECT MAX(SERVICE_ID)+1 as MAXID FROM service', function(error, result, fields) {
            if (error) throw error;
            console.log(result[0].MAXID);
            res.render('Admin/add-service', { title: 'Add service', data: results, id: result });
        });
    });

});


router.post('/admin/add-service', function(req, res, next) {

    console.log(req.body);
    var service = {
        SERVICE_ID: req.body.id,
        SERVICE_NAME: req.body.name,
        SERVICE_PRICE: req.body.price,
        SERVICE_DESC: req.body.desc,
        SERVICE_DUR: req.body.duration,
        SERVICE_IMG: req.body.image
    };
    pool.query('INSERT INTO service SET ?', service, function(error, results, fields) {
        if (error) console.log(error);
        else {
            console.log("success!");
            for (let i = 0; i < req.body.facility.length; i++) {
                var data = { FAC_ID: req.body.id, SERVICE_ID: req.body.facility[i] }
                console.log(data);
                pool.query('INSERT INTO facser_list SET ?', data, function(error, results, fields) {
                    if (error) console.log(error);
                    // else {
                    console.log("success")
                        // }
                });
            }
        }
        res.redirect('/admin/list-service');
    });
});

module.exports = router;