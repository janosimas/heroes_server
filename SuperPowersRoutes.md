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

### GET /ListSuperPowers
output [may be empty]:
```
[<list of SuperPowers>]
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
