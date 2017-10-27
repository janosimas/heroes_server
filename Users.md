## SuperHeroes
Here are the routes to manipulate `Users`, all routes can only be accessed with `administrative` permission.

A token must be passed in all queries, it may be passed as a `json` with the `token` property, in the `query` or as `x-access-token`.

### GET /ListUsers [admin]
output [may be empty]:
```
[<list of Users>]
```

### POST /AddUser [admin]
Valid roles values are: `admin`, `standard`

input:
```
{
  "name": "<user name>",
  "password": "<user password>",
  "role": "<user role>"
}
```
output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```

### POST /UpdateUser [admin]
input, name is the only mandatory property
```
{
  "name": "<user name>",
  "password": "[<user password>]",
  "role": "[<user role>]"
}
```

output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```

### POST /DeleteUser [admin]
input:
```
{
    "success": "<user name>"
}
```

output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```
