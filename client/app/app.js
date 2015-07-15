var essoteegeeApp = angular.module('essoteegeeApp', ['ui.router', 'sotgFactory',
'loginCtrl', 'signupCtrl']);
essoteegeeApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('/',{
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
    });

});
