(function () {

  angular.module('App.factory.scanner', [])

    .factory('scanner', ['$cordovaBarcodeScanner', '$location', '$cordovaToast', '$cordovaVibration', function ($cordovaBarcodeScanner, $location, $cordovaToast, $cordovaVibration) {
      var scan = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
          var idenf = imageData.text.charAt(0);
          if (idenf === '@') {
            var username = imageData.text;
            username = username.replace('@', '');
            $cordovaVibration.vibrate(100);
            $location.path('app/user/' + username);
          } else if (idenf === '#') {
            var product = imageData.text;
            product = product.replace('#', '');
            $cordovaVibration.vibrate(100);
            $location.path('app/item/' + product)
          }
        }, function (error) {
          $cordovaVibration.vibrate(300);
          $cordovaToast.showShortBottom('Oops, something went wrong.').then(function (success) {
            // success
          }, function (error) {
            // error
          });
        });
      };
      return {
        scan: scan
      }
    }]);
}());
