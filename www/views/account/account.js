angular.module('App.account.settings', [])
  .controller('accountSettingsCtrl', function ($scope, $http, $rootScope, $ionicLoading) {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    loadProfile();


    function loadProfile() {
      $http({
        url: backend + "/profile",
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        $scope.profile = data.profile;
        $scope.view = true;
        console.log(data.profile);
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      }).then(function () {
        $ionicLoading.hide();
      });
    }


    $scope.hide = function () {

    };

  });
