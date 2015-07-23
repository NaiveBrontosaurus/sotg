// If env variable RDS_HOSTNAME is set, we are on AWS and
// if we have MYSQL_DATABASE, we are on CircleCI and
// don't need to use db/config.js
// If process.env.NODE_TEST_ENV is set, we are in our tests
// and should use the test database.
var env = process.env.NODE_TEST_ENV || process.env.NODE_ENV;

var config = (process.env.RDS_HOSTNAME || process.env.MYSQL_DATABASE) ? {} : require('./config')[env];

var hostname = process.env.RDS_HOSTNAME || process.env.MYSQL_DATABASE_SERVER || config.db.hostname;
var username = process.env.RDS_USERNAME || process.env.MYSQL_DATABASE_USER || config.db.user;
var password = process.env.RDS_PASSWORD || process.env.MYSQL_DATABASE_PASSWORD || config.db.password;
var database = process.env.RDS_DB_NAME || process.env.MYSQL_DATABASE || config.db.database;
console.log(hostname);
var port = process.env.RDS_PORT || '3306';

var knex = require('knex')({
  client: 'mysql',
  //TODO find the proper address for the 
  // Here we first check to see if we are on AWS,
  // then we check to see if we are on Docker (MYSQL_DATABASE_...)
  // then we just use the file on our local machine
  connection: {
    host: hostname,
    user: username,
    password: password,
    database: database,
    port: port,
    charset: 'utf8mb4'
  }
});

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
var bookshelf = module.exports = require('bookshelf')(knex);
