angular.module('profileCtrl', [])
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
