angular.module('App.my.items', [])
  .controller('myItemsCtrl', function($scope, $http, $rootScope) {

    if ($rootScope.loggedIn) {
      $http({
        url: backend + "/p/rent/current",
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': window.localStorage.token,
          'step':0,
          'count':5
        }
      }).success(function(data, status, headers, config) {
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
        }).success(function(data, status, headers, config) {

          $scope.qr = data;
        }).
          error(function(data, status, headers, config) {
            $scope.error = true;
          });
      })
    } else {
      console.log("you need to be loggged in");
    }

  });
