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
function resetTable() {
  const client = connect();
  const query = `
    DROP TABLE IF EXISTS Advertisement;
    CREATE TABLE Advertisement (
      optionId bigint NOT NULL,
      companyId bigint NOT NULL,
      cost decimal NOT NULL,
      audienceReach bigint NOT NULL,
      adType varchar(255) NOT NULL,
      PRIMARY KEY (optionID)
    )
    `;
  client.query(query, (err, res) => {
    console.log(err, res)
    client.end()
  });
}

// POST 1. Insert Advertisement details ---
function insertAdvertisement(data, callback) {
  if(data.length == 0){ 
    return callback(null, []) 
  }
    let i = 1;
    //$ sign infront of value.
    const template = data.map((singleData) => `($${i++},$${i++},$${i++},$${i++},$${i++})`).join(',');

    //Values need to be in a single array.
    const values = data.reduce((reduced, data) => [...reduced, data.optionId, data.companyId, data.cost, data.audienceCount, data.adType], [])
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

// GET 2. Retrieve all data ---
function getData(companyId, audienceReach, pageNo, pageSize, callback) {

  //This part below determines what sql query is produced based on the page state.
  let i = 1;
  const values = [];
  let whereClause;
  if (!companyId && !audienceReach) whereClause = "";
  else {
    whereClause = 'WHERE ';
    if (companyId) { //if companyid exists
      whereClause += `companyId = $${i++}`
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

//3. GET row count of table advertisement ---
function getRowCount(companyId, audienceReach, callback) {
  let i = 1;
  const values = [];
  let whereClause;
  if (!companyId && !audienceReach) whereClause = "";
  else {
    whereClause = 'WHERE ';
    if (companyId) { //if companyid exists
      whereClause += `companyId = $${i++}`
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

//4. GET Retrieve data for making of chart ---
function getDataForChart(optionIds, callback) {
  if(optionIds.length == 0){ 
    return callback(null, []) 
  }
  var optionList = optionIds.toString().split(',');
  //This part below determines what sql query is produced based on the page state.
  const values = [];
  let whereClause = "WHERE optionId IN (";
  for (let i = 1; i <= optionList.length; i++) {
    whereClause += `$${i}`
    if(i != optionList.length) whereClause += `, `
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

//5. GET audience and cost for computation ---
function getOptionsForComputation(optionIds, callback) {
  if(optionIds.length == 0){ 
    return callback(null, []) 
  }
  var optionList = optionIds.toString().split(',');
  //This part below determines what sql query is produced based on the page state.
  const values = [];
  let whereClause = "WHERE optionId IN (";
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
  insertAdvertisement,
  getData,
  getRowCount,
  getOptionsForComputation,
  getDataForChart
}