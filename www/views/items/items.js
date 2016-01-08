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
      // console.log(newValue);
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
        // console.log(data);
        $scope.products = data;
      }).
      error(function(data, status, headers, config) {
        $scope.error = true;
      });
    }

  })
  .controller('itemCtrl', function($scope, $http, $rootScope, $stateParams, $timeout, $ionicActionSheet, $cordovaSocialSharing, $ionicModal) {
    var background = angular.element(document.getElementById('itembackground'));
    $http({
      url: backend + "/product/" + $stateParams.item,
      method: 'GET',
      headers: {
        'Start':$scope.start,
        'Count':$scope.count
      }
    }).success(function(result, status, headers, config) {
      // console.log(result.item[0]);
      $scope.product = result.item[0];
      // console.log(data);
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


    $scope.showAction = function() {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Twitter' },
          { text: 'Facebook' },
          { text: 'Other'}
        ],
        titleText: 'Share',
        cancelText: 'Cancel',
        cancel: function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          if (index === 0) {
            $cordovaSocialSharing
              .shareViaTwitter($scope.product.title, data + $scope.product.image.size.large, "http://lemondev.xyz:8080/#/listing/" + $scope.product.id)
              .then(function(result) {
                // console.log(result);
              }, function(err) {
                // An error occurred. Show a message to the user
              });
          } else if (index === 1) {
            $cordovaSocialSharing
              .shareViaFacebook($scope.product.title + "  http://lemondev.xyz:8080/#/listing/" + $scope.product.id, data + $scope.product.image.size.large)
              .then(function(result) {
                // Success!
              }, function(err) {
                // An error occurred. Show a message to the user
              });
          } else {
            $cordovaSocialSharing
              .share($scope.product.title, $scope.product.title, data + $scope.product.image.size.large, "http://lemondev.xyz:8080/#/listing/" + $scope.product.id) // Share via native share sheet
              .then(function(result) {
                // Success!
              }, function(err) {
                // An error occured. Show a message to the user
              });

          }
          return true;
        }
      });
    };


    $scope.rentbuttonclick = function() {
      if ($scope.avail) {
        rentItem();
      } else {
        if ($scope.availability !== "Unavailable") {
          console.log("YOU OWN TIS")
        } else {
          console.log("Unavailable");
        }
      }
    };

    $scope.return = function() {
      console.log("returning");
      returnItem();
    }

    function returnItem() {
      $http({
          url: backend + '/p/' + $scope.product.id + '/return',
          method: 'POST',
          headers: {
              'token': window.localStorage.token
          },
      }).success(function (data, status, headers, config) {
          checkAva();
          $scope.owner = false;
      }).
      error(function (data, status, headers, config) {
          $scope.error = true;
      });
    }

    function rentItem() {
      if ($scope.avail) {
        $http({
            url: backend + '/p/' + $scope.product.id + '/rent',
            method: 'POST',
            headers: {
                'token': window.localStorage.token
            },
        }).success(function (data, status, headers, config) {
          // console.log(data);
            // Notification.success({message: '<i class="fa fa-paper-plane"></i> ' + $scope.product.title + ' has just been rented. :)', positionY: 'bottom', positionX: 'center'});
            $scope.owner = true;
            $scope.rentButtonClass = [];
            checkAva();
        }).
        error(function (data, status, headers, config) {
            $scope.error = true;
        });
      } else {
        alert("not available");
      }
    }

    $scope.buttonstyles = {};
    $scope.rentbuttonclass = {};

    function checkAva() {

      $http({
       url: backend + '/p/' + $stateParams.item + '/availability',
       method: 'GET',
       headers: {
         'token': window.localStorage.token
       },
      }).success(function (data, status, headers, config) {
       $scope.ava = data;
      //  console.log(data);
       $scope.gotRes = true;


       if (data.available) {
         if ($scope.gotRes) {
           $scope.avail = true;
           $scope.availability = "Available";
           $scope.rentbuttonclass = 'button button-outline button-balanced';
         }
       } else {
         if (!data.available) {
           if ($scope.gotRes) {
            //  console.log(data.owner);
             if (data.owner) {
               $scope.avail = false;
               $scope.owner = true;
               $scope.availability = 'You current own this';
               $scope.rentbuttonclass = 'button button-outline button-calm';
             } else {
               $scope.avail = false;
               $scope.availability = "Unavailable";
               $scope.rentbuttonclass = 'button button-outline button-assertive';
             }

           }
         }
       }
      }).
      error(function (data, status, headers, config) {
       $scope.error = true;
      });
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(product) {
    console.log(product)
    $http({
      url: backend + "/identify/qr/product",
      method: 'GET',
      headers: {
        'width': 300,
        'height': 300,
        'code': product.id
      }
    }).success(function(data, status, headers, config) {

      $scope.qr = data;
      $scope.modal.show();
    }).
      error(function(data, status, headers, config) {
        $scope.error = true;
      });

  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  });
