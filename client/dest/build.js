/**
 * factory to interact with backend server for authentication
 * @class
 */
angular.module('sotgFactory', [])
.factory('Auth', function($http, $location, $window, $state){
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
    .success(function(data, status, headers, config){
      console.log(status);
    })
    .error(function(data, status, headers, config){
      console.log(status);
      console.log(data);
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
    .success(function(data, status, headers, config) {
      console.log(status);
    })
    .error(function(data, status, headers, config) {
      console.log(status);
      console.log(data);
    });
  };

  authFactory.profile = function(){
    return $http({
      method: 'GET', 
      url: 'users/profile'
    })
    .success(function(data, status, headers, config) {
      authFactory.keywords(data);
    })
    .error(function(data, status, headers, config) {
    });
  };

  authFactory.keywords = function(user){
    // var apiKey = user.apiKey;
    return $http({
      method: 'GET', 
      url: 'users/keywords?apiKey=' + user.apiKey
    })
    .success(function(data, status, headers, config) {
    })
    .error(function(data, status, headers, config) {
    });
  };

  authFactory.logout = function() {
    return $http({
      method: 'GET',
      url: 'users/logout'
    })
    .finally(function() {
      $state.go('home');
    });
  };

  authFactory.updatePassword = function(username, password) {
    return $http({
      method: 'POST',
      url: 'users/password/update',
      data: JSON.stringify({
        user: username,
        password: password
      })
    })
    .success(function() {
      // console.log("Updated password.");
    })
    .error(function(err) {
      // console.log("Couldn't update password. Error: ", err);
    });
  };

  authFactory.requestReset = function(username) {
    return $http({
      method: 'POST',
      url: 'users/password/requestReset?username=' + username
    })
    .success(function() {
      // console.log("Posted to /users/password/requestReset?username=" + username);
    })
    .error(function(err) {
      // console.log("Errored while posting to /users/password/requestReset?username=" + username);
    });
  };

  authFactory.sendPasswordResetEmail = function (username) {
    return $http({
      method: 'POST',
      url: 'users/password/forgot',
      data: {
        username: username
      }
    })
    .success(function() {
      // console.log("Resetting password for ", username);
    })
    .error(function(err) {
      // console.log("Error resetting password for ", username);
    });
  };

  authFactory.resetPassword = function(user) {
    return $http({
      method: 'POST',
      url: 'users/password/reset?user=' + user,
    })
    .success(function() {
      // console.log("Resetting password for ", token);
    })
    .error(function(err) {
      // console.log("Error resetting password for ", token);
    });
  };

  return authFactory;
});
;/**
 * factory to interact with backend server for authentication
 * @class
 */
angular.module('queryFactory', [])
.factory('QueryBuilder', function($http, $location, $window){
  var queryBuilder = {};

  queryBuilder.makeQuery = function(queryURL, httpMethod, callback) {
    return $http({
      method: httpMethod, 
      url: queryURL
    })
    .success(function(data) {
      callback(data);
    })
    .error(function(data){
      callback(data);
    });
  };

  return queryBuilder;
});
;angular.module('demosCtrl', [])
.controller('demosController', function($state) {
  var vm = this;
  vm.$state = $state;
});
;angular.module('globeCtrl', [])
.controller('globeController', function($state, $rootScope) {
  var vm = this;
 $rootScope.$on('$stateChangeSuccess', function(){
    if(!$state.is('demos.globe')){
      cancelAnimationFrame( animateId );
      controls.enabled = false;
    }
 });
});
;angular.module('loginCtrl', [])
.controller('loginController', function(Auth, $location, $window) {
  var vm = this;
  vm.user = {};
  vm.loading = false;
  vm.logInUser = function(){
    Auth.login(vm.user)
    .then(function(){
      $location.path('/profile');
    })
    .catch(function(err){
      vm.error = err.data.error;
    });
  };
  vm.requestReset = function() {
    if (!vm.user.username) {
      vm.forgotPasswordResponse = {error: "Please enter your email address to recover your password."};
      return;
    }
    vm.loading = true;
    Auth.requestReset(vm.user.username)
    .then(function(res) {
      vm.loading = false;
      // console.log("loginController.requestReset -> ", res);
      vm.forgotPasswordResponse = res.data;
    })
    .catch(function(res) {
      vm.loading = false;
      // console.log("loginController.requestRest catch -> ", res);
      vm.forgotPasswordResponse = res.data;
    });
  };
});
;angular.module('logoutCtrl', [])
.controller('logoutController', function(Auth, $location, $window) {
  Auth.logout();
});
;angular.module('profileCtrl', [])
.controller('profileController', function(Auth, QueryBuilder, $location, $window) {
  var vm = this;
  vm.updatePassword = function() {
    Auth.updatePassword(vm.username, vm.user.newPassword)
    .then(function(res) {
    });
  };

  vm.resetPassword = function() {
    Auth.resetPassword(vm.username)
    .then(function(res) {
    });
  };

  vm.sendPasswordResetEmail = function() {
    Auth.sendPasswordResetEmail(vm.username)
    .then(function(res) {
    });
  };

  Auth.profile()
  .then(function(res){
      vm.username = res.data.username; 
      vm.apiKey = res.data.apiKey;
      Auth.keywords(vm)
      .then(function(res) {
        vm.keywords = res.data;
      });
    })
    .catch(function(err){
      vm.error = 'You must be logged in to see this page';
    });

    vm.deleteKeyword = function(keyword){
      var queryURL = 'api/keywords?keyword=' + encodeURIComponent(keyword.keyword) + '&apiKey=' + vm.apiKey;
      QueryBuilder.makeQuery(queryURL, 'DELETE', function(){})
      .then(function(){
        Auth.keywords(vm)
        .then(function(res) {
          if(typeof res.data === 'string') {  //if there are no keywords in the db
            vm.keywords = [];
          } else {
            vm.keywords = res.data;
          }
        });
      });
    };

    vm.addKeyword = function() {
      if(vm.addKeywordInput !== '' && vm.addKeywordInput !== undefined) {
        
        var queryURL = 'api/keywords?keyword=' + encodeURIComponent(vm.addKeywordInput) + '&apiKey=' + vm.apiKey;
        QueryBuilder.makeQuery(queryURL, 'POST', function(){})
        .then(function(){
          Auth.keywords(vm)
          .then(function(res) {
            vm.keywords = res.data;
            vm.addKeywordInput = '';

            angular.element('.addKeyword').trigger('focus');
          });
        });
      }
    };

    vm.enterFromAddInput = function(keyEvent) {
      if (keyEvent.which === 13) { //enter key
        vm.addKeyword();
      }
    };

});
;angular.module('queryBuilderCtrl', [])
.controller('queryBuilderController', function(Auth, QueryBuilder, $location, $window, $state, $scope) {
  var vm = this;
  $scope.$state = $state;

  Auth.profile()
  .then(function(res){
      $scope.isAuth = true;
      $scope.apiKey = res.data.apiKey;
    })
    .catch(function(err){
      $scope.isAuth = false;
      $scope.apiKey = 'Your_API_Key';
    });
  $scope.loading = false;
  $scope.encodedKeyword = 'Pizza';
  $scope.keyword = 'Pizza';
  $scope.sentiment = 'positive';
  $scope.httpVerb = 'GET';
  $scope.startTime = new Date();
  $scope.endTime = new Date();
  $scope.startTimeMS = $scope.startTime.getTime();
  $scope.endTimeMS = $scope.endTime.getTime();

  $scope.encodeKeyword = function() {
    $scope.encodedKeyword = encodeURIComponent($scope.keyword); 
  };

  $scope.startTimeConvert = function() {
    $scope.startTimeMS = $scope.startTime.getTime();
  }; 

  $scope.endTimeConvert = function() {
    $scope.endTimeMS = $scope.endTime.getTime();
  };

  $scope.getQuery = function() {
    if($state.is('queryBuilder.search')) {
      return 'http://sotg.xyz/api/search?keyword=' + $scope.encodedKeyword + '&apiKey=' + $scope.apiKey;
    } else if($state.is('queryBuilder.keyword')) {
      return 'http://sotg.xyz/api/keywords?keyword=' + $scope.encodedKeyword + '&apiKey=' + $scope.apiKey;
    } else if($state.is('queryBuilder.sentiment')) {
      return 'http://sotg.xyz/api/sentiment?keyword=' + $scope.encodedKeyword + '&sentiment=' + $scope.sentiment + '&apiKey=' + $scope.apiKey;
    } else if($state.is('queryBuilder.time')) {
      return 'http://sotg.xyz/api/time?keyword=' + $scope.encodedKeyword + '&startTime=' + $scope.startTimeMS + '&endTime=' + $scope.endTimeMS + '&apiKey=' + $scope.apiKey;
    }
  };

  $scope.submitQuery = function() {
    var queryURL = $scope.getQuery().slice(16);
    $scope.loading = true;
    QueryBuilder.makeQuery(queryURL, $scope.httpVerb, function(data) {
      data = data.slice(0, 50);
      $scope.jsonResult = JSON.stringify(data, null, ' ');
      $scope.loading = false;
    });
  };
});
;angular.module('resetPasswordCtrl', [])
.controller('resetPasswordController', function( Auth, $location) {
  var vm = this;
  vm.user = $location.search().user;
  vm.resetPassword = function() {
    Auth.updatePassword(vm.user, vm.newPassword)
    .then(function(res) {
      // console.log("Reset password with token: " + vm.user);
    });
  };
});
;angular.module('signupCtrl', [])
.controller('signupController', function(Auth, $location, $window, $scope) {
  var vm = this;
  vm.user = {};
  vm.signUpUser = function(){
    $scope.matchPassword(function() {
      Auth.signup(vm.user)
      .then(function(){
        $location.path('/profile');
      })
      .catch(function(err){
        vm.error = err.data.error;
      });
    });
  };
  $scope.matchPassword = function(pass) {
    if(vm.user.password !== vm.user.confirmPassword) {
      if(vm.user.confirmPassword) {
        vm.error = "Your passwords do not match.";
      } else {
        vm.error = "You must confirm your password in order to sign up.";
      }
    } else if (pass) {  //run pass if pass exists
      pass();
    } else if(vm.user.password === vm.user.confirmPassword) {
      vm.error = '';
    }
  };
});
;var essoteegeeApp = angular.module('essoteegeeApp', ['ui.router', 'sotgFactory', 'queryFactory',
'loginCtrl', 'signupCtrl', 'profileCtrl', 'demosCtrl', 'resetPasswordCtrl', 'logoutCtrl', 'queryBuilderCtrl','globeCtrl', 'ui.date', 'ngClipboard', 'hljs']);
essoteegeeApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider, ngClipProvider, hljsServiceProvider){

  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('home',{
      url: '/',
      templateUrl: 'app/views/home.html'
    })
    .state('signup',{
      url: '/signup',
      templateUrl: 'app/views/signup.html'
    })
    .state('login',{
      url: '/login',
      templateUrl: 'app/views/login.html'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'app/views/profile.html'
    })
    .state('logout', {
      controller: 'logoutController'
    })
    .state('documentation', {
      url: '/documentation',
      templateUrl: 'app/views/documentation.html'
    })
    .state('demos', {
      url: '/demos',
      templateUrl: 'app/views/demos.html'
    })
    .state('demos.globe', {
      url: '/globe',
      templateUrl: 'app/views/partials/globe.html'
    })
    .state('demos.wordcloud', {
      url: '/wordcloud',
      templateUrl: 'app/views/partials/wordcloud.html'
    })
    .state('queryBuilder', {
      url: '/queryBuilder', 
      templateUrl: 'app/views/queryBuilder.html', 
      controller: 'queryBuilderController',
      name: 'queryBuilder'
    })
    .state('queryBuilder.search', {
      url: '/search'
    })
    .state('queryBuilder.keyword', {
      url: '/keyword'
    })
    .state('queryBuilder.sentiment', {
      url: '/sentiment'
    })
    .state('queryBuilder.time', {
      url: '/time'
    })
    .state('resetPassword', {
      url: '/resetPassword',
      templateUrl: 'app/views/resetPassword.html'
    });

    //set path to .swf file for copying to clipboard
    ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");

    hljsServiceProvider.setOptions({
        // replace tab with 4 spaces
        tabReplace: '    '
      });

});
