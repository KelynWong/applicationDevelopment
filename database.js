// database.js Script
// Name: Wong En Ting Kelyn
// Name: Teh Huan Xi Kester
// Class: DIT/FT/2B/01
//This file handles database connections.

//Connection URI
const { Client } = require('pg'); //Middleware 
const CONNECTION_STRING = 'postgres://ycghstxz:23a4dlohmcqwC3wStzaSk1My5gy-eyf2@john.db.elephantsql.com:5432/ycghstxz';

//Creates connection
function connect() {
  const client = new Client({
    connectionString: CONNECTION_STRING,
  });
  client.connect();
  return client;
}

// 0. Reset table script
function resetTable(callback) {
  const client = connect();
  const query = `
    DROP TABLE IF EXISTS Advertisement;
    CREATE TABLE Advertisement (
      optionId bigint NOT NULL,
      companyId bigint NOT NULL,
      cost decimal NOT NULL,
      audienceReach bigint NOT NULL,
      adType varchar(255) NOT NULL,
      PRIMARY KEY (optionId, adType)
    )
    `;
  client.query(query, (err, res) => {
    console.log(err, res)
    client.end()
    callback()
  });
}

// POST 1. BASIC Insert Advertisement details ---
function basicInsertAdvertisement(data, callback) {
  if(data.length == 0){ 
    return callback(null, []) 
  }
    let i = 1;
    //$ sign infront of value.
    const template = data.map((singleData) => `($${i++},$${i++},$${i++},$${i++}, 'Not Fixed')`).join(',');

    //Values need to be in a single array.
    const values = data.reduce((reduced, data) => [...reduced, data.optionId, data.companyId, data.cost, data.audienceCount], [])
    const query = `INSERT INTO Advertisement (optionId, companyId, cost, audienceReach, adType) VALUES ${template};`

    //This part below sends the query over.
    const client = connect();
    client.query(query, values, (err, result) => { //Dependent on above values.
      callback(err, result);
      console.log("query: " + query);
      console.log("values: " + values);
      client.end();
    });
}

// POST 2. ADVANCE Insert Advertisement details ---
function advInsertAdvertisement(data, callback) {
  if(data.length == 0){ 
    return callback(null, []) 
  }
    let i = 1;
    //$ sign infront of value.
    const template = data.map((singleData) => `($${i++},$${i++},$${i++},$${i++}, 'Fixed')`).join(',');

    //Values need to be in a single array.
    const values = data.reduce((reduced, data) => [...reduced, data.optionId, data.companyId, data.cost, data.audienceCount], [])
    const query = `INSERT INTO Advertisement (optionId, companyId, cost, audienceReach, adType) VALUES ${template};`

    //This part below sends the query over.
    const client = connect();
    client.query(query, values, (err, result) => { //Dependent on above values.
      callback(err, result);
      console.log("query: " + query);
      console.log("values: " + values);
      client.end();
    });
}

// GET 3. Retrieve BASIC(adType = Not Fixed) data ---
function basicGetData(companyId, audienceReach, pageNo, pageSize, callback) {

  //This part below determines what sql query is produced based on the page state.
  let i = 1;
  const values = [];
  let whereClause = `WHERE adType='Not Fixed'`;
  if (!companyId && !audienceReach) whereClause = "";
  else {
    if (companyId) { //if companyid exists
      whereClause += ` AND companyId = $${i++}`
      values.push(parseInt(companyId)); //Array.push companyid
    }
    if (audienceReach) { //if audienceReach exists
      whereClause += ` AND audienceReach = $${i++}`
      values.push(parseInt(audienceReach)); //Array.push audiencereach
    }
  }
  // This part below determines the amount of data being sent to a page.
  let limitOffsetClause;
  if (!pageNo && !pageSize) limitOffsetClause = "";
  else {
    limitOffsetClause = `LIMIT $${i++} OFFSET $${i++}`
    values.push(parseInt(pageSize)); //Limit = page size 10 - Amount of data taken.
    values.push(parseInt(pageNo) * parseInt(pageSize)); //Offset = (pageNo -index) * pagesize - Amount of data skipped before.
  }

  const query = `SELECT * FROM Advertisement ${whereClause} ${limitOffsetClause}`
  console.log(query);
  //Connect to database
  const client = connect();
  client.query(query, values, function (err, { rows }) {
    client.end();
    callback(err, rows);
    console.log(rows)
  })
}


