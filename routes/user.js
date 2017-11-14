var moduleUser = require('../models/user');
var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var auth = require('../config/auth');
var mongoose = require('mongoose');
var jwt = require("passport-jwt").Strategy;
var app = express();

mongoose.Promise = promise;

router.route('/login')
//Login route
    .get(function(req, res){
        if ((req.body.email || req.body.username) && req.body.password) {
            moduleUser.User.findOne({or: [ //look for user and give token
                { username: req.body.username},
                { email: req.body.email}
            ], password: req.body.password})
                .exec()
                .then(
                    function (result) {
                        if(!result) {
                            res.json({success: false, message: 'Please enter valid login details'});
                        }
                        else {
                            var token = 'JWT '+ jwt.sign(user, app.get('secretOrKey'),{
                                expiresInMinutes: 10080 //expires in 7 days
                            });
                            res.json({
                                success: true,
                                message: 'Token successful',
                                token: token
                            });
                        }
                    })
        }
        else{
            res.status(401).json({
                error: 'All information not provided'
            });
        }
    });
router.route('/register')
//Register route
    .post(function(req, res){
        if (req.body.username && req.body.email && req.body.password){
                var params = {};
                params.username = req.body.username;
                params.email = req.body.email;
                params.password = req.body.password;
                params.type = req.body.type;
                params.fullName = req.body.fullName;
                params.active = true;

            var user = new moduleUser.User(params);
            user.save(function (err) {
                if (err) {
                    res.status(400).json({
                        error: 'Internal server error'
                    });
                    console.log(err);
                }
                else {
                    res.status(201).json({
                        msg: 'User created successfully'
                    });
                }
            });
        }
        else{
            res.status(401).json({
                error: 'All information not provided'
            });
        }
    });
router.route('/me')
//ME route
    .get(function (req, res, next) {
        //route middleware to verify token
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        //decode token
        if (token) {
            jwt.Strategy(token, app.get('secretOrToken'), function (err, decoded) {
                if(err){
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                }
                else{
                    req.decoded = decoded;
                    next();
                }
            });
            moduleUser.User
                .find({active: true, deleted: false, username:  username})
                .select('username email type fullName active')
                .exec()
                .then(function (result) {
                    if (result) {
                        res.status(200).json(result);
                    }
                    else
                        res.status(400).json({
                            error: 'Internal server error'
                        });
                })
                .catch(function (err) {
                });
        }
        else {
            res.status(404).json({
                error: 'Token not found'
            });
        }
    });

module.exports = router;