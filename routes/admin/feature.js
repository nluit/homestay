var express = require('express');
var router = express.Router();
var pool = require('../../config/connection');


/* GET home page. */

router.get('/admin/feature', function(req, res, next) {
    pool.query('SELECT * FROM feature', function(error, results, fields) {
        if (error) throw error;
        res.render('Admin/feature', { data: results })
    });
});

router.post('/admin/feature', function(req, res, next) {
    var feature = { FEATURE_NAME: req.body.featureName, FEATURE_ICON: req.body.featureIcon };
    var query = pool.query('INSERT INTO feature SET ?', feature, function(error, results, fields) {
        if (error) throw error;
        res.redirect('/admin/feature');
    });
});


module.exports = router;