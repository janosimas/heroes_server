const {
  getAuth, asyncGETRequest, asyncPOSTRequest, removeAllHeroes,
} = require('./utils');
// disable check, jasmine doesn't define until running
/* eslint no-undef: 0 */

// //////////////////////////////////////
// being tests
// /////////////////////////////////////
describe('Heroes test suit.', () => {
  describe('Empty heroes list in the server', () => {
    let error;
    let response;
    let body;
    beforeEach((done) => {
      removeAllHeroes(() => {
        getAuth(asyncGETRequest, {
          path: 'ListHeroes',
          callback: (err, res, bd) => {
            error = err;
            response = res;
            body = bd;
            done();
          },
        });
      });
    }, 1000000000);

    it('will wait until async completes and calls done', () => {
      expect(error).toBeFalsy();
      expect(response.statusCode).toBe(200);
      expect(body).toBe('[]');
    }, null, 1000000000);
  });

  describe('Create sample hero and list heroes.', () => {
    pending('wait');
    beforeEach((done) => {
      getAuth(asyncGETRequest, {
        path: 'DeleteAllHeroes',
        callback: () => {
          if (error) fail('Error deleting heroes');
          getAuth(asyncPOSTRequest, {
            path: 'AddHero',
            json: {
              name: 'Batman',
              alias: 'Bruce Waine',
              protection_area: {
                name: 'Gothan City',
                lat: 12,
                long: 13,
                radius: 100,
              },
            },
            callback: () => {
              if (error) fail('Error creating hero');
              getAuth(asyncGETRequest, { path: 'ListHeroes', callback: done });
            },
          });
        },
      });
    }, 1000000000);

    it('will wait until async completes and calls done', () => {
      expect(error).toBeFalsy();
      expect(response.statusCode).toBe(200);
      const heroList = JSON.parse(body);

      expect(JSON.stringify(heroList)).toBe('[{"name":"Batman","alias":"Bruce Waine","protection_area":"Gothan City","super_powers":[]}]');
    }, null, 1000000000);
  });
});
