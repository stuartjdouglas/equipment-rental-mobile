angular.module('App.image.upload', [])
  .controller('imageUploadCtrl', ['$scope', '$http', '$rootScope', '$cordovaImagePicker', '$base64', '$cordovaCamera',
    function ($scope, $http, $rootScope, $cordovaImagePicker, $base64, $cordovaCamera) {
    if ($rootScope.loggedIn) {
      $scope.viewSplash = false;

      var options = {
        maximumImagesCount: 10,
        width: 800,
        height: 800,
        quality: 80
      };

      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 900,
        targetHeight: 900,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };


      $scope.image;
      $scope.openImage = function () {
        $cordovaCamera.getPicture(options).then(function (imageData) {
          var image = document.getElementById('myImage');

          $scope.image = imageData;

        }, function (err) {
          // error
        });


      };


      $scope.uploadImage = function (image) {
        debugger;
      }

    } else {
      $scope.viewSplash = true;
    }

  }]);
