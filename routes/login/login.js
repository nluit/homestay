var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = require('../../config/connection');

/* GET home page. */
router.get('/login', function(req, res, next) {

    res.render('pages/login', { title: 'Login' });
});
router.post('/login', function(req, res, next) {
    console.log(req.body);

    let sql = `CALL login_sys(?,?)`;

    pool.query(sql, [req.body.username, req.body.password], function(error, results, fields) {
        if (error) {
            console.log(error.sqlState);
            return res.redirect('/login')

            if (error.sqlState == '69696')
                res.redirect('/login');
        } else {
            var data = results;
            var data2 = JSON.stringify(data);
            var data3 = JSON.parse(data2)[0];
            console.log(data3[0].v_role);
            var role = data3[0].v_role;
            if (role == 1 || role == 3) {
                res.cookie('username', req.body.username);
                res.cookie('pw', req.body.password);
                res.locals.user = req.cookies.username;
                res.redirect('/');
            }

        }


    });
});
router.post('/register', function(req, res, next) {

    console.log(req.body);

    let sql = `CALL reg_newcus(?,?,?,?,?,?,?,?,?)`;

    pool.query(sql, [req.body.username, req.body.password, req.body.fullname, req.body.gender, req.body.id, req.body.email, req.body.birthday, req.body.address, req.body.phone], function(error, results, fields) {
        if (error) {
            console.log("Loi khoa chinh");
            res.redirect('/register');
        }
        res.redirect('/login');
    });

});
router.get('/register', function(req, res, next) {

    res.render('pages/register', { title: 'Register' });
});

router.get('/logout', function(req, res, next) {
    var cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', { expires: new Date(0) });
    }
    res.redirect('/login')
});


module.exports = router;