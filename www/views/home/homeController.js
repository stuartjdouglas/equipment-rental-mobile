angular.module('App.home', [])
  .controller('homeCtrl', function($scope, $http, $rootScope, $ionicHistory, $state) {
    if ($rootScope.loggedIn) {
      //$ionicHistory.nextViewOptions({
      //  disableBack: true
      //});


      $state.go('app.timeline');
    } else {
      console.warn("not logged in" +
        "")
      $scope.viewSplash = true;
    }

  });
