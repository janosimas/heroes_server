const createServer = require('./app/server');
const superHeroTest = require('./spec/superHeroTest');

const server = createServer(8080);
superHeroTest(() => {
  server.close();
});
