var moduleNews = require('../models/news');
var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var auth = require('../config/auth');
//var MAX_LIMIT = 12;
var mongoose = require('mongoose');
mongoose.Promise = promise;

// moduleNews.News.find().sort({createdAt: -1})
//     .limit(MAX_LIMIT)
//     //.select(FIELDS)
//     .exec()
//     .then(function (result) {
//         if(!result) res.sendStatus(500);
//         else res.status(200).json(result);
//     });

router.route('/news')
    .get(function (req, res) {
        //newsart.find().limit(limit).skip(page * limit)
        res.send({News: []});
    })
    .post(auth.isAuth, function (req, res) {
        //The res.user check if the user is making the request. If not then the else statement is executed
        if (req.user) {
            var news = new moduleNews.News({
                title: req.body.title,
                source: req.body.source,
                //add any other things to be present in the main home page and are saved by the python code
            });
            news.save(function (err) {
                if (err) return res.sendStatus(500)
             })
        }
        //The else below returns an error if a non user is trying to add data to the database
        else{
            res.sendStatus(401);
        }
        res.sendStatus(201);
    });

router.route('/news/:id')
    .get(function (req, res) {
        res.send({news: []});
    })
    .post(function (req, res) {
        res.sendStatus(201);
    });

module.exports = router;