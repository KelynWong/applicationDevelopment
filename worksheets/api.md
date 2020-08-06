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

## Insert ----------------------------------------------------------------------------

| attribute   | value          |
| ----------- | -------------- |
| HTTP Method | POST           |
| Endpoint    | /basic/insert/ |

### Parameters

|   parameter   | datatype        | example    |
| ------------- | --------------- | ---------- |
| optionId      | 10 digit number | 1000000001 |
| companyId     | 10 digit number | 1000000001 |
| cost          |     decimal     |     1      |
| audienceReach |       int       |     1      |

### Response Body

```json
{
    "result": [
        {
            "result": string
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
POST /basic/insert/
```

### Sample Response

```json
{
    "result": [
        {
            "result": "success"
        }
    ]
}
```

### Sample Error

```json
{
	"error": "Key (optionid, adtype)=(1000000001, Not Fixed) already exists.",
	"code": 23505
}
```

## [Data viewer page] Get All Data ----------------------------------------------------------------------------

| attribute   | value          |
| ----------- | -------------- |
| HTTP Method | GET            |
| Endpoint    | /basic/allData |

### Parameters

|   parameter   | datatype        | example    |
| ------------- | --------------- | ---------- |
| companyId     | 10 digit number | 1000000001 |
| audienceReach |       int       |   4000     |
| page          |       int       |     1      |
| pageSize      |       int       |     1      |

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
            "adtype": "Not Fixed"
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

## [Any page] Get Row count ---------------------------------------------------------------

| attribute   | value               | 
| ----------- | ------------------- |
| HTTP Method | GET                 |
| Endpoint    | /basic/getRowCount  |

### Parameters

| parameter | datatype        | example    |
| companyId      | 10 digit number | 1234567890|
| audienceReach  | Int             | 500       |


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
GET /basic/getRowCount
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


## [Results page] Get chart data ---------------------------------------------------------------

| attribute   | value              |
| ----------- | ------------------ |
| HTTP Method | GET                |
| Endpoint    | /basic/allChartData|

### Parameters

| parameter | datatype        | example                          |
| --------- | --------------- | -------------------------------- |
| optionIds | 10 digit number | 1000000001,1000000002,1000000003 |

### Response Body

```json
{
    "result": [
        {
            "optionId": int,
            "companyId": int,
            "audienceReach": int,
            "cost": dec(10, 2),
            "adType": String
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
POST /basic/allChartData
```

### Sample Response

```json
{
    "result": [
        {
            "optionId": 1234567891,
            "companyId": 1234567890,
            "audienceReach": 10000,
            "cost": 300.00,
            "adType": "Not Fixed"
        },
        {
            "optionId": 1234567892,
            "companyId": 1234567890,
            "audienceReach": 7000,
            "cost": 200.00,
            "adType": "Not Fixed"
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

## [Results page] Get Results ---------------------------------------------------------------

| attribute   | value             |
| ----------- | ----------------- |
| HTTP Method | GET               |
| Endpoint    | /basic/result     |

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
            "cost": dec(10, 2),
            "adType": String
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
POST /basic/result
```

### Sample Response

```json
{
    "result": [
        {
            "optionId": 1234567891,
            "companyId": 1234567890,
            "audienceReach": 10000,
            "cost": 300.00,
            "adType": "Not Fixed"
        },
        {
            "optionId": 1234567892,
            "companyId": 1234567890,
            "audienceReach": 7000,
            "cost": 200.00,
            "adType": "Not Fixed"
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






## --------------------------------------- ADVANCE APIs ------------------------------------------------------

## Insert ----------------------------------------------------------------------------

| attribute   | value            |
| ----------- | ---------------- |
| HTTP Method | POST             |
| Endpoint    | /advance/insert/ |

### Parameters

|   parameter   | datatype        | example    |
| ------------- | --------------- | ---------- |
| optionId      | 10 digit number | 9000000001 |
| companyId     | 10 digit number | 9000000001 |
| cost          |     decimal     |     1      |
| audienceReach |       int       |     1      |

### Response Body

```json
{
    "result": [
        {
            "result": string
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
POST /advance/insert/
```

### Sample Response

```json
{
    "result": [
        {
            "result": "success"
        }
    ]
}
```

### Sample Error

```json
{
	"error": "Key (optionid, adtype)=(9000000001, Fixed) already exists.",
	"code": 23505
}
```

## [Data viewer page] Get All Data ----------------------------------------------------------------------------

| attribute   | value            |
| ----------- | ---------------- |
| HTTP Method | GET              |
| Endpoint    | /advacne/allData |

### Parameters

|   parameter   | datatype        | example    |
| ------------- | --------------- | ---------- |
| companyId     | 10 digit number | 1000000001 |
| audienceReach |       int       |   4000     |
| page          |       int       |     1      |
| pageSize      |       int       |     1      |

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
POST /advance/AllData
```

### Sample Response

```json
{
    "result": [
        {
            "optionid": 9000000005,
            "companyid": 9000000001,
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

## [Any page] Get Row count ---------------------------------------------------------------

| attribute   | value               | 
| ----------- | ------------------- |
| HTTP Method | GET                 |
| Endpoint    | /advance/getRowCount|

### Parameters

| parameter | datatype        | example    |
| companyId      | 10 digit number | 1234567890|
| audienceReach  | Int             | 500       |


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
GET /advance/getRowCount
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


## [Results page] Get chart data ---------------------------------------------------------------

| attribute   | value                |
| ----------- | -------------------- |
| HTTP Method | GET                  |
| Endpoint    | /advance/allChartData|

### Parameters

| parameter | datatype        | example                          |
| --------- | --------------- | -------------------------------- |
| optionIds | 10 digit number | 1000000001,1000000002,1000000003 |

### Response Body

```json
{
    "result": [
        {
            "optionId": int,
            "companyId": int,
            "audienceReach": int,
            "cost": dec(10, 2),
            "adType": String
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
POST /advance/allChartData
```

### Sample Response

```json
{
    "result": [
        {
            "optionId": 9234567891,
            "companyId": 9234567890,
            "audienceReach": 10000,
            "cost": 300.00,
            "adType": "Fixed"
        },
        {
            "optionId": 9234567892,
            "companyId": 9234567890,
            "audienceReach": 7000,
            "cost": 200.00,
            "adType": "Fixed"
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

## [Results page] Get Results ---------------------------------------------------------------

| attribute   | value             |
| ----------- | ----------------- |
| HTTP Method | GET               |
| Endpoint    | /advance/result   |

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
            "cost": dec(10, 2),
            "adType": String
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
POST /advance/result
```

### Sample Response

```json
{
    "result": [
        {
            "optionId": 9234567891,
            "companyId": 9234567890,
            "audienceReach": 10000,
            "cost": 300.00,
            "adType": "Fixed"
        },
        {
            "optionId": 9234567892,
            "companyId": 9234567890,
            "audienceReach": 7000,
            "cost": 200.00,
            "adType": "Fixed"
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