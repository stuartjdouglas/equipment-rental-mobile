angular.module('App.register', [])
  .controller('registerCtrl', function ($scope, $http, $rootScope, $location, $ionicHistory, $state) {
    $scope.user = {
      name: '',
      email: '',
      password: ''
    };

    $scope.error = {
      username: {
        text: 'Username cannot be empty',
        active: false
      },
      password: {
        text: 'Password cannot be empty',
        active: false
      },
      email: {
        text: 'Email cannot be empty',
        active: false
      },
      global: {
        text: 'Something went wrong :(',
        active: false
      }
    };

    $scope.$watch(
      "user.email",
      function handleChange(value) {
        var hash = CryptoJS.MD5(value);
        $scope.gravatar = hash.toString();
      }
    );


    $scope.register = function (user) {
      var password = CryptoJS.SHA512(user.password).toString();
      $scope.error.username.active = user.name === "";

      $scope.error.email.active = user.email === "";

      if (user.password === "") {
        $scope.error.password.text = 'Password cannot be empty';
        $scope.error.password.active = true;
      } else if (user.password.length < 6) {
        $scope.error.password.text = 'Password must be more than 6 characters';
        $scope.error.password.active = true;
      } else {
        $scope.error.password.active = false;
      }

      if (user.name != "" && user.password != "" && user.email != "" && user.password.length > 6) {
        $http({
          url: backend + "/user/register",
          method: 'POST',
          data: {
            'username': user.name,
            'password': password,
            'email': user.email
          },
          headers: {
            'Content-Type': 'multipart/form-data'

          }
        }).success(function (data, status, headers, config) {
          $http({
            url: backend + "/login",
            method: 'POST',
            data: {
              'username': user.name,
              'password': password
            },
            headers: {
              'Content-Type': 'multipart/form-data'

            }
          }).success(function (data, status, headers, config) {

            window.localStorage.token = data.token;


            //noinspection UnnecessaryLocalVariableJS
            var auth = JSON.stringify({
              username: data.username,
              gravatar: data.gravatar,
              token: data.token
            });

            window.localStorage.auth = auth;
            $rootScope.auth = JSON.parse(window.localStorage.auth);

            $rootScope.loggedIn = true;
            $ionicHistory.nextViewOptions({
              disableBack: true
            });

            $state.go('app.timeline');
          }).error(function (data, status, headers, config) {
            $scope.error = data.message;
            $scope.processing = false;
          });
          $scope.error.global.active = false;
        }).error(function (data, status, headers, config) {
          $scope.error.global.text = data.message;
          $scope.error.global.active = true;
        });
      }


    }


  });
