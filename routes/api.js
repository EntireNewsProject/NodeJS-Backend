var express = require('express');
var router = express.Router();

router.get('/news', function (req, res) {
    //newsart.find().limit(limit).skip(page * limit)
    res.send({news: []});
});

router.post('/news', function (req, res) {
    res.sendStatus(201);
});

router.get('/news/:id', function (req, res) {
    res.send({news: []});
});

module.exports = router;