const test = require('tape');
const { removeAllPowers, listPowers, createPower, updatePower, removePowers } = require('./powers_utils');

module.exports = (done) => {
  test('List super powers in the server.', (tape) => {
    tape.plan(3);

    removeAllPowers(() => {
      listPowers((err, res, bd) => {
        tape.notOk(err, 'error returned false');
        tape.equal(res.statusCode, 200);
        tape.equal(bd, '[]');
      });
    });
  });

  test('Create, update and remove power.', (tape) => {
    tape.plan(12);

    removeAllPowers(() => {
      listPowers((err, res, bd) => {
        tape.notOk(err, 'error returned false');
        tape.equal(res.statusCode, 200);
        tape.equal(bd, '[]');
        createPower('Flight', 'The super can fly like a bird.', () => {
          listPowers((errCreate, resCreate, bdCreate) => {
            tape.notOk(errCreate, 'error returned false');
            tape.equal(resCreate.statusCode, 200);
            tape.equal(bdCreate, '[{"name":"Flight","description":"The super can fly like a bird."}]');
            updatePower('Flight', 'The super can fly like an airplane.', () => {
              listPowers((errUpdate, resUpdate, bdUpdate) => {
                tape.notOk(errUpdate, 'error returned false');
                tape.equal(resUpdate.statusCode, 200);
                tape.equal(bdUpdate, '[{"name":"Flight","description":"The super can fly like an airplane."}]');
                removePowers([{ name: 'Flight' }], () => {
                  listPowers((errRemove, resRemove, bdRemove) => {
                    tape.notOk(errRemove, 'error returned false');
                    tape.equal(resRemove.statusCode, 200);
                    tape.equal(bdRemove, '[]');
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
