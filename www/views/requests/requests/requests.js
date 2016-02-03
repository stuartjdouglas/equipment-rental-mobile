angular.module('App.requests', [])
  .controller('requestsCtrl', function ($scope, $http, $rootScope, $stateParams) {

    $scope.count = 15;
    $scope.start = 0;
  console.log("hello")

    if ($rootScope.loggedIn) {
      // updateResults();
    } else {
      $scope.view = false;
    }

    $scope.doRefresh = function () {
      updateResults();
    }

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
    }

    $scope.forward = function () {
      if ($scope.start >= $scope.products.total - $scope.count) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start + $scope.count;
        updateResults();
      }
    }

    $scope.search = function (term) {
      console.log('>' + term)
    }

    function updateResults() {
      var url = backend + "/requests";
      $http({
        url: url,
        method: 'GET',
        headers: {
          'Start': $scope.start,
          'Count': $scope.count,
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        //console.log(data)
        if (data.total === 0) {
          $scope.noRequests = true;
        }
        $scope.products = data;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
