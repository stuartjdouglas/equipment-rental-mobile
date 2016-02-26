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
        console.log($scope.numbertoshow)
        $scope.domain = domain;
        var imagewidth = window.innerWidth * 1 / $scope.numbertoshow;
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
          //console.log(imagewidth)
          return {
            'background': 'url(' + url + ') no-repeat center center',
            'background-size': 'cover',
            'overflow': 'hidden',
            'min-width': imagewidth + 'px'
          };

        };

        $scope.loadMore = function () {
          //if ($scope.products.total == parseInt($scope.numbertoshow)) {
          //console.error(busy)
          if (!busy) {
            busy = true;
            //debugger
            //console.log("load more!!!!")
            $scope.step = $scope.step + parseInt($scope.numbertoshow);
            getResults();
          }
          //} else {
          //  $scope.nomoreright = true;
          //}
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

          //console.log($scope.step + ' : ' + $scope.numbertoshow)
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
            //$scope.products = {};
            //console.log(data)
            $scope.products.total += data.total;
            for (var i = 0; i < data.total; i++) {
              $scope.products.items.push(data.items[i])
            }

            if (data.total < $scope.numbertoshow) {
              $scope.nomoreright = true;
            }
            console.log(data)
            //$scope.$apply();

            //$timeout(function() {
            //  //$scope.products = data;
            //  //$scope.products += data.total;
            //
            //
            //
            //
            //
            //}, 1);
          }).error(function (data, status, headers, config) {
            $scope.error = true;
          }).finally(function() {
            busy = false;
            //console.log("done loading")
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        }
      },
      link: function (scope, elem, attrs) {
        // Just for altering the DOM
        //scope.watch($scope.availability, function() {
        //  debugger;
        //  if (scope.availability === 'Available') {
        //    elem.addClass("available");
        //  } else if (scope.availability === 'UnAvailable') {
        //    elem.addClass("unavailable");
        //  } else {
        //    elem.addClass("error");
        //  }
        //})
      }
    };
  });
