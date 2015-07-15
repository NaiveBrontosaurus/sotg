var express = require('express');

var app = express(), 
    PORT = 6000; //All 

require('./config/middleware.js')(app, express);
console.log('Server is listening on ' + PORT);
app.listen(PORT);