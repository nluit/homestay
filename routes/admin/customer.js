var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var pool = require('../../config/connection');
var mailconfig = require('../../config/mail.json')

var nodemailer = require('nodemailer');


var middleware = require('../../middleware/middleware');

/* GET home page. */
router.get('/admin/customer', function(req, res, next) {

    pool.query('SELECT * FROM customer ', function(error, results, fields) {

        if (error) throw error;
        console.log(results[0])
        res.render('Admin/customer', { title: 'Customer', data: results });
    });


});

router.get('/admin/new-customer', function(req, res, next) {

    console.log(req.query);
    var token = crypto.randomBytes(64).toString('hex');
    token = token.substr(0, 15)
    console.log(token);
    // res.send("oke");


    var ShoppingCart = req.session.cart;
    // console.log(ShoppingCart);
    var data = [];
    Object.keys(ShoppingCart).map(i => {
        if (i == 'items') data.push(ShoppingCart[i]);
    })
    console.log(data);
    var data2 = [];
    data.map(i => {
        Object.keys(i).map(item => {
            data2.push(i[item])
        })
    })

    console.log(data2);
    var roomid = [];
    data2.map(function(i) {
        roomid.push(i.item[0].ROOM_ID);
    })



    let roomlength = roomid.length;
    console.log(roomid.join(';'), roomlength);
    console.log(req.cookies.checkin);
    console.log(req.cookies.checkout);


    var sqlbill = "CALL Add_Bill(?,?,?,?,?,?,?,?,?,?,?,?,?)";

    pool.query(sqlbill, [roomid.join(';'), roomlength, req.cookies.checkin, req.cookies.checkout, req.query.id, token, token, req.query.fullname, req.query.gender, req.query.email, req.query.address, req.query.phone, req.query.birthday], function(error, rs, fields) {
        if (error) {
            console.log(error);
            return res.send("no");
        } else {
            console.log(rs);
            console.log(rs[0][0].BILL_ID);

            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: mailconfig.email,
                    pass: mailconfig.password
                }
            });
            var mailOptions = {
                to: req.query.email,
                from: mailconfig.email,
                subject: 'ORDER HOMESTAY',
                text: "Mã hóa đơn " + rs[0][0].BILL_ID + ", Họ và Tên " + rs[0][0].CUS_NAME + " Tổng tiền " + rs[0][0].BILL_TOTAL + "\n" + "Ngày đăt" + rs[0][0].BILL_CHECKINDATE + " Ngày rời " + rs[0][0].BILL_CHECKOUTDATE

            };
            smtpTransport.sendMail(mailOptions, function(err) {
                if (err) console.log(err);
                req.session.destroy();
                res.clearCookie('checkin');
                res.clearCookie('checkout');
                res.send("oke");
            });
        }


    });





});


module.exports = router;