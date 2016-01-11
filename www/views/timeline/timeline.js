angular.module('App.timeline', [])
  .controller('timelineCtrl', function($scope, $http, $rootScope, $state) {
    if ($rootScope.loggedIn) {
      $scope.viewSplash = false;
      $http({
        url: backend + "/hello",
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': window.localStorage.token
        }
      }).success(function(data, status, headers, config) {
        $scope.message = data.message;
      }).error(function(data, status, headers, config) {
      });
    } else {
      // console.log("we are not logged in")
      $scope.viewSplash = true;
      $state.go('app.home')
    }

  });
