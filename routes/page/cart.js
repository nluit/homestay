var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = require('../../config/connection');
var Cart = require('../../models/Cart');
var islogin = require('../..//middleware/islogin');
var mailconfig = require('../../config/mail.json')

var nodemailer = require('nodemailer');


/* GET home page. */
router.get('/add-to-cart/:id', function(req, res, next) {
    let roomId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    let sql = `CALL getRoomInfo(?,?,?)`;
    pool.query(sql, [req.params.id, req.cookies.checkin, req.cookies.checkout], function(error, results, fields) {
        // if (error) throw error;
        if (error) {
            console.log(error);
            return res.redirect('/');
        }
        if (!cart.items[roomId]) { cart.add(results[0], roomId); } else {
            if (cart.items[roomId].item[0].ROOM_ID != roomId)
                cart.add(results[0], roomId);
        }

        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');

    });

});
router.get('/add/:id', function(req, res, next) {
    let roomId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.addByOne(roomId);
    req.session.cart = cart;
    res.redirect('/');

});

router.get('/reduce/:id', function(req, res, next) {
    let roomId = req.params.id;
    console.log(roomId);
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(roomId);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {

    let roomId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(roomId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/current-customer', function(req, res, next) {

    console.log(req.query.username.trim());
    pool.query(`select * from customer where user_id= ?`, req.query.username.trim(), function(error, results, fields) {
        if (error) console.log(error);
        else {
            console.log(results);
            res.send(results[0]);
        }
    });

});

router.get('/shopping-cart', islogin.isLogin, function(req, res, next) {

    // console.log(req.session.cart);
    console.log(res.locals.user);

    var ShoppingCart = req.session.cart;
    if (ShoppingCart) {
        var data = [];
        Object.keys(ShoppingCart).map(i => {
            if (i == 'items') data.push(ShoppingCart[i]);
        })
        var data2 = [];
        data.map(i => {
                Object.keys(i).map(item => {
                    // if (i == 'items') data.push(ShoppingCart[i]);
                    data2.push(i[item])
                })
            })
            // console.log(data2)
        res.render('pages/shopping-cart', { title: "Shopping cart", data: data2 });
    } else {
        data2 = [];
        // console.log(data2);
        res.render('pages/shopping-cart', { title: "Shopping cart", data: data2 });
    }

});



router.get('/send-email', function(req, res, next) {

    var ShoppingCart = req.session.cart;
    var data = [];
    Object.keys(ShoppingCart).map(i => {
        if (i == 'items') data.push(ShoppingCart[i]);
    })
    var data2 = [];
    data.map(i => {
        Object.keys(i).map(item => {
            data2.push(i[item])
        })
    })

    pool.query(`select * from customer where user_id= ?`, req.query.username.trim(), function(error, results, fields) {
        if (error) console.log(error);
        else {
            console.log(results);
            var roomid = [];
            data2.map(function(i) {
                roomid.push(i.item[0].ROOM_ID);
            })

            let roomlength = roomid.length;
            console.log(roomid.join(';'), roomlength, results[0].CUS_ID);
            console.log(req.cookies.checkin);
            console.log(req.cookies.checkout);


            var sqlbill = "CALL Add_Bill(?,?,?,?,?,?,?,?,?,?,?,?,?)";

            pool.query(sqlbill, [roomid.join(';'), roomlength, req.cookies.checkin, req.cookies.checkout, results[0].CUS_ID, null, null, null, null, null, null, null, null], function(error, rs, fields) {
                if (error) {
                    console.log(error);
                    return res.send("no");
                } else {
                    console.log(rs[0]);
                    console.log(rs[0][0].BILL_ID);
                    var smtpTransport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: mailconfig.email,
                            pass: mailconfig.password
                        }
                    });
                    var mailOptions = {
                        to: results[0].CUS_EMAIL,
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


        }
    });


});


module.exports = router;