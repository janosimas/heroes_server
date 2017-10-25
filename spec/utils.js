const request = require('request');
const URI = require('urijs');

// hack (??) to access value in this file
const baseUrl = 'http://localhost:8080/api';
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

const asyncGETRequest = (path, token, callback) => {
  const uri = new URI(`${baseUrl}/${path}`).addQuery('token', token);
  // auxiliary function to make an async request in the test
  request.get(uri.toString(), (error, response, body) => {
    callback(error, response, body);
  });
};
exports.asyncGETRequest = asyncGETRequest;

const asyncPOSTRequest = (path, token, callback, options) => {
  const uri = new URI(`${baseUrl}/${path}`).addQuery('token', token);
  // auxiliary function to make an async request in the test
  request.post(uri.toString(), { json: options }, (error, response, body) => {
    callback(error, response, body);
  });
};
exports.asyncPOSTRequest = asyncPOSTRequest;
