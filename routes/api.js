var express = require('express');
var router = express.Router();
var moduleNews = require('../models/news');


moduleNews.News.find().sort({createdAt: -1})
    .limit(MAX_LIMIT)
    .select(FIELDS)
    .exec()
    .then(function (result) {
        if(!result) res.sendStatus(500);
        else res.status(200).json(result);
    }),
router.get('/news', function (req, res) {
    //newsart.find().limit(limit).skip(page * limit)
    res.send({news: []});
}),

router.post('/news', function (req, res) {
    res.sendStatus(201);
}),

router.get('/news/:id', function (req, res) {
    res.send({news: []});
}),

module.exports = router;