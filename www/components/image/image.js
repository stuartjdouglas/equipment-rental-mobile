'use strict';

angular.module('App.image', ['App.config', 'ngColorThief'])
  .directive('imageview', function () {
    return {
      restrict: 'AEC',
      scope: {
        image: '@'
      },
      templateUrl: 'components/image/image.html',
      controller: function ($scope, $http, $rootScope, $location, $attrs) {
        $scope.datasource = $attrs.datasource;

      },
      link: function (scope, elem, attrs, timeout) {
        scope.imageprops = {
          height: 0,
          width: 0
        };

        scope.style = {
          'background-color': 'pink',
          'background': 'url("") no-repeat center center',
          'background-size': 'cover'
        };

        scope.bannerstyle = {};

        scope.imageloaded = false;

        scope.$watch(
          "image",
          function handleImageChange() {
            if (attrs.image != "") {
              scope.url = data + scope.image;
              scope.bannerstyle['background-image'] = 'url(\"' + scope.url + '\")';
              scope.style['background-image'] = 'url(\"' + scope.url + '\")';

              var img = new Image();

              img.onload = function () {
                scope.imageloaded = true;
                setTimeout(function () {
                  scope.imageloaded = true;
                  scope.$apply();
                }, 1);
              };

              img.src = scope.url;
              if (img.complete) img.onload();
            }
          }
        );
        scope.tapped = false;
        scope.tap = function () {
          scope.tapped = !scope.tapped;

        }


      }
    };
  });
