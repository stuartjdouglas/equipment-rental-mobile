angular.module('App.my.items', [])
  .controller('myItemsCtrl', function($scope, $http, $rootScope) {

    $scope.count = 15;


    $scope.start = 0;



    if ($rootScope.loggedIn) {
      updateResults();
    } else {
      $scope.view = false;
    }

    $scope.$watch("count", function(newValue) {
      // console.log(newValue);
      window.localStorage.setItem("product_count", newValue);
      updateResults();
    });

    $scope.back = function() {
      if ($scope.start - $scope.count < 0) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start - $scope.count;
        updateResults();
      }
    }

    $scope.forward = function() {
      if ($scope.start >= $scope.products.total - $scope.count) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start + $scope.count;
        updateResults();
      }
    }

    function updateResults() {
      $http({
        url: backend + "/p/rent/current",
        method: 'GET',
        headers: {
          'Start':$scope.start,
          'Count':$scope.count,
          'token': window.localStorage.token
        }
      }).success(function(data, status, headers, config) {
        $scope.products = data;
      }).
      error(function(data, status, headers, config) {
        $scope.error = true;
      });
    }

  });
