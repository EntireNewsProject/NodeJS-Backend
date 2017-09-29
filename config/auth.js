var passport = require('passport');

function isAuth(req, res, next) {
    passport.authenticate('jwt', 'gator239&ade%$#@', function (err, user, info) {
        if(!err && !info && user)
            return next();
        res.status(401).json({message: 'Login Expired'});
    })(req, res, next);
}

module.exports = {
    isAuth: isAuth
}