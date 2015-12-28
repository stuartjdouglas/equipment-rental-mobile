angular.module('App.register', [])
  .controller('registerCtrl', function($scope, $http, $rootScope, $location, $ionicHistory, $state) {
    //$scope.user = {
    //  name: 'stuart',
    //  email:'mudkipstewie@gmail.com',
    //  password:'lemon'
    //}

    $scope.user = {
      name: '',
      email:'',
      password:''
    }


    $scope.error = {
      username: {
        text:'Username cannot be empty',
        active:false
      },
      password:{
        text:'Password cannot be empty',
        active:false
      },
      email:{
        text:'Email cannot be empty',
        active:false
      },
      global:{
        text:'Something went wrong :(',
        active:false
      }
    }
    $scope.$watch(
      "user.email",
      function handleFooChange( newValue, oldValue ) {
        var hash = CryptoJS.MD5(newValue);
        $scope.gravatar = hash.toString();
      }
    );


    $scope.register = function(user) {
      var password = CryptoJS.SHA512(user.password).toString()
      console.log(user)
      if (user.name === "") {
        $scope.error.username.active = true;
      } else {
        $scope.error.username.active = false;
      }

      if (user.email === "") {
        $scope.error.email.active = true;
      } else {
        $scope.error.email.active = false;
      }

      if (user.password === "") {
        $scope.error.password.text = 'Password cannot be empty'
        $scope.error.password.active = true;
      } else if (user.password.length < 6) {
        $scope.error.password.text = 'Password must be more than 6 characters'
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
            'email':user.email
          },
          headers: {
            'Content-Type': 'multipart/form-data'

          }
        }).success(function(data, status, headers, config) {
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
          }).success(function(data, status, headers, config) {

            window.localStorage.token = data.token;


            var auth = JSON.stringify({
              username: data.username,
              gravatar: data.gravatar,
              token: data.token
            })

            window.localStorage.auth = auth;
            $rootScope.auth = JSON.parse(window.localStorage.auth);

            //window.localStorage.auth =  JSON.stringify({
            //  'username' : data.username,
            //  'gravatar' : 'https://secure.gravatar.com/avatar/'+ $scope.gravatar +'?s=90&d=identicon',
            //  'token': data.token
            //});

            $rootScope.loggedIn = true;
            $ionicHistory.nextViewOptions({
              disableBack: true
            });

            $state.go('app.timeline');
          }).error(function(data, status, headers, config) {
            $scope.error = data.message;
            $scope.processing = false;
          });
          $scope.error.global.active = false;
        }).
        error(function(data, status, headers, config) {
          $scope.error.global.text = data.message;
          $scope.error.global.active = true;
        });
      }



    }


  });
