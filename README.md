# Heroes Server

Simple Node.js REST server for managing super heroes and powers.


Running the app
```
node app.js
```

## API
### POST /authenticate
Every user must be authenticated to access the rest of the API.
Methods marked with [admin] can only be accessed by users with administrative level.

the input may be a `x-www-form-encoded` or a `apllication/json`:
```
{
  name: <username>,
  password: <password>
}
```

output:
```
{
  success: <bool>
  token: <token>
}
```

the token must be passed in all queries, it may be passed as a `json` with the `token` property, in the `query` or as `x-access-token`.

## SuperHeroes

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

### GET /ListSuperHeroes
output [may be empty]:
```
[<list of SuperHeroes>]
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
```json
{
    "success": "<SuperHeroName>"
}
```

output:
```
{
    "success": <bool>,
    "error": "<error message if an error occurred>",
}
```

## Executing tests and code coverage
To run the tests just execute the command:
```
npm test
```
the code coverage can be found at the **coverage** folder.


## TODO:
- remove debug routes
- add super powers routes
- add users routes
- allow users to have many roles

### Known issues
- no way to update the protection area