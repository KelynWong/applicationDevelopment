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

app.get('/', (req, res) => {
  return res.json({
      message: "Welcome to JiBaBoom - <freerealestate>",
      availableEndpoints: [
           'POST /basic/insert { "data": [ {key1: value1, key2: value2, ...} ] }',
           'POST /advance/insert { "data": [ {key1: value1, key2: value2, ...} ] }',
           'GET /basic/result?para1=value1&para2=value2',
           'GET /advance/result?para1=value1&para2=value2',
      ]
  });
});

app.get('/reset/', function (req, res, next) {
  database.resetTable((error, result) => {
    if (error) { //Return error if error.
      return res.send(error);
    }
    console.log(result)
    res.status(200).json({ "result": "success" });
  });
});

// -------------------INSERT---------------------
// POST 1. BASIC Insert Advertisement details ---
app.post('/basic/insert/', function (req, res, next) {
  const { data } = req.body;

  database.basicInsertAdvertisement(data, (error, result) => {
    if (error) { //Return error if error.
      console.log("data: ", data)
      return res.json({ "error": error.detail, "code": error.code }); // OK
    }
    console.log(result)
    res.json({ "result": "success" }); // Checked
  });
});

// POST 2. ADVANCE Insert Advertisement details ---
app.post('/advance/insert/', function (req, res, next) {
  const { data } = req.body;

  database.advInsertAdvertisement(data, (error, result) => {
    if (error) { //Return error if error.
      console.log("data: ", data)
      return res.json({ "error": error.detail, "code": error.code }); //OK
    }else{
      console.log(result)
      return res.json({ "result": "success" }); // Checked
    }
  });
});

// ----------------DATA VIEWER TABLE---------------------
// GET 3. BASIC Retrieve all data for table---
app.get('/basic/allData', function (req, res) {
  const { companyId, audienceReach, pageNo, pageSize } = req.query;

  database.basicGetData(companyId, audienceReach, pageNo, pageSize, (error, result) => {
    if (result.length == 0) {
      return res.status(404).json({ "error": "Not found", "code": 404 });
    } else if (error) {
      return res.json({ "error": error.detail, "code": error.code });
    }
    res.json(result);
  })
});

// GET 4. ADVANCED Retrieve all data for table---
app.get('/advance/allData', function (req, res) {
  const { companyId, audienceReach, cost, pageNo, pageSize } = req.query;

  database.advGetData(companyId, audienceReach, cost, pageNo, pageSize, (error, result) => {
    if (result.length == 0) {
      return res.status(404).json({ "error": "Not found", "code": 404 });
    } else if (error) {
      return res.json({ "error": error.detail, "code": error.code });
    }
    res.json(result);
  })
});

// GET 5. BASIC: Retrieve all number of row data in table: advertisement ---
app.get('/basic/getRowCount', function (req, res, next) {
  const { companyId, audienceReach } = req.query;

  database.basicGetRowCount(companyId, audienceReach, (error, result) => {
    if (result.length == 0) {
      return res.status(404).json({ "error": "Not found", "code": 404 });
    } else if (error) {
      return res.json({ "error": error.detail, "code": error.code });
    }
    return res.json(result);
  })
});

// GET 6. ADVANCED: Retrieve all number of row data in table: advertisement ---
app.get('/advance/getRowCount', function (req, res, next) {
  const { companyId, audienceReach, cost } = req.query;

  database.advGetRowCount(companyId, audienceReach, cost, (error, result) => {
    if (result.length == 0) {
      return res.status(404).json({ "error": "Not found", "code": 404 });
    } else if (error) {
      return res.json({ "error": error.detail, "code": error.code });
    }
    return res.json(result);
  })
});


// ----------------RESULT VIEWER CHART---------------------
// GET 7. Retrieve BASIC data for Google chart --- 
app.get('/basic/allChartData', function (req, res) {
  const { optionIds } = req.query;

  database.basicGetDataForChart(optionIds, (error, result) => {  // links to database.js
    if (result.length == 0) {
      return res.status(404).json({ "error": "Not found", "code": 404 }); //No optionId
    } else if (error) {
      return res.json({ "error": error.detail, "code": error.code }); //Other errors
    }
    console.log(result);
    res.json(result);
  })
});

// POST 8. Retrieve ADVANCE data for Google chart ---
app.get('/advance/allChartData', function (req, res) {
  const { optionIds } = req.query;

  database.advGetDataForChart(optionIds, (error, result) => {  // links to database.js
    if (result.length == 0) {
      return res.status(404).json({ "error": "Not found", "code": 404 }); //No optionId
    } else if (error) {
      return res.json({ "error": error.detail, "code": error.code }); //Other errors
    }
    console.log(result);
    res.json(result);
  })
});

