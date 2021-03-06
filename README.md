# Heroes Server

Simple Node.js REST server for managing super heroes and powers.


Running the app
```
node app.js
```

## Configuration
- To send audit messagens an email server account must be configured at the file `transporter_account.js`.

## Architecture
- As this is a sample project I used `TingoDB` with `Tungus`+`mooongose`, this way I got a local file db that can be easily migrated to a `MongoDB`.
  - `Tungus` only accepts `mooongose`, some of the architecture choices were based on this.
- I tried to keep the routes simple, so all routes are `POST`.
- `Tape` was choosed as test framework for simplicity and synchronous testing.
- All tests are integration tests for a more complete overview.
- All passwords are encrypted with a salt using [brypt](https://www.npmjs.com/package/bcrypt)

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

- To send audit messagens an email server account must be configured at the file `transporter_account.js`.

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
- create a push interface
  - should be easy update the [audit](app/auditUtils.js) method
  - [postman](https://github.com/postmanlabs/postman-app-support/issues/278) don't support stream
  - working test in commented code at [routes.js](app/routes.js) and [userTest.js](spec/userTest.js)
- more tests on heroes with powers
- test wrong requests, invalid powers, invalid roles, no name of <entity>
- [geo-request](https://github.com/Automattic/mongoose/wiki/3.6-Release-Notes#geojson-support-mongodb--24) for hero
- audit register route
