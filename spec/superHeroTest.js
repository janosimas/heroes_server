const { removeAllHeroes, listHeroes, createBatman, updateBatmansIdentity, killBatman } = require('./heroes_utils');
const test = require('tape');
// disable check, jasmine doesn't define until running
/* eslint no-undef: 0 */

module.exports = () => {
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
        tape.equal(bd, '[]');
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
          tape.equal(bd, '[{"name":"Batman","alias":"Bruce Waine","protection_area":"Gothan City","super_powers":[]}]');
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
            tape.equal(bd, '[{"name":"Batman","alias":"Dick Grayson","protection_area":"Gothan City","super_powers":[]}]');
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
          tape.equal(bd, '[{"name":"Batman","alias":"Bruce Waine","protection_area":"Gothan City","super_powers":[]}]');
          killBatman(() => {
            listHeroes((err2, res2, bd2) => {
              tape.notOk(err2, 'error returned false');
              tape.equal(res2.statusCode, 200);
              tape.equal(bd2, '[]');
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
        tape.equal(res2.statusCode, 200);
        tape.equal(JSON.stringify(bd2), '{"success":true}');
      });
    });
  });
};
