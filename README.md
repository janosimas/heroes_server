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

## SuperHeroes

### GET /ListSuperHeroes
### POST /ListSuperHero
### POST /AddSuperHero [admin]
### POST /UpdateSuperHero [admin]
### POST /DeleteSuperHero [admin]

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