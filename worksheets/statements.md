# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.


### Data Viewer page

## DROP and CREATE table
Example:
```sql
DROP TABLE IF EXISTS Advertisement;
CREATE TABLE Advertisement (
      optionId int NOT NULL,
      companyId bigint DEFAULT NULL,
      cost decimal DEFAULT NULL,
      audienceReach bigint DEFAULT NULL,
      adType varchar(255) DEFAULT NULL,
      PRIMARY KEY (optionID)
    )
```

## INSERT into table
Example:
```sql
INSERT INTO Advertisement (optionId, companyId, cost, audienceReach, adType) VALUES (1000000001, 1000000001, 1000, 4000, "Fixed");
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

## SELECT table row count
Example:
```sql
SELECT COUNT(*) FROM advertisement;
```

## SELECT table row count with Filtering
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