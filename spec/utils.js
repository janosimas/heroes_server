const request = require('request');
const URI = require('urijs');

// prefere 127.0.0.1 to localhost,
// if the system doesn't have a network interface
// connecting to localhost will fail
const baseUrl = 'http://127.0.0.1:8080/api';
exports.baseUrl = baseUrl;

const getAuth = (callback) => {
  const uri = new URI(`${baseUrl}/authenticate`);
  // auxiliary function to make an async request in the test
  request.post(uri.toString(), { form: { name: 'admin', password: 'admin' } }, (error_, response_, body_) => {
    if (error_) throw error_;
    const json = JSON.parse(body_);
    callback(json.token);
  });
};
exports.getAuth = getAuth;

const asyncPOSTRequest = (path, token, callback, options) => {
  const uri = new URI(`${baseUrl}/${path}`).addQuery('token', token);
  // auxiliary function to make an async request in the test
  request.post(uri.toString(), { json: options }, (error, response, body) => {
    callback(error, response, body);
  });
};
exports.asyncPOSTRequest = asyncPOSTRequest;
