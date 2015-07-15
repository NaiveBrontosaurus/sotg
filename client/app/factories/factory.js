/**
 * factory to interact with backend server for authentication
 * @class
 */
angular.module('sotgFactory', [])
.factory('Auth', function($http, $location, $window){
  var authFactory = {};
  /**
 * method to sign up users
 * @function
 */
  authFactory.signup = function(user){
    return $http({
      method: 'POST',
      url: 'users/signup',
      data: user
    })
    .then(function(res){
      console.log(res);
    });
  };
  /**
   * method to log in users
   * @function
   */

  authFactory.login = function(user){
    return $http({
      method: 'POST',
      url: 'users/signin',
      data: user
    })
    .then(function(res){
      console.log(res);
    });    
  };
  return authFactory;
});
