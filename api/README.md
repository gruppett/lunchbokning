# API Documentation

## Introduction

### Files

[]: # Path: api\README.md || this file
[]: # Path: api\functions.php || db connection, json encode, status codes

## Routes

### api/addUserRoles.php

Checks if first login, if so, adds user and their roles to the database.

#### Parameters

- `$_POST['mail']` : The user's mail. Required
- `$_POST['roles[]']` : The user's groups. Required

#### Return

json encoded array with status code and message examples

##### 200 OK

{
"meddelande": [
"mail@test finns redan"
]
}

201 Created
{
"roles": [
[
"Spara lyckades för 10 med rollen Personal"
],
[
"Spara lyckades för 10 med rollen Kökslärare"
]
],
"meddelande": [
"Spara lyckades för mail@test7 med ID 10"
]
}

### Global Status Codes

#### 400 Bad Request

{
"error": [
"Fel på indata",
"Bad indata. Roles saknas"
]
}

#### 405 Method Not Allowed

{
"error": [
"Missing post data",
"POST required"
]
}

500 Internal Server Error
