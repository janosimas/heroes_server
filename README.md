# Heroes Server

Simple Node.js REST server for managing super heroes and powers.


Running the app
```
node app.js
```

## Configuration
- To send audit a email server account must be configured at the file `transporter_account.js`.

## Architecture
- As this is a sample project I used `TingoDB` with `Tungus`+`mooongose`, this way I got a local file db that can be easily migrated to a `MongoDB`.
- I tryed to keep the routes simple, so all routes are `GET` and `POST`.
- `Tape` was choosed as test framework for simplicity and synchronous testing.
- All tests are integration tests for a more complete overview.

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

### POST /AuditAccess [admin]
Route to register an email to receive audit messages.

input
```
{
  name: <username>,
  email: <useremail>
}
```

output:
```
{
  success: <bool>
  error: <error if any>
}
```

[Users API](Users.md)

[SuperHeroes API](SuperHeroesRoutes.md)

[SuperPowers API](SuperPowersRoutes.md)


## Executing tests and code coverage
To run the tests just execute the command:
```
./node_modules/.bin/istanbul cover node_modules/tape/bin/tape test.js
```
the code coverage can be found at the **coverage** folder.

### Notes on test
- Use the [transporter_account.js](app/transporter_account.js) file if you want to receive test audit messages.
- Istanbul is not generating the coverage report if executing ```npm test```.

## TODO:
- allow users to have many roles
- test heroes with powers
- test wrong requests, invalid powers, invalid roles, no name of <entity>
- paginate results
- geo-request for hero
- audit register route
