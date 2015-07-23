var _ = require('underscore'),
  db = require('../db/schema.js'),
  User = require('../users/userModel.js'),
  Tweet = require('../../tweetHandler/tweets/tweetModel.js'), 
  ApiTransaction = require('../apiTransactions/apiTransactionModel.js'),
  uuid = require('uuid');

/**
 * A module of commonly used functions
 * @module config/utils
 */


/**
 * Check for api key
 *@function
 */
var checkforAPIKey = module.exports.checkforAPIKey = function(apiKey) {
  new User({
      apiKey: apiKey
    })
    .fetch()
    .then(function(user) {
      if (user) {
        return user;
      } else {
        return undefined;
      }
    });
};

var getApiKey = module.exports.getApiKey = function(username, cb) {
  new User({
    username: username
  })
  .fetch()
  .then(function(user) {
    if(user) {
      cb(user.get('apiKey'));
    } else {
      cb(undefined);
    }
  });
};

var searchDbForTweets = module.exports.searchDbForTweets = function(keyword, cb) {
  var tweets = [];
  new Tweet()
    .query('where', 'text', 'like', '%' + keyword + '%')
    .fetchAll()
    .then(function(collection) {
      collection = collection.slice(-1000);
      collection.forEach(function(tweet) {
        tweets.push(tweet);
      });
      cb(tweets);
    })
    .catch(function(err) {
      err = err || "Could not fetch tweets from db.";
      console.log(err);
      res.send(err);
    });
};

var getTweetsBySentiment = module.exports.getTweetsBySentiment = function(keyword, sentiment, cb) {
  var tweets = [], comparator = null;
  if(sentiment === 'positive') {
    comparator = '>';
  } else {
    comparator = '<';
  }
  new Tweet() 
    .query(function(qb) {
      qb.where('text', 'like', '%'+keyword+'%')
        .andWhere('sentiment', comparator, '0');
    })
    .fetchAll()
    .then(function(collection) {
      collection = collection.slice(-1000);
      collection.forEach(function(tweet) {
        tweets.push(tweet);
      });
      cb(tweets);
    });
};

var getTweetsByTimeRange = module.exports.getTweetsByTimeRange = function(keyword, timeStart, timeEnd, cb) {
  
  if(timeStart > timeEnd) {
    cb('Invalid time range: Starting time must come before ending time');
  }

  var tweets = [];
  new Tweet()
    .query(function(qb) {
      qb.where('text', 'like', '%'+keyword+'%')
        .andWhere('tweetCreatedAt', '>', timeStart.toString())
        .andWhere('tweetCreatedAt', '<', timeEnd.toString());
    })
    .fetchAll()
    .then(function(collection) {
      collection = collection.slice(-1000);
      collection.forEach(function(tweet) {
        tweets.push(tweet);
      });
      cb(null, tweets);
    });
};
/**
 * Inserts an ApiTransaction for the route and user
 *@function
 *@arg route {string} The api route
 *@arg user {User} The user making the api call
 */
var insertApiTransaction = module.exports.insertApiTransaction = function(method, route, user, now, done) {

    new ApiTransaction({
        userId: user.get('id'),
        route: route,
        method: method,
        created_at: now
      })
      .save()
      .then(function(apiTransaction) {

        //if there is a callback, call it 
        if (done) {
          done(apiTransaction);
        }
      });
};

/**
 * Validates an email address
 *@function
 *@arg email {string} The email to be considered
 */
var validateEmail = module.exports.validateEmail = function(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
};
