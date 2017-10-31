## SuperHeroes
Here are the routes to manipulate `Super Heroes`,
a token must be passed in all queries, it may be passed as a `json` with the `token` property, in the `query` or as `x-access-token`.

### POST /ListSuperHero
output:
```
{
  "name": "<SuperHero name>",
  "alias": "<SuperHero secret identity>",
  "protection_area": {
    "name": "<Area name>",
    "lat": <latitude of the area>,
    "long": <logintude of the area>,
    "radius": <radius of the protection area>
  }
  "super_powers": [<List of SuperPowers names>]
}
```

No hero with such name output:
```
{
    "error": "<error message>",
    "success": false
}
```

### POST /ListSuperHeroes

The `input` information can be used to paginate the list of heroes , the maximum number of heroes listed is 100, more then that and only 100 heroes are returned.

input: [may be empty]
```
{
    skipt: <number of users to skip>,
    limit: <max number of users to return>
}
```

output:
```
{
  total_count: <total number of users>,
  heroes: [<list of SuperHeroes>]
}
```

### POST /AddSuperHero [admin]
input:
```
{
  "name": "<SuperHero name>",
  "alias": "<SuperHero secret identity>",
  "protection_area": {
    "name": "<Area name>",
    "lat": <latitude of the area>,
    "long": <logintude of the area>,
    "radius": <radius of the protection area>
  }
  "super_powers": [<List of SuperPowers names>]
}
```
output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```

### POST /UpdateSuperHero [admin]
input, name is the only mandatory property
```
{
  "name": "<SuperHero name>",
  "alias": "<SuperHero secret identity>",
  "protection_area": {
    "name": "<Area name>",
    "lat": <latitude of the area>,
    "long": <logintude of the area>,
    "radius": <radius of the protection area>
  }
  "super_powers": [<List of SuperPowers names>]
}
```

output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```

### POST /DeleteSuperHero [admin]
input:
```
{
    "name": "<SuperHeroName>"
}
```

output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```
