angular.module('App.adminItemAdd', [])
  .controller('adminItemAddCtrl', function($scope, $http, $cordovaFile, $rootScope, $ionicHistory, $state,$cordovaImagePicker) {
    $scope.title = "New item";
    console.log("hello");
    $scope.product = {};

    $scope.loading = false;

    var options = {
      quality: 100
    };

    $scope.openImage = function() {
      var image;
      var url;
      $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
        url = results[0];
      }

      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
          var canvas = document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'), dataURL;
          canvas.height = this.height;
          canvas.width = this.width;
          ctx.drawImage(this, 0, 0);
          dataURL = canvas.toDataURL('jpg');
          $scope.product.image = dataURL;
          canvas = null;
      };
      img.src = url;
    }, function(error) {
      // error getting photos
    });
    }

    $scope.uploadProduct = function(product) {
      if ($scope.product.title != "" && $scope.product.description != "" && $scope.product.days != "" && $scope.product.image != "") {
        $scope.uploading = true;

        var fd = new FormData();
        fd.append('title', product.title);
        fd.append('description', product.description);
        fd.append('rental_period_limit', product.days);
        // fd.append('filetype', product.image.split(',')[0].split(':')[1].split(';')[0]);
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
          // $scope.success = true;
        }).
        error(function (data, status, headers, config) {

          // $scope.success = false;

        });
      }
    }
  });
