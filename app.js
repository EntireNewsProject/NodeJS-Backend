var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var api = require('./routes/api');
var app = express();

//new branch develop created. This branch is for Sif, Alex, and Khushal to work together on the backend
//Local database connection
mongoose.connect('mongodb://EntireNewsApp:JNuhg6B7T8jhj8Y68KNKh@127.0.0.1:27569/entirenews?authSource=entirenews', {
    useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));   //throw error if db connection issue

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.use

// catch 404 and forward to error handler
app.use(function (err, req, res) {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);
});

module.exports = app;
