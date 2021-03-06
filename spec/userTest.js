const test = require('tape');
const { removeAllUsers, listUsers, createUser, updateUser } = require('./users_utils');
const roles = require('../app/roles');
const { baseUrl, asyncPOSTRequest } = require('./utils');
const request = require('request');
const URI = require('urijs');

module.exports = (done) => {

  // ================================
  // test route for push messages
  // ================================
  // test('Connect to a stream', (tape)=>{
  //   tape.plan(1);
  //   const uri = new URI('http://127.0.0.1:8080/api/Connect');
  //   request.post(uri.toString()).pipe(process.stdout);
  // });
  // return;
  // ================================

  test('List users in the server', (tape) => {
    tape.plan(3);

    // won't remove all, the admin will remain
    removeAllUsers(() => {
      listUsers((err, res, bd) => {
        tape.notOk(err, 'error returned false');
        tape.equal(res.statusCode, 200);
        tape.equal(bd, '{"total_count":1,"users":[{"name":"admin","role":"admin"}]}');
      });
    });
  });

  test('Create standard user and try to log', (tape) => {
    tape.plan(15);

    const newuser = 'newuser';
    const newpass = 'newpass';
    const otherpass = 'otherpass';

    // won't remove all, the admin will remain
    removeAllUsers(() => {
      createUser(newuser, newpass, roles.STANDARD, () => {
        listUsers((err, res, bd) => {
          tape.notOk(err, 'error returned false');
          tape.equal(res.statusCode, 200);
          tape.equal(bd, `{"total_count":2,"users":[{"name":"admin","role":"admin"},{"name":"${newuser}","role":"standard"}]}`);

          const uri = new URI(`${baseUrl}/authenticate`);
          // authenticate with standart user
          request.post(uri.toString(), { form: { name: newuser, password: newpass } }, (error_, response_, body_) => {
            tape.notOk(err, 'error returned false');
            tape.equal(res.statusCode, 200);
            const json = JSON.parse(body_);
            tape.equal(json.success, true);
            const { token } = json;
            // try to list users with standart permission
            asyncPOSTRequest('ListUsers', token, (errList, resList, bodyList) => {
              tape.notOk(errList, 'error returned false');
              tape.equal(resList.statusCode, 403);
              const jsonList = JSON.parse(bodyList);
              tape.equal(jsonList.success, false);

              // update user to admin
              updateUser(newuser, otherpass, roles.ADMIN, () => {
                // log as admin with the new user
                request.post(uri.toString(), { form: { name: newuser, password: otherpass } }, (errAdm, resAdm, bdAdm) => {
                  tape.notOk(errAdm, 'error returned false');
                  tape.equal(res.statusCode, 200);
                  const jsonAdm = JSON.parse(bdAdm);
                  tape.equal(jsonAdm.success, true);
                  const tokenAdm = jsonAdm.token;
                  // try to list users with standart permission
                  asyncPOSTRequest('ListUsers', tokenAdm, (errListAdm, resListAdm, bodyListAdm) => {
                    tape.notOk(errListAdm, 'error returned false');
                    tape.equal(resListAdm.statusCode, 200);
                    tape.equal(bodyListAdm, `{"total_count":2,"users":[{"name":"admin","role":"admin"},{"name":"${newuser}","role":"admin"}]}`);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  // dummy test to close the server
  test('close server', (tape) => {
    tape.plan(1);
    tape.equal(true, true);
    done();
  });
};
