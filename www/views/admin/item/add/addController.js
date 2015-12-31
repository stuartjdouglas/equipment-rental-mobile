angular.module('App.adminItemAdd', [])
  .controller('adminItemAddCtrl', function($scope, $http, $cordovaFile, $rootScope, $ionicHistory, $state, $cordovaCamera) {
    $scope.title = "New item";
    console.log("hello");
    $scope.product = {};

    $scope.loading = true;

    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $scope.openImage = function() {
      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('myImage');

        $scope.product.image = imageData;

        //$scope.images = "data:image/jpeg;base64," + imageData;


        debugger;
      }, function(err) {
        // error
      });
    }

    $scope.uploadProduct = function(product) {
      if ($scope.product.title != "" && $scope.product.description != "" && $scope.product.days != "" && $scope.product.image != "") {
        $scope.uploading = true;

        var fd = new FormData();
        fd.append('title', product.title);
        fd.append('description', product.description);
        fd.append('rental_period_limit', product.days);
        fd.append('image', product.image);
        $http({
          url: backend + "/p",
          method: 'POST',
          dataType: 'multipart/form-data',
          data: fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined,
            'token': window.localStorage.token,
          }
        }).success(function (data, status, headers, config) {
          $scope.success = true;
          $cordovaLocalNotification.schedule({
            id: 1,
            title: 'Title here',
            text: 'Text here',
            data: {
              customProperty: 'custom value'
            }
          }).then(function (result) {
            // ...
          });
        }).
        error(function (data, status, headers, config) {

          $scope.success = false;

        });
      }
    }
  });
