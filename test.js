const createServer = require('./app/server');
const superHeroTest = require('./spec/superHeroTest');
const fs = require('fs');
const path = require('path');

const removeFiles = (dbpath, files) => {
  if (files && files.length > 0) {
    const file = files.pop();
    console.log(`{removing ${file}}...`)
    fs.unlink(dbpath+'/'+file, (err) => {
      if (err) console.log(err);
      removeFiles(dbpath, files);
    })
  }
};

// use a temp test database
const dbpath = path.dirname(process.argv[1]) + '/testdb';
const server = createServer(8080, dbpath);
superHeroTest(() => {
  server.close();

  // after the test finishes
  // delete test database
  fs.readdir(dbpath, 'utf8', (err, files) => {
    removeFiles(dbpath, files, () => {
      fs.rmdir(dbpath, (err) => {
        if (err) console.log(err);
      });
    });
  });
});
