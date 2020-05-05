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
      optionId int NOT NULL,
      companyId int DEFAULT NULL,
      cost decimal DEFAULT NULL,
      audienceReach bigint DEFAULT NULL,
      adType varchar(255) DEFAULT NULL,
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
  let i = 1;
  //$ sign infront of value.
  const template = data.map((singleData) => `($${i++},$${i++},$${i++},$${i++},$${i++})`).join(',');

  //Values need to be in a single array.
  const values = data.reduce((reduced, data) => [...reduced, data.optionId, data.companyId, data.cost, data.audienceReach, data.adTypeName], [])
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
function getRowCount(companyId, audienceReach, callback){
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
  client.query(query,values, function (err, { rows }) {
    client.end();
    callback(err, rows);
  })

}

module.exports = {
  resetTable,
  insertAdvertisement,
  getData,
  getRowCount
}