const createServer = require('./app/server');
const superHeroTest = require('./spec/superHeroTest');
const { RegisterAuditSubscriber } = require('./app/auditUtils')
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

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

nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error(`Failed to create a testing account. ${err.message}`);
    return;
  }

  console.log('Credentials obtained, sending message...');

  // Create a SMTP transporter object
  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  // use a temp test database
  const dbpath = `${path.dirname(process.argv[1])}/testdb'`;
  const server = createServer(8080, dbpath, transporter, true);

  RegisterAuditSubscriber(account.user);

  superHeroTest(() => {
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
