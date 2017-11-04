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
    .get(function (req, res) {  //me
        var username = req.body.username;
        var token; //TODO: find token
        if (token) {
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
    .post(function(req, res){ // register
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
    .post('/passport', function(req, res){ // login
        if (req.body.email && req.body.password) {
            var params = {};
            params.email = req.body.email;
            params.password = req.body.password;
            params.active = true;

            if (req.body.email) params.email = req.body.email;
            if (req.body.password) params.password = req.body.password;

            var user = moduleUser.User(params);

            user.findOne({ //look for user and give token
                username: req.body.username
            }, function (err, user) {
                if(err) throw err;

                if(!user) {
                    res.json({success: false, message: 'User Not Found.'});
                }
                else if(user){
                    if(user.password !== req.body.password){
                        res.json({ success: false, message:'Wrong Password'});
                    }
                    else{
                        var token = 'JWT '+ jwt.sign(user, app.get('secretOrKey'),{
                            expiresInMinutes: 1440 //expires in 24 hours
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