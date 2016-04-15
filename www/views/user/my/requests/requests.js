angular.module('App.userrequests', [])
  .controller('userRequestsCtrl', function ($scope, $http, $rootScope, $stateParams) {

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

    function resetProducts() {
      $scope.noMoreData = false;
      $scope.start = -$scope.count;
      $scope.products = {
        items: [],
        total: 0
      };
    }

    function cancelRequest(id, index) {
      console.log(id);
      $http({
        url: backend + '/product/' + id + '/request/cancel',
        method: 'POST',
        headers: {
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        $scope.products.requests.splice(index, 1);
        $scope.hasRequest = false;

      }).error(function (data, status, headers, config) {
        $scope.error = true;
      }).then(function () {
        $scope.doRefresh();
      });
    }

    $scope.cancel = function (id, index) {
      if ($rootScope.loggedIn) {
        cancelRequest(id, index);
      }
    };


    function updateResults() {
      var url = backend + "/requests";
      if (!$scope.noMoreData) {
        $http({
          url: url,
          method: 'GET',
          headers: {
            'Start': $scope.start,
            'Count': $scope.count,
            'token': window.localStorage.token
          }
        }).success(function (data) {

          $scope.products.total += data.total;
          for (var i = 0; i < data.total; i++) {
            $scope.products.items.push(data.requests[i])
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
