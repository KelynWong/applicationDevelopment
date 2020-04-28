const { Client } = require('pg');
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
      DROP TABLE IF EXIST Company;
      CREATE TABLE Company (
        companyId int(11) NOT NULL,
        PRIMARY KEY (companyId)
      )
    
      DROP TABLE IF EXIST Advertisment;
      CREATE TABLE Advertisment (
        optionId int(11) NOT NULL,
        companyId int(11) DEFAULT NULL,
        cost decimal(19, 2) DEFAULT NULL,
        audienceReach bigint(20) DEFAULT NULL,
        adTypeName varchar(255) DEFAULT NULL,
        PRIMARY KEY (optionID),
        CONSTRAINT FK_Advertisment_Company_CompanyID FOREIGN KEY (companyId) REFERENCES Company (companyId) ON UPDATE CASCADE
      )
    `;
    client.query(query, (err, res) => {
        console.log(err, res)
        client.end()
      });
}

function insertCompany(companies){
  let i = 1;
  const template = companies.map(company => `(${i++})`).join(',');
  const values = companies.reduce((reduced, company) => [...reduced, company.companyId], [])
  const query = `INSERT INTO Company(companyId) VALUES ${template};`
  console.log(values, query);
}

module.exports = {
    resetTable,
    insertCompany
}