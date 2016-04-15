angular.module('App.tag', [])
  .controller('tagCtrl', function ($scope, $http, $rootScope, $stateParams) {
    $scope.domain = domain;
    $scope.count = 15;
    $scope.start = 0;


    if (!$rootScope.loggedIn) {
      $scope.view = false;
    }

    $scope.doRefresh = function () {
      updateResults();
    };

    $scope.$watch("count", function (newValue) {
      window.localStorage.setItem("product_count", newValue);
      updateResults();
    });

    $scope.back = function () {
      if ($scope.start - $scope.count < 0) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start - $scope.count;
        updateResults();
      }
    };

    $scope.forward = function () {
      if ($scope.start >= $scope.products.total - $scope.count) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start + $scope.count;
        updateResults();
      }
    };

    $scope.search = function (term) {
      // console.log('>' + term)
    };

    function updateResults() {
      var url = backend + "/tags/";
      $http({
        url: url + $stateParams.tag,
        method: 'GET',
        headers: {
          'Start': $scope.start,
          'Count': $scope.count
        }
      }).success(function (data, status, headers, config) {
        $scope.products = data;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
