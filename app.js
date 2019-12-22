var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var usersRouter = require('./routes/admin/users');
var adminRouter = require('./routes/admin/admin');
var featureRouter = require('./routes/admin/feature');
var facilityRouter = require('./routes/admin/facility');
var roomRouter = require('./routes/admin/room');
var serviceRouter = require('./routes/admin/service');
var indexPageRouter = require('./routes/page/index');
var loginPageRouter = require('./routes/login/login');
var AuthloginPageRouter = require('./routes/login/Auth-login');
var cartRouter = require('./routes/page/cart');
var searchRouter = require('./routes/page/search');
var contactRouter = require('./routes/page/contact');
var customerRouter = require('./routes/admin/customer');
var billRouter = require('./routes/admin/bill');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'secretiveShoppingCart',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    res.locals.user = req.cookies;
    res.locals.checkin = req.cookies;
    res.locals.checkout = req.cookies;
    next();
});


app.use('/users', usersRouter);
app.use('/', adminRouter);
app.use('/', featureRouter);
app.use('/', facilityRouter);
app.use('/', roomRouter);
app.use('/', serviceRouter);
app.use('/', indexPageRouter);
app.use('/', loginPageRouter);
app.use('/', AuthloginPageRouter);
app.use('/', cartRouter);
app.use('/', searchRouter);
app.use('/', contactRouter);
app.use('/', customerRouter);
app.use('/', billRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;