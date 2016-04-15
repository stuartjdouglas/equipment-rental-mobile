angular.module('App.user.users', [])
  .controller('userUsersCtrl', function ($scope, $http, $rootScope) {
    if ($rootScope.loggedIn) {
      $http({
        url: backend + "/users",
        method: 'GET'
      }).success(function (data, status, headers, config) {
        $scope.users = data;
      }).error(function (data, status, headers, config) {

      });
    }

  });
