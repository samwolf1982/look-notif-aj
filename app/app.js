var express = require('express');
var nconf = require('nconf');
var path =require('path');

// var favicon = require('serve-favicon');
nconf.argv().env().file({ file:path.join( __dirname , 'config/config.json') });

var cors = require('cors')

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var routeNoticeCount = require('./routes/noticeCount');
var routeNoticeList = require('./routes/noticeList');
var routeUpload = require('./routes/upload');


var app = express();

var corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
        // if (whitelist.indexOf(origin) !== -1 || !origin) {
        //     callback(null, true)
        // } else {
        //     callback(new Error('Not allowed by CORS'))
        // }
    }
}
app.use(cors(corsOptions))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', routes);
app.use('/noticeCount/:userId',cors(corsOptions), routeNoticeCount);
app.use('/noticeList/:userId', routeNoticeList);


// no delete
app.use('/upload', routeUpload);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

if(0){ // local dev
    app.listen(nconf.get('port'), function () {
        console.log('Example app listening on port 1337!');
    });
}
