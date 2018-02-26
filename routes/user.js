const moduleUser = require('../models/user'),
    express = require('express'),
    router = express.Router(),
    promise = require('bluebird'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    authHelpers = require('../config/auth'),
    cfg = require("../config/settings.js");

mongoose.Promise = promise;

router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        let query;
        // check if email provided instead of username
        if (req.body.username.indexOf('@') !== -1)
            query = {email: req.body.username, password: req.body.password};
        else
            query = {username: req.body.username, password: req.body.password};
        moduleUser.User.findOne(query)
            .select(cfg.userFields)
            .exec()
            .then(function (user) {
                if (user) {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            user.password = 'password';
                            res.json({
                                user: user,
                                message: 'Login successful',
                                token: 'Bearer ' + jwt.sign(user.toObject(),
                                    cfg.jwtSecret, {expiresIn: '14 days'})
                            });
                        } else {
                            res.status(400).json({
                                message: 'Invalid credentials, please try again.'
                            });
                        }
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'Please enter valid login details'
                    });
                }
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "An error occurred please try again later"
                    });
                }
            })
    } else {
        res.status(401).json({
            error: 'All information not provided'
        });
    }
});
router.post('/register', (req, res) => {
    //console.log(req.body);
    if (req.body.username && req.body.email && req.body.password) {
        //TODO check for illegal user names
        const params = {};
        params.username = req.body.username;
        params.email = req.body.email;
        params.password = req.body.password;
        if (params.fullName) params.fullName = req.body.fullName;
        params.active = true;
        const user = new moduleUser.User(params);

        user.save()
            .then(user => {
                if (user)
                    res.status(201).json({
                        msg: 'User created successfully'
                    });
                else
                    res.status(400).json({
                        message: 'An error occurred, please try again later.'
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({
                    error: 'Internal server error'
                });
            });
    } else {
        res.status(401).json({
            error: 'All information not provided'
        });
    }
});

router.get('/authenticate', authHelpers.isAuthUser, (req, res) => {
    res.status(200).json({
        message: 'User is logged in.'
    });
});

router.get('/me', authHelpers.isAuthUser, (req, res) => {
    const user = req.user;
    user.password = 'password';
    res.status(200).json({
        user: user,
        token: 'Bearer ' + jwt.sign(req.user.toObject(),
            cfg.jwtSecret, {expiresIn: '14 days'})
    });
});

//TODO me PUT

module.exports = router;