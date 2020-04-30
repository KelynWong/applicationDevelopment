//Start server via "npm start"
//This database uses ElephantSQL that uses PostgreSQL as a service.

//Require statements
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//app.use statements
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const database = require('./database')
//POST 1. Insert Advertisement details
app.post('/insertAdvertisement/', function (req, res, next) {
  const { data } = req.body;
  database.insertAdvertisement(data, (error, result) => {
    if (error) { //Return error if error.
      console.log("data: ", data)
      return next(error);
    }
    console.log(result)
    res.json(data);
  });
});

//GET 2. Retrieve all data
app.get('/basic/Alldata', function (req, res, next) {
  const { companyId, audienceReach, page, pageSize } = req.query;
  database.getData(companyId, audienceReach, page, pageSize, (error, result) => {
    if (error) {
      return next(error);
    }
    res.json(result);
  })
});


// catch error 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ //Not sending a html file, thus we send a json.
    error: err.message,
    code: err.status || 500,
  });
});

module.exports = app;
