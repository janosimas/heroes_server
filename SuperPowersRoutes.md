## SuperPowers
Here are the routes to manipulate `Super Powers`,
a token must be passed in all queries, it may be passed as a `json` with the `token` property, in the `query` or as `x-access-token`.

### POST /ListSuperPower
output:
```
{
  "name": "<SuperPower name>",
  "description": "<SuperPower description>",
}
```

No hero with such name output:
```
{
    "error": "<error message>",
    "success": false
}
```

### POST /ListSuperPowers

The `input` information can be used to paginate the list of powers , the maximum number of powers listed is 100, more then that and only 100 powers are returned.

input: [may be empty]
```
{
    skipt: <number of users to skip>,
    limit: <max number of users to return>
}
```

output [may be empty]:
```
{
    total_count: <total number of users>,
    powers: [<list of SuperPowers>]
}
```

### POST /AddSuperPower [admin]
input:
```
{
  "name": "<SuperPower name>",
  "description": "<SuperPower description>",
}
```
output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```

### POST /UpdateSuperPower [admin]
input
```
{
  "name": "<SuperPower name>",
  "description": "<SuperPower description>",
}
```

output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```

### POST /DeleteSuperPower [admin]
input:
```
{
    "name": "<SuperPowerName>"
}
```

output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```
