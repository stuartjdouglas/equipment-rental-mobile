angular.module('App.items', [])
  .controller('itemsCtrl', function ($scope, $http, $rootScope) {
    $scope.domain = domain;
    $scope.count = 6 ;
    $scope.start = 0;
    resetProducts();
    $scope.start += $scope.count;
    updateResults();


    if ($rootScope.loggedIn) {
      // updateResults();
    } else {
      $scope.view = false;
    }

    $scope.doRefresh = function () {
      resetProducts();
      $scope.start = $scope.start + $scope.count;
      updateResults();
    }

    $scope.$watch("count", function (newValue) {
      // console.log(newValue);
      window.localStorage.setItem("product_count", newValue);
      updateResults();
    });

    $scope.back = function () {
      if ($scope.start - $scope.count < 0) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start + $scope.count;
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

    $scope.loadMore = function() {
      console.log("gotta load more")
      $scope.start += $scope.count;
      if (!$scope.noMoreData) {
        updateResults()
      }
    }

    function resetProducts() {
      $scope.noMoreData = false;
      $scope.start = -$scope.count;
      $scope.products = {
        items: [],
        total: 0
      };
    }



    function updateResults() {

      $http({
        url: backend + "/products",
        method: 'GET',
        headers: {
          'Start': $scope.start,
          'Count': $scope.count
        }
      }).success(function (data, status, headers, config) {
        console.log(data);
        console.log($scope.start + ' : ' + $scope.count)
        $scope.products.total += data.total;
        for (var i = 0; i < data.total; i++) {
          $scope.products.items.push(data.items[i])
        }

        if (data.total === 0) {
          $scope.noMoreData = true;
        }
        //$scope.products = data;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
