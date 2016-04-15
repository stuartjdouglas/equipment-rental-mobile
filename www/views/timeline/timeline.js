angular.module('App.timeline', [])
  .controller('timelineCtrl', function($scope, $http, $rootScope, $state) {
    if ($rootScope.loggedIn) {
      $scope.viewSplash = false;
    } else {
      $scope.viewSplash = true;
      $state.go('app.home')
    }

  });
