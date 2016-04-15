angular.module('App.currentRentalCtrl', [])
  .controller('currentRentalCtrl', function ($scope, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, $ionicPlatform, $http, $cordovaLocalNotification, $rootScope) {
    //console.log("current rental");
    $scope.count = 15;
    $scope.start = 0;
    $scope.imagedataurl = $rootScope.data;
    function getRentals() {
      $http({
        url: backend + "/p/rent/current",
        method: 'GET',
        headers: {
          'Start': $scope.start,
          'Count': $scope.count,
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        $scope.products = data;
        if (data.total === 0) {
          $scope.noResults = true;
        }
      }).error(function (data, status, headers, config) {
        $scope.error = true;
        console.log(data)
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });

    }

    getRentals();

  });
