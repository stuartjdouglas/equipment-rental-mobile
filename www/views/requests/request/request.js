angular.module('App.request', [])
  .controller('requestCtrl', function ($scope, $http, $rootScope, $stateParams) {
    $scope.noRequests = false;
    $scope.requests = {};
    getRequests();

    $scope.doRefresh = function() {
      getRequests();
    }


    $scope.approve = function (username, index) {
      $http({
        url: backend + "/product/" + $stateParams.request + "/request/authorize/" + username,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        $scope.requests.requests.splice(index, 1);
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });
    };

    $scope.deny = function (username, index) {
      console.log(index)
      $http({
        url: backend + '/product/' + $stateParams.request + '/request/cancel',
        method: 'POST',
        headers: {
          'token': window.localStorage.token,
          'username': username
        },
      }).success(function (data, status, headers, config) {
        $scope.requests.requests.splice(index, 1);
        $scope.hasRequest = false;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });
    };

    $scope.cancel = function (username) {
      console.log(username);
    };

    function getRequests() {
      $http({
        url: backend + "/requests/" + $stateParams.request,
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        console.log(data);
        if (data.total === 0) {
          $scope.noRequests = true;
        }
        $scope.requests = data;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
