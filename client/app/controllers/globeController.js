angular.module('globeCtrl', [])
.controller('globeController', function($state, $rootScope) {
  var vm = this;
 $rootScope.$on('$stateChangeSuccess', function(){
    if(!$state.is('demos.globe')){
      cancelAnimationFrame( animateId );
      controls.enabled = false;
    }
 });
});
