var moduleNews = require('../models/news');
var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var auth = require('../config/auth');
var mongoose = require('mongoose');

mongoose.Promise = promise;

var MAX_LIMIT = 12;

var createSlug = function (title) {
    return title.replace('\r', '-').replace(' ', '-').toLowerCase();
};

var createSubtitle = function (article) {
    return article.substring(0, 128).replace('\n\r', ' ').replace('\n', ' ').replace('\r', ' ');
};

router.route('/news')
//this route will get the data from the data base and respond to the request with required fields
    .get(function (req, res) {
        var page = Math.max(1, parseInt(req.query.page));  //used by skip for skipping the already loaded news
        var source = req.query.source;
        if (source) {
            moduleNews.News
                .find({published: true, deleted: false, source: source})
                .sort({createdAt: -1})
                .skip((page - 1) * MAX_LIMIT)    //skips already loaded news
                .limit(MAX_LIMIT)   //loads 12 news from database
                .select('title source cover slug subtitle url saves views date createdAt')
                .exec()
                .then(function (result) {
                    if (result) {
                        res.status(200).json(result);
                    } else
                        res.status(400).json({
                            error: 'Internal server error'
                        });
                })
                .catch(function (err) {
                });
        } else {
            res.status(404).json({
                error: 'Source not provided'
            });
        }
    })
    //this route will post the json data generated by python to the database
    //add auth.isAuth middleware once done testing post request locally
    .post(function (req, res) {
        //The res.user checks if the user is making the request. If not then the else statement is executed
        // if (!req.user) {
        //     res.status(401).json({
        //         error: 'Unauthorized'
        //     });
        // } else
        if (req.body.title && req.body.source) {
            var params = {};
            params.title = req.body.title;
            params.source = req.body.source;
            if (req.body.cover) params.cover = req.body.cover;
            if (req.body.article) {
                params.article = req.body.article;
                params.subtitle = createSubtitle(params.article);
            }
            if (req.body.url) params.url = req.body.url;
            params.slug = createSlug(params.title);
            params.published = true;
            params.deleted = false;

            var news = new moduleNews.News(params);
            news.save(function (err) {
                if (err)
                    res.status(400).json({
                        error: 'Internal server error'
                    });
                else
                    res.status(201).json({
                        msg: 'Item created successfully'
                    });
            });
        } else {
            res.status(401).json({
                error: 'All information not provided'
            });
        }
    })
    .delete(auth.isAuth, function (req, res) {
        res.sendStatus();
    });

router.route('/news/:id')
    .get(function (req, res) {
        var id = req.params.id;
        if (id) {
            moduleNews.News
            //this will find the specific news using the ID associated with it and return all fields
                .findOneAndUpdate({_id: id}, {$inc: {views: 1}}, {new: true})
                .exec()
                .then(function (result) {
                    //checks if result obtained and then return status 200 or return status 400
                    if (result) {
                        res.status(200).json(result);
                    }
                    else {
                        res.status(400).json({
                            Error: 'Internal Server Error'
                        });
                    }
                })
                .catch(function (err) {
                });
        }
        //if ID not found then return status 404 with error message "Error: 'ID not provided'"
        else {
            res.status(404).json({
                Error: 'ID not provided'
            });
        }
    })
    .post(function (req, res) {
        res.sendStatus(201);
    });

router.route('/news/:id/save')
    .get(function (req, res) {
        var savecheck = req.query.savecheck;
        var id = req.params.id;
        if (savecheck === 'true') {
            if (id) {
                moduleNews.News
                    .findOneAndUpdate({_id: id}, {$inc: {saves: 1}}, {new: true})
                    .exec()
                    .then(function (result) {
                        if (result) {
                            res.status(200).json(result)
                        } else {
                            res.status(400).json({
                                Error: 'Internal Server Error'
                            });
                        }
                    })
            } else {
                res.status(404).json({
                    Error: 'ID not provided'
                });
            }
        } else if(savecheck === 'false') {
            if (id) {
                moduleNews.News
                    .findOneAndUpdate({_id: id}, {$inc: {saves: -1}}, {new: true})
                    .exec()
                    .then(function (result) {
                        if (result) {
                            res.status(200).json(result)
                        } else {
                            res.status(400).json({
                                Error: 'Internal Server Error'
                            });
                        }
                    })
            } else {
                res.status(404).json({
                    Error: 'ID not provided'
                });
        }
    });

module.exports = router;
