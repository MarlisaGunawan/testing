var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var db = require('./db');
var indexRouter = require('./routes/index');
var queueRouter = require('./routes/queue');
var visitorsRouter = require('./routes/visitors');

db.connect();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// Allow the Angular dev server (localhost:4200) to call this API.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/queue', queueRouter);
app.use('/api/visitors', visitorsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler: JSON for /api, HTML page for everything else
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  if (req.originalUrl.indexOf('/api') === 0) {
    return res.json({ message: err.message });
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.render('error');
});

module.exports = app;
