const passport = require('passport');
const cfg = require("./settings.js");

function isAuth(req, res, next) {
    //console.log('isAuth');
    // noinspection JSUnresolvedFunction
    passport.authenticate('jwt', cfg.jwtSession, function (err, user, info) {
        if (!err && !info && user)
            return next();
        res.status(401).json({message: 'Login expired. Please login again.'});
    })(req, res, next);
}

// will not work without login
function isAuthUser(req, res, next) {
    //console.log('isAuthUser');
    // noinspection JSUnresolvedFunction
    passport.authenticate('jwt', cfg.jwtSession, function (err, user, info) {
        if ((!err || !info) && user) {
            req.user = user;
            return next();
        }
        res.status(401).json({message: "Login expired. Please login again."});
    })(req, res, next);
}

// will work without login
function getAuthUser(req, res, next) {
    //console.log('getAuthUser');
    // TODO is auth provided and is invalid, show err msg
    // noinspection JSUnresolvedFunction
    passport.authenticate('jwt', cfg.jwtSession, function (err, user, info) {
        if ((!err || !info) && user) {
            req.user = user;
            return next();
        }
        return next();
    })(req, res, next);
}

// cannot login/register if already logged in
function isNotAuth(req, res, next) {
    //console.log('isNotAuth');
    if (!req.isAuthenticated())
        return next();
    res.json({authenticated: true, success: true, message: 'Already login in.'});
}

module.exports = {
    isAuth: isAuth,
    isAuthUser: isAuthUser,
    getAuthUser: getAuthUser,
    isNotAuth: isNotAuth
};