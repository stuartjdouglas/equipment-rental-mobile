'use strict';

angular.module('App.rentbutton', ['App.config'])
  .directive('rentbutton', function () {
    return {
      restrict: 'AEC',
      scope: {
        productid: '@'
      },
      templateUrl: 'components/rentbutton/rentbutton.html',
      controller: function ($scope, $http, $rootScope, $location, $attrs) {
        $scope.message = 'hello';
        $scope.productid = $attrs.productid;
        $scope.availability = "Loading...";
        $scope.$watch(
          "productid",
          function handleChange() {
            if ($attrs.productid != "{{product.id}}" && $scope.productid != "") {
              $scope.showLoading = false;
              $scope.productid = $attrs.productid;

              $http({
                url: backend + '/p/' + $scope.productid + '/availability',
                method: 'GET',
              }).success(function (data, status, headers, config) {
                if (data.available) {
                  $scope.availability = "Available";
                } else {
                  $scope.availability = "Unavailable";
                }
              }).error(function (data, status, headers, config) {
                $scope.error = true;
              });
            } else {
              $scope.showLoading = true;
            }
          }
        );

      },
      link: function (scope, elem, attrs, cordovaToast) {

        elem.bind('click', function () {

          if (scope.availability === 'Available') {

          } else if (scope.availability === 'Unavailable') {
            alert("item is not Available");
          }
        });

      }
    };
  });
