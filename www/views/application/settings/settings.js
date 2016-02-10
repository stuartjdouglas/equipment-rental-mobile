angular.module('App.settings', [])
  .controller('settingsCtrl', function($scope, $http, $rootScope, $cordovaStatusbar) {
    $scope.settings = {};

    if (window.localStorage.settings != undefined) {
      $scope.settings = JSON.parse(window.localStorage.settings);
    } else {
      var defaultSettings = {
        "notification": {
          "mute": false,
          "enable": true
        }
      };

      window.localStorage.settings = JSON.stringify(defaultSettings);

      $scope.settings = defaultSettings;
    }

    $scope.$watch('settings', function(newval, oldval) {
      window.localStorage.settings = JSON.stringify(newval);
      $rootScope.setings = newval;
    }, true)




    $scope.themeColour = window.localStorage.themeColour;
    $scope.updateColour = function(color) {

      window.localStorage.themeColour = color;
      window.location.reload(true)






    }
});
