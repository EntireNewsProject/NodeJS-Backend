var passport = require('passport');
var cfg = require("./settings.js");

function isAuth(req, res, next) {
    //console.log(req.headers.authorization);
    passport.authenticate('jwt', cfg.jwtSession, function (err, user, info) {
        if (!err && !info && user)
            return next();
        res.status(401).json({authenticated: false, success: false, message: 'Login expired. Please login again.'});
    })(req, res, next);
    //return next();
}

function isAuthUser(req, res, next) {
    //console.log(req.headers.authorization);
    passport.authenticate('jwt', cfg.jwtSession, function (err, user, info) {
        if ((!err || !info) && user) {
            req.user = user;
            return next();
        }
        res.status(401).json({authenticated: false, success: false, message: "Login expired. Please login again."});
    })(req, res, next);
}

module.exports = {
    isAuth: isAuth,
    isAuthUser: isAuthUser
};