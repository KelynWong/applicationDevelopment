# Schema

This document will give users a good idea of how your database's structure looks like.

You may refer to the following link to learn more about postgresql schema:

1. [CREATE statements](https://www.postgresqltutorial.com/postgresql-create-table/)
2. [Foreign Keys](https://www.postgresqltutorial.com/postgresql-foreign-key/)

The following are examples of how you can create a table, replace the examples with your own create statements of all your table.
```sql
CREATE TABLE Advertisement (
  optionId bigint NOT NULL,
  companyId bigint NOT NULL,
  cost decimal NOT NULL,
  audienceReach bigint NOT NULL,
  adType varchar(255) NOT NULL,
  PRIMARY KEY (optionId, adType)
)
```
