var passport = require('passport');
var LocalStrategy = require('passport-local'.Strategy);
var User = require('/models/user');
var JwtStrategy = require("passport-jwt").Strategy;
var JwtExtract = require("passport-jwt").ExtractJwt;

passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deSerializeUser(function(user, done){
    done(null, user);
});

passport.use(new JwtStrategy({
    secretOrKey: 'gator239&ade%$#@',
    jwtFromRequest: JwtExtract.fromAuthHeader()
},  function (payload, done){
        User.findById(payload._doc._id, function (err, user) {
            if(err)
                return done(err, false);
            if(!user)
                return done(null, false, {message: 'Incorrect username'});
            return done(null, user);
        });
    }
));

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, {message: 'Incorrect username.'});
            if (!user.validPassword(password))
                return done(null, false, {message: 'Incorrect password.'});
            return done(null, user);
        });
    }
));

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd'
    },
    function (username, password, done) {
    }
));
