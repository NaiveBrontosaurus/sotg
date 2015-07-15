var Tweet = require('../../../tweetHandler/tweets/tweetModel.js'),
  db = require('../../../server/db/schema.js'),
  queue = require('../../../tweetHandler/config/queue.js'),
  should = require('chai').should();

/**
 * Describes how the tweet handler should work
 * @class
 */

describe('Queue', function() {

  before(function(next) {
    db.truncateAllTables(function(){
      next();
    });

  });

  describe('Insertion Queue', function() {

    beforeEach(function(next) {
      var insertionQ = new queue();
      next();
    });

    it('should insert a tweet into the DB', function() {

    });

  });

});