const { Client } = require('pg'); //This is correct.
const CONNECTION_STRING = 'postgres://ycghstxz:23a4dlohmcqwC3wStzaSk1My5gy-eyf2@john.db.elephantsql.com:5432/ycghstxz';

function connect(){
    const client = new Client({
        connectionString: CONNECTION_STRING,
      });
    client.connect();
    return client;
}

function resetTable(){
    const client = connect();
    const query = `
      DROP TABLE IF EXIST Advertisement;
      CREATE TABLE Advertisment (
        optionId int(11) NOT NULL,
        companyId int(11) DEFAULT NULL,
        cost decimal DEFAULT NULL,
        audienceReach bigint(20) DEFAULT NULL,
        adTypeName varchar(255) DEFAULT NULL,
        PRIMARY KEY (optionID)
      )
    `;
    client.query(query, (err, res) => {
        console.log(err, res)
        client.end()
      });
}

function insertAdvertisment(advertisments, callback){
  let i = 1;
  const template = advertisments.map(advertisment => `($${i++},$${i++},$${i++},$${i++},$${i++})`).join(',');
  const values = advertisments.reduce((reduced, advertisment) => [...reduced, advertisment.optionId, advertisment.companyId, advertisment.cost, advertisment.audienceReach, advertisment.adTypeName], [])
  const query = `INSERT INTO Advertisement (optionId, companyId, cost, audienceReach, adTypeName) VALUES ${template};`
  
  const client = connect();
  client.query(query, values, (err, result) =>{ //Dependent on above values.
    callback(err, result);
    console.log("query: " + query)
    console.log("values: " + values)
    client.end();
  });
}

function getData(companyId, audienceReach, page, pageSize, callback){
  let whereClause; 
  let i=1;
  const values = [];
  if(!companyId && !audienceReach) whereClause = "";
  else{
    whereClause= 'WHERE ';
    if(companyId){
      whereClause += `companyId = $${i++}`
      values.push(parseInt(companyId));
    } 
    if(audienceReach){
      whereClause += (companyId) ? ` AND audienceReach = $${i++}` : `audienceReach = $${i++}`
      values.push(parseInt(audienceReach));
    } 
  }
  let limitOffsetClause
  if(!page && !pageSize) limitOffsetClause = "";
  else{
    limitOffsetClause =  `LIMIT $${i++} OFFSET $${i++}`
    values.push(parseInt(page));
    values.push(parseInt(page) * parseInt(pageSize));
  } 
  const query = `SELECT * FROM Advertisement ${whereClause} ${limitOffsetClause};`

  const client = connect();
  client.query(query, values, function(err, {rows}){
    client.end();
    callback(err, rows);
  })
}

module.exports = {
    resetTable,
    insertAdvertisment,
    getData
}