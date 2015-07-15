var queue = module.exports = function(type) {
  this.storage = [];
  this.type = type;
};

queue.prototype.enQ = function(item) {
  this.storage.push(item);
  if (this.size() > 100) {
    this.process();
  }
};

queue.prototype.deQ = function() {
  return this.storage.shift();
};

queue.prototype.size = function() {
  return this.storage.length;
};

queue.prototype.tweetToDB = function() {
  var tweet = this.deQ();
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
    parsedTweet.latitute = tweet.coordinates.coordinates[1];
  }

  //TODO: add sentiment analysis stuff and things

  new Tweet(parsedTweet)
    .save()
    .then(function(tweet) {
      if (tweet) {
        return tweet;
      } else {
        return next(new Error('Could not save tweet to the Database!'));
      }
    });
};

queue.prototype.deleteFromDB = function() {
  var deleteMessage = this.deQ();

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
};