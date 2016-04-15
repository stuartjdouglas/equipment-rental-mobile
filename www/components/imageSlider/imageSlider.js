'use strict';

angular.module('App.imageSlider', ['App.config'])
  .directive('imageSlider', function () {
    return {
      restrict: 'AEC',
      scope: {
        images: '@',
        endpoint: '@',
        numbertoshow: '@',
        type: '@'
      },
      templateUrl: 'components/imageSlider/imageSlider.html',
      controller: function ($scope, $http, $timeout) {
        $scope.domain = domain;
        var imagewidth = window.innerWidth / $scope.numbertoshow;
        var images;
        var busy;
        $scope.step = 0;
        $scope.displayLargeScreen = false;
        $scope.isHovering = [{'active': false}, {'active': false}, {'active': false}];

        $scope.step = 0;
        resetProducts();
        getResults();
        $scope.domain = domain;

        $scope.getPrevious = function () {
          $scope.step = $scope.step - parseInt($scope.numbertoshow);
          getResults();
          $scope.nomoreright = false;
        };

        $scope.getNext = function () {
          if ($scope.products.total == parseInt($scope.numbertoshow)) {

            $scope.step = $scope.step + parseInt($scope.numbertoshow);
            getResults();
          } else {
            $scope.nomoreright = true;
          }
        };

        $scope.getClass = function (product) {
          var url = domain + product.images[0].size.medium;
          return {
            'background': 'url(' + url + ') no-repeat center center',
            'background-size': 'cover',
            'overflow': 'hidden',
            'min-width': imagewidth + 'px'
          };

        };

        $scope.loadMore = function () {
          if (!busy) {
            busy = true;
            $scope.step = $scope.step + parseInt($scope.numbertoshow);
            getResults();
          }
        };

        function resetProducts() {
          //page = 0;
          $scope.noMoreData = false;
          $scope.start = -$scope.count;
          $scope.products = {
            items: [],
            total: 0
          };
        }


        function getResults() {
          $http({
            url: backend + $scope.endpoint,
            method: 'GET',
            headers: {
              'Start': $scope.step,
              'Step': $scope.step,
              'Count': $scope.numbertoshow,
              'token': window.localStorage.token
            }
          }).success(function (data, status, headers, config) {
            $scope.products.total += data.total;
            for (var i = 0; i < data.total; i++) {
              $scope.products.items.push(data.items[i])
            }

            if (data.total < $scope.numbertoshow) {
              $scope.nomoreright = true;
            }
          }).error(function (data, status, headers, config) {
            $scope.error = true;
          }).finally(function () {
            busy = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        }
      }
    };
  });
