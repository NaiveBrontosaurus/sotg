var express = require('express');

var app = express();
var PORT = process.env.PORT || 8000;  //default port

require('./config/middleware.js')(app, express);
require('./utils/startupTasks.js');

console.log("API Server listening on port ", PORT);
var server = app.listen(PORT);

module.exports = server;
