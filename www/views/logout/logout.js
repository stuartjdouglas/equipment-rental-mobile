angular.module('App.logout', [])
  .controller('logoutCtrl', function($scope, $http, $rootScope, $location, $ionicHistory, $state) {

    window.localStorage.removeItem("token");
    $rootScope.loggedIn = false;
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $state.go('app.home');

  });
