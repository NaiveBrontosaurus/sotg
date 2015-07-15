var User = require('../../server/users/userModel.js'),
  db = require('../../server/db/schema.js'),
  request = require('request'),
  Q = require('q'),
  should = require('chai').should(),
  PORT = 8001; //this port is used to test

/**
 * Describes how a user account is created
 * @class
 */

describe('Server Start', function() {
  var app = require('../../server/server.js')(PORT);
  before(function(done) {
    setTimeout(function() {
      done();
    }, 1000);
  });
  it('should run', function(done) {
    should.exist(app);
    done();
  });
});
