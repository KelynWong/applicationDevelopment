# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.

## INSERT

Example:
```sql
INSERT INTO Advertisement (optionId, companyId, cost, audienceReach, adTypeName) VALUES (1000000001, 1000000001, 1000, 4000, "Fixed");
```

## SELECT with Filtering and Pagination

Example:
```sql
SELECT * FROM Advertisement WHERE companyId == 1000000001 AND audienceReach = 4000 LIMIT 10 OFFSET 20;
```
