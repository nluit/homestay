var pool = require('../config/connection');

module.exports.isLogin = function(req, res, next) {
    if (!req.cookies.username) {
        res.redirect('/login');
        return;
    }
    let sql = `CALL login_sys(?,?)`;
    pool.query(sql, [req.cookies.username, req.cookies.pw], function(error, results, fields) {
        if (error) {
            res.redirect('/login');
            return;
        } else {
            var data = results;
            var data2 = JSON.stringify(data);
            var data3 = JSON.parse(data2)[0];
            var role = data3[0].v_role;
            if (role == 0) {
                res.redirect('/login');
                return
            } else
            if (role == 1 || role == 3) {
                console.log(req.cookies.username);
                next();
            }
        }

    });



}