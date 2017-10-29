const createServer = require('./app/server');
const nodemailer = require('nodemailer');
const { account } = require('./app/transporter_account');

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
}

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens
createServer(port, null, transporter);
