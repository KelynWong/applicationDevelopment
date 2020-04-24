# Schema

This document will gives user a good idea of how your database's structure looks like.

You may refer to the following link to learn more about postgresql schema:

1. [CREATE statements](https://www.postgresqltutorial.com/postgresql-create-table/)
2. [Foreign Keys](https://www.postgresqltutorial.com/postgresql-foreign-key/)

The following are examples of how you can create a table, replace the examples with your own create statements of all your table.
```sql
CREATE TABLE Company (
  companyId int(11) NOT NULL,
  PRIMARY KEY (companyId)
)

CREATE TABLE Advertisment (
  optionId int(11) NOT NULL,
  companyId int(11) DEFAULT NULL,
  cost decimal(19, 2) DEFAULT NULL,
  audienceReach bigint(20) DEFAULT NULL,
  adTypeName varchar(255) DEFAULT NULL,
  PRIMARY KEY (optionID),
  CONSTRAINT FK_Advertisment_Company_CompanyID FOREIGN KEY (companyId) REFERENCES Company (companyId) ON UPDATE CASCADE
)
```
