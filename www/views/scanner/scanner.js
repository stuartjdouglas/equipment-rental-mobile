angular.module('App.scanner', [])
  .controller('scannerCtrl', function($scope, $http, $rootScope, $cordovaBarcodeScanner, $location) {
    if ($rootScope.loggedIn) {


    }


    $scope.scan = function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {

        $scope.result = imageData;

        if (imageData.text.charAt(0) === '@') {
          var username = imageData.text;
          username = username.replace('@', '');
          $location.path('app/user/' + username);
        }


        console.log(imageData);
      }, function(error) {
        console.log("An error happened -> " + error);
      });
    }

  });
