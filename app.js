const createServer = require('./app/server');

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens
createServer(port);
