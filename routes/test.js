var moduleNews = require('../models/news');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.Promise = promise;


router.route('/dups')
    .get(function (req, res) {
        // noinspection JSUnresolvedVariable
        console.log(req.body.dups);

        res.status(202).json({message: 'Yippee! Account updated...'});
    });

module.exports = router;
