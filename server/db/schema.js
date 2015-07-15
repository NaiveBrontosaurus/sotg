/**
  * Schema for mySql
  *@module db/schema
  */
var db = require('../config/db.js');  
//drop all tables. 
if (false) {
  db.knex.schema.dropTableIfExists('User').then(function(table) {
    console.log('Dropped table', table);
  });
}

//create tables
db.knex.schema.hasTable('User').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('User', function(user) {
      user.increments('id').primary();
      user.timestamps();
      user.string('username');
      user.string('password');
      // user.string('salt'); bcrypt takes care of this for us
      user.string('apiKey');
    }).then(function(table) {
      console.log('Created table', table);
    });
  }
});

db.knex.schema.hasTable('Tweet').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('Tweet', function(tweet) {
      // tweet.integer('id');
      tweet.string('idStr');
      tweet.integer('userId');
      tweet.string('text');
      tweet.string('source');
      tweet.float('longitude');
      tweet.float('latitude');
      tweet.string('tweetCreatedAt');
      //hashtags as a foreign key
      tweet.text('entities');
    }).then(function(table) {
      console.log('Created table', table);
    });
  }
});

db.knex.schema.hasTable('Hashtag').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('Hashtag', function(hashtag) {
      hashtag.increments('id').primary();
      hashtag.string('tag');
    }).then(function(table) {
      console.log('Created table', table);
    });
  }
});

setTimeout(function() {
}, 1000);
module.exports = db;
/**
  * Remove all tables from the database 
  *@arg next {function} Function to run after truncation is complete
  */

