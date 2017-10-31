## SuperHeroes
Here are the routes to manipulate `Users`, all routes can only be accessed with `administrative` permission.

A token must be passed in all queries, it may be passed as a `json` with the `token` property, in the `query` or as `x-access-token`.

### POST /ListUsers [admin]

The `input` information can be used to paginate the list of users, the maximum number of users listed is 100, mor then that and only 100 users are returned.

input: [may be empty]
```
{
    skipt: <number of users to skip>,
    limit: <max number of users to return>
}
```

output:
```
total_count: <total number of users>,
users: [<list of Users>]
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
