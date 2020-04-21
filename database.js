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
        CREATE TABLE WebUITest.Company (
            CompanyID int(11) NOT NULL AUTO_INCREMENT,
            Name varchar(50) DEFAULT NULL,
            PRIMARY KEY (CompanyID)
        );

        DROP TABLE IF EXIST Advertisment;
        CREATE TABLE WebUITest.Advertisment (
            AdID int(11) NOT NULL AUTO_INCREMENT,
            CompanyID int(11) DEFAULT NULL,
            Cost decimal(19, 2) DEFAULT NULL,
            AudienceReach bigint(20) DEFAULT NULL,
            AdTypeName varchar(255) DEFAULT NULL,
            PRIMARY KEY (AdID)
          )
        ALTER TABLE WebUITest.Advertisment
        ADD CONSTRAINT FK_Advertisment_AdTypeLU_AdTypeName FOREIGN KEY (AdTypeName)
        REFERENCES WebUITest.AdTypeLU (AdTypeName) ON UPDATE CASCADE;
        ALTER TABLE WebUITest.Advertisment
        ADD CONSTRAINT FK_Advertisment_Company_CompanyID FOREIGN KEY (CompanyID)
        REFERENCES WebUITest.Company (CompanyID) ON UPDATE CASCADE;

        DROP TABLE IF EXIST AdTypeLU;
        CREATE TABLE WebUITest.AdTypeLU (
            AdTypeName varchar(255) NOT NULL,
            PRIMARY KEY (AdTypeName)
          )
        ALTER TABLE WebUITest.AdTypeLU
        ADD UNIQUE INDEX AdTypeName (AdTypeName);
    `;
    client.query(query, (err, res) => {
        console.log(err, res)
        client.end()
      });
}

module.exports = {
    resetTable,
}