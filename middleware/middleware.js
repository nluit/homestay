module.exports.auth = function(req, res, next) {
    console.log(req.cookies.email)
    console.log(req.cookies.password)

    if (!req.cookies.email) {

        res.redirect('/Auth/login');
        return;

    }
    if (req.cookies.email != "admin@gmail.com" && req.cookies.password != "admin123") {

        res.redirect('/Auth/login');
        return;
    }
    next();

}