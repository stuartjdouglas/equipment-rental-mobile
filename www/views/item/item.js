angular.module('App.item', [])
  .controller('itemCtrl', function ($state, $scope, $http, $rootScope, $stateParams, $timeout, $ionicActionSheet, $cordovaSocialSharing, $ionicModal, $ionicPopup, nfcService) {
    $scope.message = {
      'processing': false
    }

    $scope.comment = {
      'processing': false
    }
    var background = angular.element(document.getElementById('itembackground'));
    $scope.domain = domain;
    //$scope.options = {
    //  direction: 'horizontal',
    //  loop: true,
    //  effect: 'fade',
    //  autoplay: 2000
    //};

    $scope.options = {
      direction: 'horizontal',
      slidesPerView: '1',
      paginationClickable: true,
      showNavButtons: false
    };

    $scope.data = {};

    function getItem() {
      $http({
        url: backend + "/product/" + $stateParams.item,
        method: 'GET',
        headers: {
          'Start': $scope.start,
          'Count': $scope.count
        }
      }).success(function (result, status, headers, config) {
        console.log(result)
        $scope.product = result.items[0];
        $scope.isOwner = (result.items[0].owner.username === $rootScope.auth.username)
        console.log('owner: ' + $scope.isOwner)
        background.css({
          'background-image': 'url(' + data + $scope.product.images[0].size.large + ')'
        });
        //Call if the item is available
        checkAva();
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });
    }

    getItem();
    getRequestStatus();

    //var statusbar = angular.element(document.getElementById('status'));

    $scope.showAction = function () {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: 'Twitter'},
          {text: 'Facebook'},
          {text: 'Other'}
        ],
        titleText: 'Share',
        cancelText: 'Cancel',
        cancel: function () {
          hideSheet();
        },
        buttonClicked: function (index) {
          if (index === 0) {
            $cordovaSocialSharing
              .shareViaTwitter($scope.product.title, data + $scope.product.image.size.large, "http://lemondev.xyz:3000/#/listing/" + $scope.product.id)
              .then(function (result) {
                // console.log(result);
              }, function (err) {
                // An error occurred. Show a message to the user
              });
          } else if (index === 1) {
            $cordovaSocialSharing
              .shareViaFacebook($scope.product.title + "  http://lemondev.xyz:3000/#/listing/" + $scope.product.id, data + $scope.product.image.size.large)
              .then(function (result) {
                // Success!
              }, function (err) {
                // An error occurred. Show a message to the user
              });
          } else {
            $cordovaSocialSharing
              .share($scope.product.title, $scope.product.title, data + $scope.product.image.size.large, "http://lemondev.xyz:3000/#/listing/" + $scope.product.id) // Share via native share sheet
              .then(function (result) {
                // Success!
              }, function (err) {
                // An error occured. Show a message to the user
              });

          }
          return true;
        }
      });
    };

    function getRequestStatus() {
      $http({
        url: backend + '/product/' + $stateParams.item + '/request',
        method: 'GET',
        headers: {
          'token': window.localStorage.token
        },
      }).success(function (data, status, headers, config) {
        $scope.requestData = data;
        console.log(data)
        $scope.hasRequested = data.requested;
      }).error(function (data, status, headers, config) {
        console.log(data)

        $scope.error = true;
      });
    }

    function requestItem() {
      $http({
        url: backend + '/product/' + $stateParams.item + '/request',
        method: 'POST',
        headers: {
          'token': window.localStorage.token
        },
      }).success(function (data, status, headers, config) {
        $scope.requestData = data;
        console.log(data)
        $scope.hasRequested = data.requested;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });
    }

    function cancelRequest() {
      $http({
        url: backend + '/product/' + $stateParams.item + '/request/cancel',
        method: 'POST',
        headers: {
          'token': window.localStorage.token
        },
      }).success(function (data, status, headers, config) {
        getRequestStatus();
        $scope.hasRequest = false;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });
    }

    $scope.cancelRequest = function() {
      if ($rootScope.loggedIn) {
        cancelRequest();
      }
    };


    $scope.rentbuttonclick = function () {
      if ($scope.avail) {
        requestItem();
        //rentItem();
      } else {
        if ($scope.availability !== "Unavailable") {
          console.log("YOU OWN TIS")
        } else {
          console.log("Unavailable");
        }
      }
    };

    $scope.return = function () {
      console.log("returning");
      if ($scope.isOwner) {
        ownerReturn();
      } else {
        //returnItem();
      }
    }

    function ownerReturn() {
      $http({
        url: backend + '/p/' + $scope.product.id + '/return',
        method: 'POST',
        headers: {
          'token': window.localStorage.token
        },
      }).success(function (data, status, headers, config) {
        checkAva();
        $scope.owner = false;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });
    }

    $scope.deleteItem = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete item',
        template: 'Are you sure you want to delete this item?'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $http({
            url: backend + '/product/' + $scope.product.id + '/delete',
            method: 'DELETE',
            headers: {
              'token': window.localStorage.token
            },
          }).success(function (data, status, headers, config) {
            $location.path('/owner/listing');
          }).error(function (data, status, headers, config) {
            $scope.error = true;
          });
        } else {
          console.log('You are not sure');
        }
      });


    };

    //function returnItem() {
    //  $http({
    //    url: backend + '/p/' + $scope.product.id + '/return',
    //    method: 'POST',
    //    headers: {
    //      'token': window.localStorage.token
    //    },
    //  }).success(function (data, status, headers, config) {
    //    checkAva();
    //    $scope.owner = false;
    //  }).error(function (data, status, headers, config) {
    //    $scope.error = true;
    //  });
    //}
    //
    //function rentItem() {
    //  if ($scope.avail) {
    //    $http({
    //      url: backend + '/p/' + $scope.product.id + '/rent',
    //      method: 'POST',
    //      headers: {
    //        'token': window.localStorage.token
    //      },
    //    }).success(function (data, status, headers, config) {
    //      // console.log(data);
    //      // Notification.success({message: '<i class="fa fa-paper-plane"></i> ' + $scope.product.title + ' has just been rented. :)', positionY: 'bottom', positionX: 'center'});
    //      $scope.owner = true;
    //      $scope.rentButtonClass = [];
    //      checkAva();
    //    }).error(function (data, status, headers, config) {
    //      $scope.error = true;
    //    });
    //  } else {
    //    alert("not available");
    //  }
    //}

    $scope.buttonstyles = {};
    $scope.rentbuttonclass = {};

    function checkAva() {
      if ($scope.isOwner) {
        checkOwnerStatus();
      }

      $http({
        url: backend + '/p/' + $stateParams.item + '/availability',
        method: 'GET',
        headers: {
          'token': window.localStorage.token
        },
      }).success(function (data, status, headers, config) {
        $scope.ava = data;
          console.log(data);
        $scope.gotRes = true;


        if (data.available) {
          if ($scope.gotRes) {
            $scope.avail = true;
            $scope.availability = "Request";
            $scope.status = "Available";
            $scope.rentbuttonclass = 'button button-balanced';
          }
        } else {
          if (!data.available) {
            if ($scope.gotRes) {
                console.log(data.owner);
              if (data.owner) {
                $scope.avail = false;
                $scope.owner = true;
                $scope.status = "Unavailable";
                $scope.availability = 'You current own this';
                $scope.rentbuttonclass = 'button button-outline button-calm';
              } else {
                $scope.avail = false;
                $scope.availability = "Unavailable";
                $scope.status = "Unavailable";
                $scope.rentbuttonclass = 'button button-outline button-assertive';
              }

            }
          }
        }
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      }).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');

      });
    }

    function checkOwnerStatus() {
      if ($rootScope.loggedIn) {
        $http({
          url: backend + '/owner/products/' + $stateParams.item + '/availability',
          method: 'GET',
          headers: {
            'token': window.localStorage.token
          },
        }).success(function (data, status, headers, config) {
          $scope.ownerAva = data;
          console.log(data);
        }).error(function (data, status, headers, config) {
          $scope.error = true;
        });
      }
    }

    $scope.doRefresh = function () {
      getRequestStatus();
      getItem();
      checkAva();
    }

    $scope.addComment = function (comment) {

      console.log(comment)
      $scope.message.processing = true;
      if (comment.message.length > 5) {
        $scope.product.comments.push({
          "message": comment.message,
          "date_added": Date(),
          'author' : {
            'username': $scope.auth.username,
            'gravatar': $scope.auth.gravatar,
          }
        });

        sendComment(comment.message);

        $scope.comment.message = "";
      }
    };

    $scope.deleteComment = function(cid, index) {
      deleteComment(cid, index);
    }

    function sendComment(comment) {
      //    /product/:pid/comment
      $http({
        url: backend + "/product/" + $stateParams.item + '/comment',
        method: 'POST',
        headers: {
          'token': window.localStorage.token,
          'comment': comment
        }
      }).success(function (data, status, headers, config) {
        //$scope.comment.success = true;
      }).error(function (data, status, headers, config) {
        console.log('error');
        //$scope.comment.success = true;
      }).finally(function () {
        console.log("its over")
        $scope.message.processing = false;
      });
    }

    function deleteComment(cid, index) {
      //    /product/:pid/comment
      $http({
        url: backend + "/product/" + $stateParams.item + '/comment/' + cid,
        method: 'DELETE',
        headers: {
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        $scope.product.comments.splice(index, 1);
      }).error(function (data, status, headers, config) {
        console.log('error');
        $scope.comment.success = true;
      }).finally(function () {
        console.log("its over")
        $scope.message.processing = false;
      });
    }




    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function (product) {
      console.log(product)
      $http({
        url: backend + "/identify/qr/product",
        method: 'GET',
        headers: {
          'width': 300,
          'height': 300,
          'code': product.id
        }
      }).success(function (data, status, headers, config) {

        $scope.qr = data;
        $scope.modal.show();
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });

    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    $scope.goTo = function(path, product) {
      console.log(product)
      console.log(path)

      $state.go('app.itemdescription', {'product': product});
    }

  });
