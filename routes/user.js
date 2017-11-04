var moduleUser = require('../models/user');
var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var auth = require('../config/auth');
var mongoose = require('mongoose');
var jwt = require("passport-jwt").Strategy;
var app = express();

mongoose.Promise = promise;

router.route('/user')
    //Login route
    .post(function(req, res){
        if (req.body.email && req.body.password) {
            var params = {};
            params.email = req.body.email;
            params.password = req.body.password;
            params.active = true;

            var user = moduleUser.User(params);

            user.findOne({ //look for user and give token
                username: req.body.username
            }, function (err, user) {
                if(!user) {
                    res.json({success: false, message: 'User Not Found.'});
                }
                else {
                    if(user.password !== req.body.password){
                        res.json({ success: false, message:'Wrong Password'});
                    }
                    else{
                        var token = 'JWT '+ jwt.sign(user, app.get('secretOrKey'),{
                            expiresInMinutes: 10080 //expires in 7 days
                        });

                        res.json({
                            success: true,
                            message: 'Token successful',
                            token: token
                        });
                    }
                }


            })
            /*user.load(function (err) {
                if (err)
                    res.status(400).json({
                        error: 'Internal server error'
                    });
                else
                    res.status(201).json({
                        msg: 'Login successful'
                    });
            });*/
        }
        else{
            res.status(401).json({
                error: 'All information not provided'
            });
        }
    })

    //Register route
    .post(function(req, res){
        if (req.body.email && req.body.password){
            var params = {};
            params.email = req.body.email;
            params.password = req.body.password;
            params.active = true;

            if (req.body.email) params.email = req.body.email;
            if (req.body.password) params.password = req.body.password;
            //TODO: Check for unique username and email

            var user = new moduleUser.User(params);
            user.save(function (err) {
                if (err)
                    res.status(400).json({
                        error: 'Internal server error'
                    });
                else
                    res.status(201).json({
                        msg: 'User created successfully'
                    });
            });
        }
        else{
            res.status(401).json({
                error: 'All information not provided'
            });
        }
    })
    //ME route
    .get(function (req, res, next) {
        var username = req.body.username;

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
                .select('username fullName')
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
    })

    .delete(auth.isAuth, function(req, res){
        res.sendStatus();
    });

router.route('/user/:id')
    .get(function(req, res){
        res.send({user: []});
    })
    .post(function(req, res){
        res.sendStatus(201);
    });
module.exports = router;