const createServer = require('./app/server');
const superHeroTest = require('./spec/superHeroTest');
const superPowerTest = require('./spec/superPowerTest');
const userTest = require('./spec/userTest');
const { RegisterAuditSubscriber } = require('./app/auditUtils');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { account } = require('./app/transporter_account');

const removeFiles = (dbpath, files) => {
  if (files && files.length > 0) {
    const file = files.pop();
    console.log(`{removing ${file}}...`);
    fs.unlink(`${dbpath}/${file}`, (err) => {
      if (err) console.log(err);
      removeFiles(dbpath, files);
    });
  }
};

let transporter = null;
if (account) {
  // Create a SMTP transporter object
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  RegisterAuditSubscriber(account.user);
}

// use a temp test database
const dbpath = `${path.dirname(process.argv[1])}/testdb`;
const server = createServer(8080, dbpath, transporter, true);

// wait for finishing service startup
setTimeout(() => {
  userTest(() => {
    superHeroTest(() => {
      superPowerTest(() => {
        server.close();

        // after the test finishes
        // delete test database
        fs.readdir(dbpath, 'utf8', (errRead, files) => {
          removeFiles(dbpath, files, () => {
            fs.rmdir(dbpath, (errRmDir) => {
              if (errRmDir) console.log(errRmDir);
            });
          });
        });
      });
    });
  });
}, 3000);
