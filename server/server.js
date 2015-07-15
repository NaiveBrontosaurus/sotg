var express = require('express');

var app = express(),
  server, 
  PORT = process.env.PORT || 8000;  //default port

require('./config/middleware.js')(app, express);

module.exports = function(port) {
  var server = app.listen(port || PORT); 
  return server;
};

module.exports();
