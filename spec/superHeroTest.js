const { removeAllHeroes, listHeroes, createBatman, updateBatmansIdentity, killBatman, createFlyingMan } = require('./heroes_utils');
const { removeAllPowers, createFlightPower } = require('./powers_utils');
const test = require('tape');

module.exports = (done) => {
  // //////////////////////////////////////
  // being tests
  // /////////////////////////////////////
  test('Empty heroes list in the server', (tape) => {
    tape.plan(3);

    removeAllHeroes(() => {
      // console.log('No more heroes.');
      listHeroes((err, res, bd) => {
        tape.notOk(err, 'error returned false');
        tape.equal(res.statusCode, 200);
        tape.equal(bd, '{"total_count":0,"heroes":[]}');
      });
    });
  });

  test('Create a hero', (tape) => {
    tape.plan(3);

    removeAllHeroes(() => {
      createBatman(() => {
        // console.info('A hero is born');
        listHeroes((err, res, bd) => {
          tape.notOk(err, 'error returned false');
          tape.equal(res.statusCode, 200);
          tape.equal(bd, '{"total_count":1,"heroes":[{"name":"Batman","alias":"Bruce Waine","protection_area":{"name":"Gothan City","lat":12,"long":13,"radius":100},"super_powers":[]}]}');
        });
      });
    });
  });

  test('Create a hero with powers', (tape) => {
    tape.plan(6);

    removeAllHeroes(() => {
      removeAllPowers(() => {
        createFlightPower(() => {
          createFlyingMan((errCreate, responseCreate, bodyCreate) => {
            tape.notOk(errCreate, 'error returned false');
            tape.equal(responseCreate.statusCode, 200);
            tape.equal(JSON.stringify(bodyCreate), '{"success":true}');
            listHeroes((err, res, bd) => {
              tape.notOk(err, 'error returned false');
              tape.equal(res.statusCode, 200);
              tape.equal(bd, '{"total_count":1,"heroes":[{"name":"FlyingMan","alias":"John Bird","protection_area":{"name":"Air City","lat":24,"long":26,"radius":1000},"super_powers":["Flight"]}]}');
            });
          });
        });
      });
    });
  });

  test('Create a hero with invalid powers', (tape) => {
    tape.plan(3);

    removeAllHeroes(() => {
      removeAllPowers(() => {
        createFlyingMan((errCreate, responseCreate, bodyCreate) => {
          tape.notOk(errCreate, 'error returned false');
          tape.equal(responseCreate.statusCode, 404);
          tape.equal(JSON.stringify(bodyCreate), '{"success":false,"error":"Unable to find Super power: Flight"}');
        });
      });
    });
  });

  test('Update a hero name', (tape) => {
    tape.plan(3);

    removeAllHeroes(() => {
      // console.info('All heroes are dead.');
      createBatman(() => {
        // console.info('A hero is born');
        updateBatmansIdentity(() => {
          // console.info('Passing the mantle.');
          listHeroes((err, res, bd) => {
            tape.notOk(err, 'error returned false');
            tape.equal(res.statusCode, 200);
            tape.equal(bd, '{"total_count":1,"heroes":[{"name":"Batman","alias":"Dick Grayson","protection_area":{"name":"Gothan City","lat":12,"long":13,"radius":100},"super_powers":[]}]}');
          });
        });
      });
    });
  });

  test('Remove a hero', (tape) => {
    tape.plan(6);

    removeAllHeroes(() => {
      createBatman(() => {
        // console.info('A hero is born');
        listHeroes((err, res, bd) => {
          tape.notOk(err, 'error returned false');
          tape.equal(res.statusCode, 200);
          tape.equal(bd, '{"total_count":1,"heroes":[{"name":"Batman","alias":"Bruce Waine","protection_area":{"name":"Gothan City","lat":12,"long":13,"radius":100},"super_powers":[]}]}');
          killBatman(() => {
            listHeroes((err2, res2, bd2) => {
              tape.notOk(err2, 'error returned false');
              tape.equal(res2.statusCode, 200);
              tape.equal(bd2, '{"total_count":0,"heroes":[]}');
            });
          });
        });
      });
    });
  });

  test('Try to remove a hero that doesn\'t exists', (tape) => {
    tape.plan(3);

    removeAllHeroes(() => {
      killBatman((err2, res2, bd2) => {
        tape.notOk(err2, 'error returned false');
        tape.equal(res2.statusCode, 404);
        tape.equal(JSON.stringify(bd2), '{"success":false,"error":"No SuperHero named Batman"}');
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
