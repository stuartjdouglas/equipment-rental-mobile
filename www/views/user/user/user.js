angular.module('App.user.user', [])
  .controller('userUserCtrl', function($scope, $http, $rootScope,  $stateParams) {
    if ($rootScope.loggedIn) {
      $http({
        url: backend + "/user/" +  $stateParams.user,
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': window.localStorage.token
        }
      }).success(function(data, status, headers, config) {
        $scope.profile = data;
        $scope.view = true;
        $http({
          url: backend + "/identify/qr/user",
          method: 'GET',
          headers: {
            'token': window.localStorage.token,
            'width': 300,
            'height': 300,
            'code': data.username
          }
        }).success(function(data, status, headers, config) {

          $scope.qr = data;
        }).
          error(function(data, status, headers, config) {
            $scope.error = true;
          });
      }).
        error(function(data, status, headers, config) {
          $scope.error = true;
        });
    }

  });
