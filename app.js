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
var mongoDB = 'mongodb://127.0.0.1:27017';
mongoose.connect(mongoDB, {
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

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// app.use(function (err, req, res) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;