var passport = require('passport');
var cfg = require("./settings.js");

function isAuth(req, res, next) {
    // noinspection JSUnresolvedFunction
    passport.authenticate('jwt', cfg.jwtSession, function (err, user, info) {
        if (!err && !info && user)
            return next();
        res.status(401).json({message: 'Login expired. Please login again.'});
    })(req, res, next);
}

function isAuthUser(req, res, next) {
    // noinspection JSUnresolvedFunction
    passport.authenticate('jwt', cfg.jwtSession, function (err, user, info) {
        if ((!err || !info) && user) {
            user.password = 'password';
            req.user = user;
            return next();
        }
        res.status(401).json({message: "Login expired. Please login again."});
    })(req, res, next);
}

module.exports = {
    isAuth: isAuth,
    isAuthUser: isAuthUser
};