angular.module('App.ownerItems', [])

.controller('ownerItemsCtrl', function($scope, $http, $rootScope) {
  console.log("hello")
  $scope.count = 15;


  $scope.start = 0;



  if ($rootScope.loggedIn) {
    // updateResults();
  } else {
    $scope.view = false;
  }

  $scope.doRefresh = function() {
    updateListing();
  }

  $scope.$watch("count", function(newValue) {
    // console.log(newValue);
    window.localStorage.setItem("product_count", newValue);
    updateListing();
  });

  $scope.back = function() {
    if ($scope.start - $scope.count < 0) {
      $scope.viewResults = false;
    } else {
      $scope.viewResults = true;
      $scope.start = $scope.start - $scope.count;
      updateListing();
    }
  }

  $scope.forward = function() {
    if ($scope.start >= $scope.products.total - $scope.count) {
      $scope.viewResults = false;
    } else {
      $scope.viewResults = true;
      $scope.start = $scope.start + $scope.count;
      updateListing();
    }
  }

  function updateListing() {
    $http({
      url: backend + "/owner/products",
      method: 'GET',
      headers: {
        'step': $scope.start,
        'count': $scope.count,
        'token': window.localStorage.token
      }
    }).success(function(data, status, headers, config) {
      console.log(data);
      $scope.products = data;
    }).
    error(function(data, status, headers, config) {
      console.log(data)
      $scope.error = true;
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

});
