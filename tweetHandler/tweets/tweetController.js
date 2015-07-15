var Tweet = require('./tweetModel.js'),
  db = require('../../server/db/schema.js');


  /**
   * A module that handles all tweet endpoints
   * @module tweets/tweetController
   */

module.exports = {
  handleInsert: function(req, res, next) {
    var tweet = req.body;
    
    var parsedTweet = {
      idStr: tweet.id_str,
      userId: tweet.user.id,
      entities: JSON.stringify(tweet.entities),
      tweetCreatedAt: tweet.created_at, //TODO : This needs to be formatted correctly as a date
      text: tweet.text,
      source: tweet.source
    };

    if (!!tweet.coordinates) {
      parsedTweet.longitude = tweet.coordinates.coordinates[0];
      parsedTweet.latitude = tweet.coordinates.coordinates[1];
    }

    //TODO: add sentiment analysis stuff

    new Tweet(parsedTweet)
      .save()
      .then(function(tweet) {
        if (tweet) {
          return tweet;
        } else {
          return next(new Error('Could not save tweet to the Database!'));
        }
      });
  },

  handleDelete: function(req, res, next) {
    var deleteMessage = req.body;
    
    new Tweet({
        idStr: deleteMessage.status.id_str
      })
      .fetch()
      .then(function(tweet) {
        if (tweet) {
          tweet.destroy();
        } else {
          this.enQ(deleteMessage);
        }
      });
  },

  handleScrubGeo: function(req, res, next) {
    var scrubGeoMessage = req.body;

    new Tweet({
      userId: scrubGeoMessage.scrub_geo.user_id 
    })
    .fetchAll(function(tweets) {
      tweets.forEach(function(tweet) {
        tweet.latitude = null;
        tweet.longitude = null;
      });
      tweets.save().then(function() {
        console.log('tweets geo data updated to NULL');
      });
    });
  }
};