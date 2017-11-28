var passport = require('passport');
var moduleUser = require('../models/user');
var JwtStrategy = require("passport-jwt").Strategy;
var JwtExtract = require("passport-jwt").ExtractJwt;
var cfg = require("./settings.js");

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new JwtStrategy({
        secretOrKey: cfg.jwtSecret,
        jwtFromRequest: JwtExtract.fromAuthHeaderAsBearerToken()
    }, function (payload, done) {
        moduleUser.User.findById(payload._id)
            .exec()
            .then(function (user) {
                    if (user) done(null, user);
                    else done(null, false);
                }
            )
            .catch(function (err) {
                return done(err, false);
            });
    }
));