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

[Users API](Users.md)

[SuperHeroes API](SuperHeroesRoutes.md)


## Executing tests and code coverage
To run the tests just execute the command:
```
npm test
```
the code coverage can be found at the **coverage** folder.


## TODO:
- add super powers routes
- doc users routes
- allow users to have many roles
