# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.


### Data Viewer page
## INSERT into table
Example:
```sql
INSERT INTO Advertisement (optionId, companyId, cost, audienceReach, adTypeName) VALUES (1000000001, 1000000001, 1000, 4000, "Fixed");
```

## SELECT with Filtering and Pagination
Example:
```sql
SELECT * FROM Advertisement WHERE companyId == 1000000001 AND audienceReach = 4000 LIMIT 10 OFFSET 20;
```

## SELECT with Pagination Only
Example:
```sql
SELECT * FROM Advertisement LIMIT 10 OFFSET 20;
```

## SELECT count table
Example:
```sql
SELECT COUNT(*) FROM advertisement;
```

## SELECT count table with filtering
Example:
```sql
SELECT COUNT(*) FROM advertisement WHERE companyId == 1000000001 AND audienceReach = 4000;
```

### Result Viewer page
## SELECT with filtering only
Example:
```sql
SELECT * FROM advertisement WHERE companyId == 1000000001 AND audienceReach = 4000;
```

## SELECT based on options user input
Example:
```sql
SELECT * FROM Advertisement WHERE optionId IN (1000000001, 1000000002, 1000000003);
```