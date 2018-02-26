const passport = require('passport');
const moduleUser = require('../models/user');
const JwtStrategy = require("passport-jwt").Strategy;
const JwtExtract = require("passport-jwt").ExtractJwt;
const cfg = require("./settings.js");

// noinspection JSUnresolvedFunction
/**
 * These can be (may be in the future) more complex
 * if need be. Depends on how you are handling authentication
 * and serialization
 */
passport.serializeUser(function (user, done) {
    done(null, user);
});
// noinspection JSUnresolvedFunction
passport.deserializeUser(function (user, done) {
    done(null, user);
});

// noinspection JSUnresolvedFunction
passport.use(new JwtStrategy({
        secretOrKey: cfg.jwtSecret,
        jwtFromRequest: JwtExtract.fromAuthHeaderAsBearerToken()
    }, function (user, done) {
        moduleUser.User.findById(user._id)
            .select(cfg.userFields)
            .exec()
            .then(function (user) {
                    if (user) done(null, user);
                    else done(null, false);
                }
            )
            .catch(function (err) {
                return done(err, false);
            });
    })
);
