var userController = require('./userController.js');

/**
 * A module that routes user activities
 * @module users/userRoutes
 */

module.exports = function(app) {
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.get('/signedin', userController.checkAuth);
};
