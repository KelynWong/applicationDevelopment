# API Documentation

This document allows you to define your API schema.

Each API should include

1. HTTP Method
2. Endpoint
3. Request body/Parameters
4. Response body
5. Error Body
6. Sample Request
7. Sample Response
8. Sample Error

> Errors and it's corresponding code can be defined by yourself. You need not follow HTTP errors.

## --------------------------------------- BASIC APIs --------------------------------------------------------

## [Data viewer page] Get All Data ----------------------------------------------------------------------------

| attribute   | value          |
| ----------- | -------------- |
| HTTP Method | POST           |
| Endpoint    | /basic/allData |

### Parameters

|   parameter   | datatype        | example    |
| ------------- | --------------- | ---------- |
| companyId     | 10 digit number | 1000000001 |
| audienceReach |       int       |    4000    |
| page          |       int       |    1       |
| pageSize      |       int       |    1       |

### Response Body

```json
{
    "result": [
        {
            "optionid": int,
            "companyid": int,
            "cost": dec(10, 2),
            "audiencereach": int,
            "adtype": String
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
POST /basic/AllData
```

### Sample Response

```json
{
    "result": [
        {
            "optionid": 1000000005,
            "companyid": 1000000001,
            "cost": "1000.00",
            "audiencereach": "4000",
            "adtype": "Fixed"
        }
    ]
}
```

### Sample Error

```json
{
	"error": "Not found",
	"code": 404
}
```

## Insert Data ----------------------------------------------------------------------------

| attribute   | value                 |
| ----------- | --------------------- |
| HTTP Method | POST                  |
| Endpoint    | /insertAdvertismement |

### Parameters

| parameter      | datatype        | example   |
| ---------      | --------------- | --------- |
| optionId       | 10 digit number | 123456789 |
| companyId      | 10 digit number | 123456789 |
| audienceReach  | Int             | 500       |
| cost           | Dec(10, 2)      | 1000.50   |
| adType         | String          | Fixed     |



### Response Body

```json
{
    "result": [
        {
            "Status":String,
            "Code": number
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
POST /insertAdvertisement
```

### Sample Response

```json
{
    "result": [
        {
            "Status": OK,
            "Code": 200
        }
    ]
}
```

### Sample Error

```json
{
	"error": Duplicate Entry,
	"code": 409
}
```

## [Any page] Get Row count ---------------------------------------------------------------

| attribute   | value               | 
| ----------- | ------------------- |
| HTTP Method | POST                |
| Endpoint    | /extra/getRowCount  |

### Parameters

| parameter | datatype        | example    |
| --------- | --------------- | ---------- |


### Response Body

```json
{
    "result": [
        {
            "rows": int,
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
GET /extra/getRowCount
```

### Sample Response

```json
{
    "result": [
        {
            "rows": 57,
        }
    ]
}
```

### Sample Error

```json
{
	"error": "Server Error",
	"code": 500
}
```


## [Results page] Get Results ---------------------------------------------------------------

| attribute   | value             |
| ----------- | ----------------- |
| HTTP Method | POST              |
| Endpoint    | /basic/getResults |

### Parameters

| parameter | datatype        | example    |
| --------- | --------------- | ---------- |
| optionIds | 10 digit number | 1234567890 |
| budget    | Integer         | 100        |

### Response Body

```json
{
    "result": [
        {
            "optionId": int,
            "companyId": int,
            "audienceReach": int,
            "cost": dec(10, 2)
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
POST /basic/getResults
```

### Sample Response

```json
{
    "result": [
        {
            "optionId": 1234567891,
            "companyId": 1234567890,
            "audienceReach": 10000,
            "cost": 300.00
        },
        {
            "optionId": 1234567892,
            "companyId": 1234567890,
            "audienceReach": 7000,
            "cost": 200.00
        }
    ]
}
```

### Sample Error

```json
{
	"error": "Server Error",
	"code": 500
}
```