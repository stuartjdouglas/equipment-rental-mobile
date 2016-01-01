angular.module('App.items', [])
  .controller('itemsCtrl', function($scope, $http, $rootScope) {

   $scope.count = 15;


    $scope.start = 0;



    if ($rootScope.loggedIn) {
      updateResults();
    } else {
      $scope.view = false;
    }

    $scope.$watch("count", function(newValue) {
      console.log(newValue);
      window.localStorage.setItem("product_count", newValue);
      updateResults();
    });

    $scope.back = function() {
      if ($scope.start - $scope.count < 0) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start - $scope.count;
        updateResults();
      }
    }

    $scope.forward = function() {
      if ($scope.start >= $scope.products.total - $scope.count) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start + $scope.count;
        updateResults();
      }
    }

    function updateResults() {
      $http({
        url: backend + "/p",
        method: 'GET',
        headers: {
          'Start':$scope.start,
          'Count':$scope.count
        }
      }).success(function(data, status, headers, config) {
        console.log(data);
        $scope.products = data;
      }).
      error(function(data, status, headers, config) {
        $scope.error = true;
      });
    }

  })
  .controller('itemCtrl', function($scope, $http, $rootScope, $stateParams, $ionicScrollDelegate, $cordovaLocalNotification) {
    var background = angular.element(document.getElementById('itembackground'));
    $http({
      url: backend + "/product/" + $stateParams.item,
      method: 'GET',
      headers: {
        'Start':$scope.start,
        'Count':$scope.count
      }
    }).success(function(result, status, headers, config) {
      console.log(result.item[0]);
      $scope.product = result.item[0];
      console.log(data);
      background.css({
        'background-image': 'url(' + data + $scope.product.image.size.large + ')'
      });

      //Call if the item is available
      checkAva();


      //debugger

    }).
    error(function(data, status, headers, config) {
      $scope.error = true;
    });
    //filter: blur(5px);

    var statusbar = angular.element(document.getElementById('status'));


    function checkAva() {
      $http({
        url: backend + '/p/' + $stateParams.item + '/availability',
        method: 'GET',
        headers: {
          'token': window.sessionStorage.token
        },
      }).success(function (data, status, headers, config) {
        $scope.ava = data;
        console.log(data);
        $scope.gotRes = true;


        if (data.available) {
          if ($scope.gotRes) {
            //8BC34A
            $scope.availability = "Available";
            statusbar.css({
              'background-color': '#e3e3e3',
              'border-bottom': 'thick solid #8BC34A'

            })
          }
        } else {
          if (!data.available) {
            if ($scope.gotRes) {
              console.log(data.owner);
              if (data.owner) {
                $scope.avail = true;
                $scope.availability = 'You current own this';
                statusbar.css({
                  'background-color': '#78909C'
                })
              } else {
                $scope.availability = "Unavailable";
                statusbar.css({
                  'background-color': '#f44336'
                })
              }

            }
          }
        }
      }).
      error(function (data, status, headers, config) {
        $scope.error = true;
      });
    }

  });
