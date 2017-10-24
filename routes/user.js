var moduleUser = require('../models/user');
var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var auth = require('../config/auth');
var mongoose = require('mongoose');

mongoose.Promise = promise;

router.route('/user')
    .get(function (req, res) {
        var username = req.user;
        if (username) {
            moduleUser.User
                .find({active: true, deleted: false, username:  username})
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
                error: 'Username not found'
            });
        }
    })
    .post(function(req, res){
        if (req.body.email && req.body.password) {
            var params = {};
            params.email = req.body.email;
            params.password = req.body.password;
            params.active = true;

            var user = new moduleUser.User(params);
            user.save(function (err) {
                if (err)
                    res.status(400).json({
                        error: 'Internal server error'
                    });
                else
                    res.status(201).json({
                        msg: 'Item created successfully'
                    });
            });
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