var express = require('express');
var router = express.Router();

var pool = require('../../config/connection');
var middleware = require('../../middleware/middleware');

/* GET home page. */
router.get('/admin/add-room', middleware.auth, function(req, res, next) {

    pool.query('SELECT * FROM roomtype', function(error, result, fields) {
        if (error) throw error;
        pool.query('SELECT * FROM facility', function(error, results, fields) {
            if (error) throw error;
            console.log(results);
            console.log(result);
            res.render('Admin/add-room', { title: 'Room', data1: result, data2: results });

        });
    });

});

router.get('/admin/list-room', middleware.auth, function(req, res, next) {

    pool.query(`SELECT room.*,facility.fac_name,roomtype.roomtype_name FROM roomtype,room,facility where roomtype.roomtype_id= room.roomtype_id and facility.fac_id=room.fac_id`, function(error, result, fields) {
        console.log(result);
        res.render('Admin/room', { title: "room", data: result });

    });

});


router.post('/admin/add-room', middleware.auth, function(req, res, next) {
    var room = { ROOMTYPE_ID: req.body.roomtype, FAC_ID: req.body.facility, ROOM_STATUS: req.body.status, ROOM_IMG: req.body.image };
    var query = pool.query('INSERT INTO room SET ?', room, function(error, results, fields) {
        if (error) throw error;
        res.redirect('/admin/add-room');
    });

});



module.exports = router;