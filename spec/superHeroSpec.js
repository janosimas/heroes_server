const request = require('request');
const URI = require('urijs');
// disable check, jasmine doesn't define until running
/* eslint no-undef: 0 */
const baseUrl = 'http://localhost:8080/api';
const getAuth = (callback, options) => {
  const uri = new URI(`${baseUrl}/authenticate`);
  // auxiliary function to make an async request in the test
  request.post(uri.toString(), { form: { name: 'Jano Simas', password: 'password' } }, (error_, response_, body_) => {
    if (error_) throw error_;
    const json = JSON.parse(body_);
    callback(options.path, json.token, options.callback, options.json);
  });
};
// auxiliary async parameters
let error;
let response;
let body;
const asyncGETRequest = (path, token, callback) => {
  const uri = new URI(`${baseUrl}/${path}`).addQuery('token', token);
  // auxiliary function to make an async request in the test
  request.get(uri.toString(), (error_, response_, body_) => {
    if (error_) throw error_;
    error = error_;
    response = response_;
    body = body_;
    callback();
  });
};

const asyncPOSTRequest = (path, token, callback, options) => {
  const uri = new URI(`${baseUrl}/${path}`).addQuery('token', token);
  // auxiliary function to make an async request in the test
  request.post(uri.toString(), {
    json: options,
  }, (error_, response_, body_) => {
    if (error_) throw error_;
    error = error_;
    response = response_;
    body = body_;
    callback();
  });
};

// //////////////////////////////////////
// being tests
// /////////////////////////////////////
describe('Heroes test suit.', () => {
  describe('Empty heroes list in the server', () => {
    beforeEach((done) => {
      getAuth(asyncGETRequest, {
        path: 'DeleteAllHeroes',
        callback: () => {
          getAuth(asyncGETRequest, { path: 'ListHeroes', callback: done });
        },
      });
    }, 1000000000);

    it('will wait until async completes and calls done', () => {
      expect(error).toBeFalsy();
      expect(response.statusCode).toBe(200);
      expect(body).toBe('[]');
    }, null, 1000000000);
  });

  describe('Create sample hero and list heroes.', () => {
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
      heroList.forEach((hero) => {
        // TODO: remove this atribute from the return
        delete hero._id;
        delete hero.__v;
      });

      expect(JSON.stringify(heroList)).toBe('[{"name":"Batman","alias":"Bruce Waine","protection_area":"Gothan City","super_powers":[]}]');
    }, null, 1000000000);
  });
});
