angular.module('App.home', [])
  .controller('homeCtrl', function($scope, $http, $rootScope, $ionicHistory, $state) {
    if ($rootScope.loggedIn) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      $state.go('app.timeline');
    } else {
      $scope.viewSplash = true;
    }

  });
