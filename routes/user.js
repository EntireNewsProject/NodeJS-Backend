var moduleUser = require('../models/user');
var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var authHelpers = require('../config/auth');
var cfg = require("../config/settings.js");

mongoose.Promise = promise;

router.post('/login', function (req, res) {
    if (req.body.username && req.body.password) {
        var query;
        // check if email provided instead of username
        if (req.body.username.indexOf('@') !== -1) query = {email: req.body.username, password: req.body.password};
        else query = {username: req.body.username, password: req.body.password};
        moduleUser.User.findOne(query)
            .exec()
            .then(function (user) {
                if (user) {
                    user.password = 'password';
                    res.json({
                        user: user,
                        success: true,
                        message: 'Login successful',
                        token: 'Bearer ' + jwt.sign(user.toObject(), cfg.jwtSecret, {expiresIn: '14 days'})
                        //token: jwt.sign(user.toObject(), cfg.jwtSecret, {expiresIn: '14 days'})
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
router.post('/register', function (req, res) {
    //console.log(req.body);
    if (req.body.username && req.body.email && req.body.password) {
        //TODO check for illegal user names
        var params = {};
        params.username = req.body.username;
        params.email = req.body.email;
        params.password = req.body.password;
        if (params.fullName) params.fullName = req.body.fullName;
        params.active = true;
        var user = new moduleUser.User(params);
        user.save(function (err) {
            if (err) {
                res.status(400).json({
                    error: 'Internal server error'
                });
                console.log(err);
            } else {
                res.status(201).json({
                    msg: 'User created successfully'
                });
            }
        });
    } else {
        res.status(401).json({
            error: 'All information not provided'
        });
    }
});

router.get('/authenticate', authHelpers.isAuthUser, function (req, res) {
    res.status(200).json({
        user: req.user,
        success: true,
        authenticated: true,
        message: "Successfully logged in",
        token: 'Bearer ' + jwt.sign(req.user.toObject(), cfg.jwtSecret, {expiresIn: '14 days'})
    });
});

module.exports = router;