# API Documentation

## Introduction

### Files

- Path: api\README.md || this file
- Path: api\functions.php || db connection, json encode, status codes

## Routes

### api/addUserRoles.php\_

Checks if first login, if so, adds user and their roles to the database and returns json.

\***\*Parameters\*\***

- `$_POST['mail']` : The user's mail. Required
- `$_POST['roles["Administratör", "Kökslärare", "Salslärare", "Grupphandledare", "Personal"]']` : The user's groups. Required

#### Return

json encoded array with status code and message examples

**_200 OK_**

```json
{
  "meddelande": ["mail@test finns redan"]
}
```

**_201 Created_**

```json
{
  "roles": [
    ["Spara lyckades för 10 med rollen Personal"],
    ["Spara lyckades för 10 med rollen Kökslärare"]
  ],
  "meddelande": ["Spara lyckades för mail@test7 med ID 10"]
}
```

```json
{
  "meddelande": ["Spara lyckades för test_user@mail_4 med ID 1"],
  "error": ["Rollen personal1 finns inte i tabellen roles"],
  "roles": [["Spara lyckades för 1 med grundrollen Personal"]]
}
```

### Global Status Codes

**_400 Bad Request_**

```json
{
  "error": ["Fel på indata", "Bad indata. Roles saknas"]
}
```

**_405 Method Not Allowed_**

```json
{
  "error": ["Missing post data", "POST required"]
}
```

**_500 Internal Server Error_**
