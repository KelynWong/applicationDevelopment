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
app.post('/basic/insert/', function (req, res, next) {
  const { data } = req.body;
  database.insertAdvertisement(data, (error, result) => {
    if (error) { //Return error if error.
      console.log("data: ", data)
      res.json({"error": error.detail, "code": error.code});
      // return next(error);
    }
    console.log(result)
    res.json({"result": "success"});
  });
});

// POST 2. Retrieve all data ---
app.post('/basic/allData', function (req, res) {
  console.log(req.body);
  const { companyId, audienceReach, pageNo, pageSize } = req.body;

  database.getData(companyId, audienceReach, pageNo, pageSize, (error, result) => {
    if(result.length == 0){
      return res.json({"error": "Not found", "code": "404"});
    }else if (error) {
      return res.json({"error": error.detail, "code": error.code});
      // return next(error);
    }
    console.log(result);
    res.json(result);
  })
});

// GET 3. Retrieve all number of row data in table: advertisement ---
app.post('/extra/getRowCount', function (req, res, next) {
  const { companyId, audienceReach } = req.body;
  database.getRowCount(companyId, audienceReach, (error, result) => {
    if(result.length == 0){
      return res.json({"error": "Not found", "code": "404"});
    }else if (error) {
      return res.json({"error": error.detail, "code": error.code});
      // return next(error);
    }
    return res.json(result);
  })
});

// POST 4. Retrieve data for chart ---
app.post('/basic/allChartData', function (req, res) {
  console.log(req.body);
  const { optionIds } = req.body;

  database.getDataForChart(optionIds, (error, result) => {
    if(result.length == 0){
      return res.json({"error": "Not found", "code": "404"});
    }else if (error) {
      return res.json({"error": error.detail, "code": error.code});
      // return next(error);
    }
      var optionType = []
      for (let i = 0; i < result.length; i++) {
        optionType.push(result[i].adtype)
      }
      var same = ''
      for (var j = 1; j < optionType.length; j++) {
        if(optionType[0] == optionType[j]){
          same = 'true'
        }else{
          same = 'false'
        }
      }
      if(same == 'false'){
        return res.json({"error": "Different ad type", "code": "404"});
      }else if(same == 'true'){
        console.log(result);
        res.json(result);
      }
  })
});

// POST 5. Get tabulation results ---
app.post('/basic/result', function (req, res, next) {
  const { optionIds, budget } = req.body;
  console.log("optionids: " + optionIds)
  console.log("budget: " + budget)
  database.getOptionsForComputation(optionIds, (error, result) => {
    if(result.length == 0){
      return res.json({"error": "Not found", "code": "404"});
    }else if (error) {
      return res.json({"error": error.detail, "code": error.code});
      // return next(error);
    }
      var audience = [];
      var cost = [];
      var optionType = []
      for (let i = 0; i < result.length; i++) {
        audience.push(result[i].audiencereach)
        cost.push(Number(result[i].cost))
        optionType.push(result[i].adtype)
      }
      var same = ''
      for (var j = 1; j < optionType.length; j++) {
        if(optionType[0] == optionType[j]){
          same = 'true'
        }else{
          same = 'false'
        }
      }
      if(same == 'false'){
        return res.json({"error": "Different ad type", "code": "404"});
      }else{
        var updatedCost= []
        var payment = []
        if(optionType[0]=="Not Fixed" && same=="true"){
          updatedCost = algo.fractionalKnapsack(audience, cost, budget)
          for (let k = 0; k < result.length; k++) {
            console.log("Number(result[k].cost): " +Number(result[k].cost))
            if(parseInt(result[k].cost) == parseInt(updatedCost[k])){
              payment.push('Full')
            }else if(parseInt(updatedCost[k]) == 0){
              payment.push('No')
              result[k].audiencereach = 0
            }else{
              payment.push('Partial')
              var factor = result[k].cost/updatedCost[k]
              var updatedAudience = result[k].audiencereach/factor
              result[k].audiencereach = updatedAudience
            }
            result[k].cost = updatedCost[k]
            result[k]['payment']=payment[k]
          }
        }else if(optionType[0]=="Fixed" && same=="true"){
          var n = result.length
          // console.log("RESULTS OF ALGO: "+ algo.fullKnapsack(audience, cost, budget, n))
        }
        res.json(result)
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