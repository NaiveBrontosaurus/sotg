var app = require('./server/server.js');

var PORT = process.env.PORT || 8000;
console.log('Server is listening on ' + PORT);
app.listen(PORT);