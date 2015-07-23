var db = require('../../server/db/schema');

var Tweet = db.Model.extend({
  tableName: 'tweets',
  defaults: {}
});

module.exports = Tweet;
