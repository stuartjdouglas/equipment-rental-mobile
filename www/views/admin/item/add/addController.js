angular.module('App.adminItemAdd', [])
  .controller('adminItemAddCtrl', function($scope, $http, $rootScope, $ionicHistory, $state, $cordovaCamera) {
    $scope.title = "New item";
    console.log("hello");

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

    $scope.openImage = function() {
      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('myImage');

        $scope.image = imageData;
        //$scope.images = "data:image/jpeg;base64," + imageData;



      }, function(err) {
        // error
      });
    }
  });
