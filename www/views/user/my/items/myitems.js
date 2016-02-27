angular.module('App.my.items', [])
  .controller('myItemsCtrl', function ($scope, $http, $rootScope) {
    $scope.count = 15;
    $scope.start = 0;
    $scope.domain = domain;
    resetProducts();
    $scope.start += $scope.count;
    updateResults();

    $scope.doRefresh = function () {

      resetProducts();
      $scope.start += $scope.count;
      updateResults();
    };

    $scope.loadMore = function () {
      //console.log("gotta load more")
      //$scope.start += $scope.count;
      //if (!$scope.noMoreData) {
      //  updateResults()
      //}
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
      var url = backend + '/p/rent/current';
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
            if ($scope.products.total == 0) {
              $scope.noData = true;
            }
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
