const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const news = require('./routes/news');
const user = require('./routes/user');
const test = require('./routes/norman');
const passport = require('passport');
const cfg = require("./config/settings.js");
const app = express();

mongoose.connect(cfg.database, {
    useMongoClient: true
});

const db = mongoose.connection;
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
