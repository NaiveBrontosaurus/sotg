var SECRET = 'SECRET';
var db = require('../db/schema'),
  bcrypt = require('bcrypt-nodejs'),
  Promise = require('bluebird'),
  jwt = require('jwt-simple'),
  uuid = require('uuid');

/**
 * Creates a new User
 * @class
 */

var User = db.Model.extend({
  tableName: 'User',
  hasTimestamps: true,
  defaults: {},

  /** 
   * Initializes the user with salt and apikey 
   *@function
   */
  initialize: function() {
    this.on('creating', this.hashPassword);
    this.on('creating', this.generateApiKey);
  },

  /**
   * Generates an API Key
   *@function
   */

  generateApiKey: function() {
    this.set("apiKey", uuid.v4());
  },

  /**
   * Hashes and Salts the password
   *@function
   */
  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    // return a promise - bookshelf will wait for the promise
    // to resolve before completing the create action
    return cipher(this.get('password'), null, null)
      .bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  },

  addUser: function(user, callback) {
    new User({username: user.username})
    .fetch()
    .then(function(foundUser) {
      if (foundUser) {
        callback(new Error('User already exist!'));
      } else {
        // make a new user if not one
        new User(user)
        .save()
        .then(function(newUser) {
          // create token to send back for auth
          var token = jwt.encode(user, SECRET);
          callback(null, token);
        });
      }
    });
  },

  authenticate: function(user, callback) {
    new User({username: user.username})
    .fetch()
    .then(function(foundUser) {
      if (!foundUser) {
        callback(new Error('User does not exist'));
      } else {
        bcrypt.compare(user.password, foundUser.get('password'), function(err, isMatch) {
          if (err) {
            console.log("Error comparing passwords.");
            callback(new Error('Error comparing passwords.'));
          } else {
            if (isMatch) {
              console.log("Passwords match, sending back token");
              var token = jwt.encode(foundUser, SECRET);
              callback(null, {token: token});
            } else {
              callback(new Error('Passwords don\'t match.'));
            }
          }
        });
      }
    });
  },
  /** 
   * Compares a password with the password stored in the database
   *@function
   *@arg candidatePassword {string} The password to compare against what is stored 
   *in the datebase
   */

  comparePassword: function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  }
});

module.exports = User;
