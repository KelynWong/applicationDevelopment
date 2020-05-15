// App.js Script
// Name: Wong En Ting Kelyn
// Name: Teh Huan Xi Kester
// Class: DIT/FT/2B/01

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

const cors = require("cors");
app.use(cors());
app.options('*', cors());

const database = require('./database')
const algo = require('./algo')
// POST 1. Insert Advertisement details ---
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

// POST 2. Retrieve all data ---
app.post('/basic/allData', function (req, res) {
  console.log(req.body);
  const { companyId, audienceReach, pageNo, pageSize } = req.body;

  database.getData(companyId, audienceReach, pageNo, pageSize, (error, result) => {
    if (error) {
      return next(error);
    }
    console.log(result);
    res.json(result);
  })
});

// GET 3. Retrieve all number of row data in table: advertisement ---
app.post('/extra/getRowCount', function (req, res, next) {
  const { companyId, audienceReach } = req.body;
  database.getRowCount(companyId, audienceReach, (error, result) => {
    if (error) {
      return next(error);
    }
    return res.json(result);
  })
});

// POST 4. Retrieve data for results ---
app.post('/basic/allDataForResults', function (req, res) {
  console.log(req.body);
  const { optionIds } = req.body;

  database.getData(optionIds, (error, result) => {
    if (error) {
      return next(error);
    }
    console.log(result);
    res.json(result);
  })
});

// POST 5. Get results ---
app.post('/basic/getResults', function (req, res, next) {
  const { optionIds, budget } = req.body;
  console.log("optionids: " + optionIds)
  console.log("budget: " + budget)
  database.getOptionsForComputation(optionIds, (error, result) => {
    if (error) {
      return next(error);
    }
    var audience = [];
    var cost = [];
    var optionType = []
    for (let i = 0; i < result.length; i++) {
      audience.push(result[i].audiencereach)
      cost.push(result[i].cost)
      optionType.push(result[i].adtype)
    }
    console.log("audience array: "+audience)
    console.log("cost array: "+cost)
    console.log("adType: "+optionType)
    for (let j = 1; j <= optionType.length; j++) {
      if(optionType[j] != optionType[j-1]){
        return error
      }else if(optionType[0] == "Not Fixed"){
        console.log("RESULTS OF ALGO: "+ algo.fractionalKnapsack(audience, cost, budget))
        res.json(result)
      }else{
        // console.log("RESULTS OF ALGO: "+ algo.fullKnapsack(audience, cost, budget))
      }
    }
    
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
