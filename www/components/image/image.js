'use strict';

angular.module('App.image', ['App.config', 'ngColorThief'])
  .directive('imageview', function() {
    return {
      restrict: 'AEC',
      scope: {
        image: '@'
      },
      templateUrl: 'components/image/image.html',
      controller: function($scope, $http, $rootScope, $location, $attrs) {
        console.log($scope.image)
        $scope.datasource =  $attrs.datasource;


      },
      link: function(scope, elem, attrs, timeout) {
        scope.imageprops = {
          height: 0,
          width: 0
        }

        scope.style = {
          'background-color': 'pink',
          'background': 'url("") no-repeat center center',
          'background-size': 'cover'
        }

        scope.bannerstyle = {

        }

        scope.imageloaded = false;

        scope.$watch(
          "image",
          function handleImageChange( ) {
            if (attrs.image != "") {
              scope.url = data + scope.image;
              scope.bannerstyle['background-image'] = 'url(\"' + scope.url + '\")';
              scope.style['background-image'] = 'url(\"' + scope.url + '\")';

              var img = new Image();

              img.onload = function() {
                // console.log("image loaded.")
                //debugger
                scope.imageloaded = true;

                setTimeout(function(){
                  scope.imageloaded = true;

                  //scope.bannerstyle['-webkit-animation'] = 'slideInDown 0.5s';
                  //scope.bannerstyle.animation =  'slideInDown 0.5s';

                  //scope.style['-webkit-animation'] = 'slideInDown 0.5s';
                  //scope.style.animation =  'slideInDown 0.5s';
                  scope.$apply();
                }, 1);


              }

              img.src = scope.url;
              if (img.complete) img.onload();




              //var image = new Image();
              //image.name = scope.image;
              //image.src = data + scope.image;
              //image.onload = function() {
              //  scope.imageprops = {
              //    height: this.height,
              //    width: this.width
              //  }
              //}
            }
          }
        );



        scope.tapped = false;
        scope.tap = function() {
          scope.tapped = !scope.tapped;

        }




      }
    };
  });
