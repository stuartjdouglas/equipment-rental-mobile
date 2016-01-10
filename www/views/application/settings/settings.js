angular.module('App.settings', [])
  .controller('settingsCtrl', function($scope, $http, $rootScope, $cordovaStatusbar) {
    $scope.themeColour = window.localStorage.themeColour;
    $scope.updateColour = function(color) {

      window.localStorage.themeColour = color;
      window.location.reload(true)
    }
});
