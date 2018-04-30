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
            query = {email: req.body.username};
        else
            query = {username: req.body.username};
        moduleUser.User.findOne(query)
            .select(cfg.userFields)
            .exec()
            .then(user => {
                console.log(user);
                if (user) {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            res.json({
                                message: 'Login successful',
                                user: user,
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
                    console.log(err.name + ':', err.message);
                    res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }
            })
    } else {
        res.status(401).json({
            message: 'All information not provided'
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
                    //TODO create empty similar/suggestion records
                    res.status(201).json({
                        message: 'User created successfully'
                    });
                else
                    res.status(400).json({
                        message: 'An error occurred, please try again later.'
                    });
            })
            .catch(err => {
                console.log(err.name + ':', err.message, true);
                // mongoose validation failed
                if (err.errors) {
                    let msg = '';
                    for (const e of Object.values(err.errors))
                        msg += e.message + ', ';
                    msg = msg.substring(0, msg.length - 2);
                    res.status(400).json({message: msg});
                    // something else
                } else res.status(404).json({message: err.message});
            });
    } else {
        res.status(401).json({
            message: 'All information not provided'
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
    res.status(200).json({
        user: user,
        token: 'Bearer ' + jwt.sign(req.user.toObject(),
            cfg.jwtSecret, {expiresIn: '14 days'})
    });
});

//TODO me PUT

module.exports = router;