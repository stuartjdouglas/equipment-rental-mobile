angular.module('App.login', [])
  .controller('loginCtrl', function($scope, $http, $rootScope, $location, $ionicHistory, $state) {

    $scope.login = function(user) {
      if (user != null) {
        performLogin(user);
        //console.log(user.name + user.password);
      } else {

      }

    }

    function performLogin(user) {
      $scope.processing = true;
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
      }).success(function(data, status, headers, config) {

        window.localStorage.token = data.token;

        window.localStorage.auth =  JSON.stringify({
          'username' : data.username,
          'gravatar' : 'https://secure.gravatar.com/avatar/3ff9db8df915f96059263edd63a05453?s=90&d=identicon',
          'token': data.token
          });
        $scope.error = false;
        $rootScope.loggedIn = true;
        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $state.go('app.timeline');
      }).error(function(data, status, headers, config) {
          $scope.error = data.message;
        $scope.processing = false;
        });
    }



  });