// GET 4. Retrieve ADVANCE(adType = Not Fixed) data ---
function advGetData(companyId, audienceReach, pageNo, pageSize, callback) {

  //This part below determines what sql query is produced based on the page state.
  let i = 1;
  const values = [];
  let whereClause;
  if (!companyId && !audienceReach) whereClause = "WHERE adType = 'Fixed'";
  else {
    whereClause = `WHERE adType = 'Fixed'`;
    if (companyId) { //if companyid exists
      whereClause += `AND companyId = $${i++}`
      values.push(parseInt(companyId)); //Array.push companyid
    }
    if (audienceReach) { //if audienceReach exists
      whereClause += (companyId) ? ` AND audienceReach = $${i++}` : `audienceReach = $${i++}`
      values.push(parseInt(audienceReach)); //Array.push audiencereach
    }
  }
  // This part below determines the amount of data being sent to a page.
  let limitOffsetClause;
  if (!pageNo && !pageSize) limitOffsetClause = "";
  else {
    limitOffsetClause = `LIMIT $${i++} OFFSET $${i++}`
    values.push(parseInt(pageSize)); //Limit = page size 10 - Amount of data taken.
    values.push(parseInt(pageNo) * parseInt(pageSize)); //Offset = (pageNo -index) * pagesize - Amount of data skipped before.
  }

  const query = `SELECT * FROM Advertisement ${whereClause} ${limitOffsetClause}`
  console.log(query);
  //Connect to database
  const client = connect();
  client.query(query, values, function (err, { rows }) {
    client.end();
    callback(err, rows);
    console.log(rows)
  })
}

// 5. GET BASIC: row count of table advertisement ---
function basicGetRowCount(companyId, audienceReach, callback) {
  let i = 1;
  const values = [];
  let whereClause;
  if (!companyId && !audienceReach) whereClause = "WHERE adType = 'Not Fixed'";
  else {
    whereClause = `WHERE adType = 'Not Fixed'`;
    if (companyId) { //if companyid exists
      whereClause += `AND companyId = $${i++}`
      values.push(parseInt(companyId)); //Array.push companyid
    }
    if (audienceReach) { //if audienceReach exists
      whereClause += (companyId) ? ` AND audienceReach = $${i++}` : `audienceReach = $${i++}`
      values.push(parseInt(audienceReach)); //Array.push audiencereach
    }
  }
  const query = `SELECT COUNT(*) FROM advertisement ${whereClause};`
  const client = connect();
  client.query(query, values, function (err, { rows }) {
    client.end();
    callback(err, rows);
  })
}

// 6. GET ADVANCED: row count of table advertisement ---
function advGetRowCount(companyId, audienceReach, callback) {
  let i = 1;
  const values = [];
  let whereClause;
  if (!companyId && !audienceReach) whereClause = "WHERE adType = 'Fixed'";
  else {
    whereClause = `WHERE adType = 'Fixed'`;
    if (companyId) { //if companyid exists
      whereClause += `AND companyId = $${i++}`
      values.push(parseInt(companyId)); //Array.push companyid
    }
    if (audienceReach) { //if audienceReach exists
      whereClause += (companyId) ? ` AND audienceReach = $${i++}` : `audienceReach = $${i++}`
      values.push(parseInt(audienceReach)); //Array.push audiencereach
    }
  }
  const query = `SELECT COUNT(*) FROM advertisement ${whereClause};`
  const client = connect();
  client.query(query, values, function (err, { rows }) {
    client.end();
    callback(err, rows);
  })
}


