angular.module('App.requests', [])
  .controller('requestsCtrl', function ($scope, $http, $rootScope, $stateParams) {

    $scope.count = 15;
    $scope.start = 0;
    $scope.domain = domain;
    resetProducts();
    $scope.start += $scope.count;
    updateResults();

    console.log("hello")

    $scope.doRefresh = function () {
      updateResults();
    };

    function resetProducts() {
      $scope.noMoreData = false;
      $scope.start = -$scope.count;
      $scope.products = {
        items: [],
        total: 0
      };
    }

    function updateResults() {
      var url = backend + "/owner/requests";
      if (!$scope.noMoreData) {
        $http({
          url: url,
          method: 'GET',
          headers: {
            'Start': $scope.start,
            'Count': $scope.count,
            'token': window.localStorage.token
          }
        }).success(function (data, status, headers, config) {
          //$scope.products = data;
          console.log(data)
          $scope.products.total += data.total;
          for (var i = 0; i < data.total; i++) {
            $scope.products.items.push(data.items[i])
          }
          var urls = [];
          $scope.busy = false;
          if (data.total === 0) {
            $scope.noMoreData = true;
          }

        }).error(function (data, status, headers, config) {
          console.log(data);
          $scope.error = true;
        }).finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.refreshComplete');
        });
      }
    }

  });
