var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var udp = require('dgram');

var routes = require('./routes/index');
var events = require('./events');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', exphbs({defaultLayout: 'base.html'}));

// Main routes
app.use('/', routes);

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

// Listen for UDP messages on port 6306
var udpServer = udp.createSocket('udp4', function(msg, remote) {
  console.log('Received message from ' + remote.address + ':' + remote.port);
  try {
    var data = JSON.parse(msg);
    console.log(data);

    // Send out as event
    events.emit('received', data);

  } catch(err) {
    console.error('Error parsing message: ' + err);
  }
});

udpServer.bind(6306);

module.exports = app;
