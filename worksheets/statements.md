# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.


### --------- Data Viewer page ---------
## DROP and CREATE table
Example:
```sql
DROP TABLE IF EXISTS Advertisement;
CREATE TABLE Advertisement (
      optionId bigint NOT NULL,
      companyId bigint NOT NULL,
      cost decimal NOT NULL,
      audienceReach bigint NOT NULL,
      adType varchar(255) NOT NULL,
      PRIMARY KEY (optionId, adType)
    )
```

## INSERT into table (basic)
Example:
```sql
INSERT INTO Advertisement (optionId, companyId, cost, audienceReach, adType) VALUES (1000000001, 1000000001, 1000, 4000, "Not Fixed");
```

## INSERT into table (advance)
Example:
```sql
INSERT INTO Advertisement (optionId, companyId, cost, audienceReach, adType) VALUES (1000000001, 1000000001, 1000, 4000, "Fixed");
```


### --------- Data Viewer page (basic) ---------
## SELECT with Filtering and Pagination
Example:
```sql
SELECT * FROM Advertisement WHERE adType='Not Fixed' AND companyId == 1000000001 AND audienceReach = 4000 LIMIT 10 OFFSET 20;
```

## SELECT with Pagination Only
Example:
```sql
SELECT * FROM Advertisement WHERE adType='Not Fixed' LIMIT 10 OFFSET 20;
```

## SELECT table row count 
Example:
```sql
SELECT COUNT(*) FROM Advertisement WHERE adType='Not Fixed';
```

## SELECT table row count with Filtering
Example:
```sql
SELECT COUNT(*) FROM Advertisement WHERE adType='Not Fixed' AND companyId == 1000000001 AND audienceReach = 4000;
```

### --------- Data Viewer page (advance) ---------
## SELECT with Filtering and Pagination
Example:
```sql
SELECT * FROM Advertisement WHERE adType='Fixed' AND companyId == 9000000001 AND audienceReach = 4000 LIMIT 10 OFFSET 20;
```

## SELECT with Pagination Only
Example:
```sql
SELECT * FROM Advertisement WHERE adType='Fixed' LIMIT 10 OFFSET 20;
```

## SELECT table row count 
Example:
```sql
SELECT COUNT(*) FROM Advertisement WHERE adType='Fixed';
```

## SELECT table row count with Filtering
Example:
```sql
SELECT COUNT(*) FROM Advertisement WHERE adType='Fixed' AND companyId == 9000000001 AND audienceReach = 4000;
```

### --------- Result Viewer page (basic) ---------
## SELECT data for making of chart
Example:
```sql
SELECT optionid, cost, audiencereach, adtype FROM Advertisement WHERE adType = 'Not Fixed' AND optionId IN (1000000001,1000000002,1000000003);
```

## SELECT for computation
Example:
```sql
SELECT * FROM Advertisement WHERE adType = 'Not Fixed' AND optionId IN (000000001, 1000000002, 1000000003);
```

### --------- Result Viewer page (advance) ---------
## SELECT data for making of chart
Example:
```sql
SELECT optionid, cost, audiencereach, adtype FROM Advertisement WHERE adType = 'Fixed' AND optionId IN (9000000001,9000000002,9000000003);
```

## SELECT for computation
Example:
```sql
SELECT * FROM Advertisement WHERE adType = 'Fixed' AND optionId IN (9000000001, 9000000002, 9000000003);
```