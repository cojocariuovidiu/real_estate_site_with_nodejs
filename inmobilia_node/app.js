var express = require('express');
var session = require('express-session');
//var stormpath = require('express-stormpath');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var util = require('util');
var domain = require('domain');
var aws = require('aws-sdk');
var multer = require('multer');
var accessKey = 'AKIAIRTPEGYZ22YO7YZA';
var secretAccessKey = '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';

aws.config.update({
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
});


var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/inmobilia", {native_parser:true});

var app = express();
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


var routes = require('./routes/index');
var users = require('./routes/users');
var properties = require('./routes/properties');
var services = require('./routes/services');
var locations = require('./routes/locations');



app.set('views', './views');
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator({
 customValidators: {
    isArray: function(value) {
        return Array.isArray(value);
    },
    gte: function(param, num) {
        return param >= num;
    }
 }
}));
app.use(cookieParser());
app.use(session({secret: "Inmobilia$123*9"}));

app.use('/properties', properties);
app.use('/services', services);
app.use('/locations', locations);
app.use('/', routes);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var d = domain.create();

d.on('error', function(err) {
  console.error(err);
});

module.exports = app;




app.listen(3000);