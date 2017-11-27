var moduleUser = require('../models/user');
var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
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
                    //console.log(user);
                    user.password = 'password';
                    res.json({
                        user: user,
                        success: true,
                        message: 'Login successful',
                        //token: 'JWT ' + jwt.sign(user.toObject(), cfg.jwtSecret, {expiresIn: '14 days'})
                        token: jwt.sign(user.toObject(), cfg.jwtSecret, {expiresIn: '14 days'})
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
    }
    else {
        res.status(401).json({
            error: 'All information not provided'
        });
    }
});

router.get('/authenticate', function (req, res) {
    jwt.verify(req.headers.authorization, cfg.jwtSecret, function (err, result) {
        if (result) {
            delete result.iat;
            delete result.exp;
            res.json({
                success: true,
                authenticated: true,
                message: 'You is logged in.',
                token: jwt.sign(result, cfg.jwtSecret, {expiresIn: '14 days'}),
                user: result
            });
        }
        else
            res.json({
                success: false,
                authenticated: false,
                message: 'Please login again.'
            });
    });
});

module.exports = router;