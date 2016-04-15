angular.module('App.user.profile', [])
  .controller('userProfileCtrl', function ($scope, $http, $rootScope) {
    if ($rootScope.loggedIn) {
      $http({
        url: backend + "/profile",
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        $scope.profile = data.profile;
        $scope.view = true;
        $http({
          url: backend + "/identify/qr/user",
          method: 'GET',
          headers: {
            'token': window.localStorage.token,
            'width': 300,
            'height': 300,
            'code': data.profile.username
          }
        }).success(function (data, status, headers, config) {
          $scope.qr = data;
        }).error(function (data, status, headers, config) {
          $scope.error = true;
        });
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });
    }

  });
