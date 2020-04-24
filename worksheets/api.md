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
| HTTP Method | GET            |
| Endpoint    | /basic/allData |

### Parameters

| parameter | datatype        | example   |
| --------- | --------------- | --------- |
|    nil    |       nil       |    nil    |

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
GET /basic/AllData
```

### Sample Response

```json
{
    "result": [
        {
            "optionId": 1234567890,
            "companyId": 1234567891,
            "audienceReach": 2000,
            "cost": 100.00
        }
        {
            "optionId": 1234567891,
            "companyId": 1234567890,
            "audienceReach": 10000,
            "cost": 300.00
        }
        {
            "optionId": 1234567892,
            "companyId": 1234567890,
            "audienceReach": 20000,
            "cost": 400.00
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


## [Data viewer page] Get All Data (with filtering) ---------------------------------------------------------------

| attribute   | value                  |
| ----------- | ---------------------- |
| HTTP Method | GET                    |
| Endpoint    | /basic/allDataFiltered |

### Parameters

| parameter     | datatype        | example    |
| ------------- | --------------- | ---------- |
| companyId     | 10 digit number | 1234567890 |
| audienceReach | Integer         | 100000     |

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
GET /basic/AllDataFiltered?companyId=1234567890&audienceReach=10000
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

| attribute   | value           |
| ----------- | --------------- |
| HTTP Method | GET             |
| Endpoint    | /basic/results  |

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
GET /basic/Results?optionId=1234567890&cost=10000
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




## Insert Data ----------------------------------------------------------------------------

| attribute   | value         |
| ----------- | -----------   |
| HTTP Method | Insert        |
| Endpoint    | /insert       |

### Parameters

| parameter      | datatype        | example   |
| ---------      | --------------- | --------- |
| optionId       | 10 digit number | 123456789 |
| companyId      | 10 digit number | 123456789 |
| audienceReach  | Int             | 500       |
| cost           | Dec(10, 2)      | 1000.50   |



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
POST /insert?optionID=1234567890&companyID=1234567890&audienceReach=10000&cost=300.00&adTypeName=Fixed
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