// Result Viewer API
// 7. GET Retrieve data for making of chart ---
function basicGetDataForChart(optionIds, callback) {
  if(optionIds.length == 0){ 
    return callback(null, []); // Return empty dataset.
  }
  // Note: Improve on validation.
  var optionList = optionIds.toString().split(','); //optionList array
  //This part below determines what sql query is produced based on the page state.
  const values = [];
  let whereClause = "WHERE adType = 'Not Fixed' AND optionId IN (";
  for (let i = 1; i <= optionList.length; i++) {
    whereClause += `$${i}`
    if(i != optionList.length) whereClause += `, `;
    values.push(parseInt(optionList[i-1])); //Array.push companyid
  }
  whereClause += `);`
  const query = `SELECT optionid, cost, audiencereach, adtype FROM Advertisement ${whereClause}`
  console.log("values: " +values)
  console.log("query: "+query);
  //Connect to database
  const client = connect();
  client.query(query, values, function (err, { rows }) {
    client.end();
    callback(err, rows);
    console.log(rows)
  })
}

// 8. GET Retrieve data for making of chart ---
function advGetDataForChart(optionIds, callback) {
  if(optionIds.length == 0){ 
    return callback(null, []); // Return empty dataset.
  }
  // Note: Improve on validation.
  var optionList = optionIds.toString().split(','); //optionList array
  //This part below determines what sql query is produced based on the page state.
  const values = [];
  let whereClause = "WHERE adType = 'Fixed' AND optionId IN (";
  for (let i = 1; i <= optionList.length; i++) {
    whereClause += `$${i}`
    if(i != optionList.length) whereClause += `, `;
    values.push(parseInt(optionList[i-1])); //Array.push companyid
  }
  whereClause += `);`
  const query = `SELECT optionid, cost, audiencereach, adtype FROM Advertisement ${whereClause}`
  console.log("values: " +values)
  console.log("query: "+query);
  //Connect to database
  const client = connect();
  client.query(query, values, function (err, { rows }) {
    client.end();
    callback(err, rows);
    console.log(rows)
  })
}

// 9. GET audience and cost for computation ---
function basicGetOptionsForComputation(optionIds, callback) {
  if(optionIds.length == 0){ 
    return callback(null, []) 
  }
  var optionList = optionIds.toString().split(',');
  //This part below determines what sql query is produced based on the page state.
  const values = [];
  let whereClause = "WHERE adType = 'Not Fixed' AND optionId IN (";
  for (let i = 1; i <= optionList.length; i++) {
    whereClause += `$${i}`
    if (i != optionList.length) whereClause += `, `
    values.push(parseInt(optionList[i - 1])); //Array.push companyid
  }
  whereClause += `);`
  const query = `SELECT * FROM Advertisement ${whereClause}`
  console.log("values: " + values)
  console.log("query: " + query);
  //Connect to database
  const client = connect();
  client.query(query, values, function (err, { rows }) {
    client.end();
    callback(err, rows);
    console.log(rows)
  })
}

// 10. GET audience and cost for computation ---
function advGetOptionsForComputation(optionIds, callback) {
  if(optionIds.length == 0){ 
    return callback(null, []) 
  }
  var optionList = optionIds.toString().split(',');
  //This part below determines what sql query is produced based on the page state.
  const values = [];
  let whereClause = "WHERE adType = 'Fixed' AND optionId IN (";
  for (let i = 1; i <= optionList.length; i++) {
    whereClause += `$${i}`
    if (i != optionList.length) whereClause += `, `
    values.push(parseInt(optionList[i - 1])); //Array.push companyid
  }
  whereClause += `);`
  const query = `SELECT * FROM Advertisement ${whereClause}`
  console.log("values: " + values)
  console.log("query: " + query);
  //Connect to database
  const client = connect();
  client.query(query, values, function (err, { rows }) {
    client.end();
    callback(err, rows);
    console.log(rows)
  })
}

module.exports = {
  resetTable,
  basicInsertAdvertisement,
  advInsertAdvertisement,
  basicGetData,
  advGetData,
  basicGetRowCount,
  advGetRowCount,
  basicGetOptionsForComputation,
  basicGetDataForChart,
  advGetDataForChart,
  advGetOptionsForComputation
}