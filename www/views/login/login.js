angular.module('App.login', [])
  .controller('loginCtrl', function ($scope, $http, $rootScope, $location, $ionicHistory, $state) {
    $scope.processing = false;
    $scope.login = function (user) {
      if (user != null) {
        performLogin(user);
      }
    };

    function performLogin(user) {
      $scope.processing = true;
      $scope.error = false;
      var hash = CryptoJS.SHA512(user.password).toString();

      $http({
        url: backend + "/login",
        method: 'POST',
        data: {
          'username': user.name,
          'password': hash
        },
        headers: {
          'Content-Type': 'multipart/form-data'

        }
      }).success(function (data, status, headers, config) {

        window.localStorage.token = data.token;

        $scope.user = {};

        var auth = JSON.stringify({
          username: data.username,
          gravatar: data.gravatar,
          token: data.token
        });

        window.localStorage.auth = auth;
        $rootScope.auth = JSON.parse(window.localStorage.auth);
        $scope.error = false;
        $scope.processing = false;
        $rootScope.loggedIn = true;

        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $state.go('app.timeline');
      }).error(function (data, status, headers, config) {
        $scope.error = data.message;
        $scope.processing = false;
      });
    }
  });