// ----------------RESULT VIEWER TABULATION---------------------
// GET 9. Get BASIC tabulation results ---
app.get('/basic/result', function (req, res, next) {
  const { optionIds, budget } = req.query;
  console.log("optionids: " + optionIds);
  console.log("budget: " + budget);
  database.basicGetOptionsForComputation(optionIds, (error, databaseResult) => { // links to database.js
    if (databaseResult.length == 0) {
      return res.json({"result": []}); //Return empty result.
    } else if (error) {
      return res.json({ "error": error.detail, "code": error.code });
    } else if(budget == null){
      return res.json({"error": "budget cannot be null!"});
    }
    var audience = [];
    var cost = [];
    var optionType = []
    for (let i = 0; i < databaseResult.length; i++) {
      audience.push(databaseResult[i].audiencereach)
      cost.push(Number(databaseResult[i].cost))
      optionType.push(databaseResult[i].adtype)
    }
    var updatedCost = []
    var payment = []
    updatedCost = algo.fractionalKnapsack(audience, cost, budget);
    for (let k = 0; k < databaseResult.length; k++) {
      console.log("Number(databaseResult[k].amount): " + Number(databaseResult[k].cost));
      console.log("Number(databaseResult[k].audienceReach): " + Number(databaseResult[k].audiencereach))

      if (parseInt(databaseResult[k].cost) == parseInt(updatedCost[k])) {
        payment.push('Full');
        databaseResult[k].cost = updatedCost[k];
      } else if (parseInt(updatedCost[k]) == 0) {
        payment.push('No');
        databaseResult[k].cost = updatedCost[k];
        databaseResult[k].audiencereach = 0
      } else {
        payment.push('Partial');
        var factor = databaseResult[k].cost / updatedCost[k];
        var updatedAudience = databaseResult[k].audiencereach / factor;
        databaseResult[k].audiencereach = updatedAudience;
        console.log("Aud" + updatedAudience);
        databaseResult[k].cost = updatedCost[k];
      }
      databaseResult[k]['payment'] = payment[k]; //Adds json object attribute
    }
    // Convert to required Schema.
    const result = [];
    for (let i = 0; i < databaseResult.length; i++) {
      result.push({
        optionId: parseInt(databaseResult[i].optionid),
        companyId: parseInt(databaseResult[i].companyid),
        amount: parseFloat(databaseResult[i].cost),
        audienceReached: parseFloat(databaseResult[i].audiencereach),
        adType: databaseResult[i].adtype,
        payment: databaseResult[i].payment
      });
    }
    res.json({ result });
  })
});


// POST 10. Get ADVANCE tabulation results ---
app.get('/advance/result', function (req, res, next) {
  const { optionIds, budget } = req.query;
  console.log("optionids: " + optionIds);
  console.log("budget: " + budget);
  database.advGetOptionsForComputation(optionIds, (error, databaseResult) => { // links to database.js
    if (databaseResult.length == 0) {
      return res.json({"result": []});
    } else if (error) {
      return res.json({ "error": error.detail, "code": error.code });
    }else if(budget == null){
      return res.json({"error": "budget cannot be null!"});
    }
    let audience = [];
    let cost = [];
    let optionType = []
    let options = [];

    for (let i = 0; i < databaseResult.length; i++) {
      audience.push(databaseResult[i].audiencereach);
      cost.push(Number(databaseResult[i].cost));
      optionType.push(databaseResult[i].adtype);
    }
    audience.unshift(0);
    cost.unshift(0);
    let choices = [];
    let companyid = [];
    let test = [];
    let audReach = [];

    choices = algo.fullKnapsack(audience, cost, budget);
 
    for (let k = 0; k < choices.length; k++) {
      if (choices[k] == 1) { // full payment
        options.push(databaseResult[k].optionid);
        companyid.push(databaseResult[k].companyid);
        test.push(databaseResult[k].cost);
        audReach.push(databaseResult[k].audiencereach);

      } else if (choices[k] == 0) { // no payment
        databaseResult[k].audiencereach = 0
      }
    }
    // Convert to required Schema.
    const result = [];
    for (let i = 0; i < options.length; i++) {
      result.push({
        optionId: parseInt(options[i]),
        companyId: parseInt(companyid[i]),
        amount: parseFloat(test[i]),
        audienceReached: parseFloat(audReach[i]),
      });
    }
    res.json({ result });
  })
});

module.exports = app;