angular.module('App.timeline', [])
  .controller('timelineCtrl', function($scope, $http, $rootScope) {
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
      $scope.viewSplash = true;
    }

  });
