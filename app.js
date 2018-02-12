var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var news = require('./routes/news');
var user = require('./routes/user');
var test = require('./routes/test');
var passport = require('passport');
var cfg = require("./config/settings.js");
var app = express();

mongoose.connect(cfg.database, {
    useMongoClient: true
});

var db = mongoose.connection;
//throw error if db connection issue
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// noinspection JSUnresolvedFunction
app.use(passport.initialize());
require('./config/passport');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/api/news', news);
app.use('/api/user', user);
app.use('/api/test', test);

// catch 404 and forward to error handler
// noinspection JSUnusedLocalSymbols
app.use(function (err, req, res) {
    err = new Error('Not Found');
    err.status = 404;
    //next(err);
});

module.exports = app;
