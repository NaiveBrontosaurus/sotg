var apiController = require('./apiController.js');

module.exports = function(app) {
  app.get('/key', apiController.getKey);
  app.get('/search', apiController.getSearch);
  app.get('/location', apiController.getLocation);
  app.get('/sentiment', apiController.getSentiment);
  app.get('/time', apiController.getTime);
  app.get('/addKeyword', apiController.addKeyword);
  app.get('/getKeywords', apiController.getKeywords);
};
