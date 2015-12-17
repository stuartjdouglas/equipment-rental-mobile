angular.module('App.items', [])
  .controller('itemsCtrl', function($scope, $http, $rootScope) {

   $scope.count = 15;


    $scope.start = 0;



    if ($rootScope.loggedIn) {
      updateResults();
    } else {
      $scope.view = false;
    }

    $scope.$watch("count", function(newValue) {
      console.log(newValue);
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
        url: backend + "/p",
        method: 'GET',
        headers: {
          'Start':$scope.start,
          'Count':$scope.count
        }
      }).success(function(data, status, headers, config) {
        console.log(data);
        $scope.products = data;
      }).
      error(function(data, status, headers, config) {
        $scope.error = true;
      });
    }

  })
  .controller('itemCtrl', function($scope, $http, $rootScope, $stateParams) {
    $http({
      url: backend + "/product/" + $stateParams.item,
      method: 'GET',
      headers: {
        'Start':$scope.start,
        'Count':$scope.count
      }
    }).success(function(data, status, headers, config) {
      console.log(data.item[0]);
      $scope.product = data.item[0];
    }).
    error(function(data, status, headers, config) {
      $scope.error = true;
    });
  });
