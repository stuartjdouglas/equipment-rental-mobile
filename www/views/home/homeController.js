angular.module('App.home', [])
  .controller('homeCtrl', function ($scope, $http, $rootScope, $ionicHistory, $state) {
    if ($rootScope.loggedIn) {
      $state.go('app.timeline');
    } else {
      $scope.viewSplash = true;
    }

  });
