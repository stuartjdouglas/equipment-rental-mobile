angular.module('App.item', [])
  .controller('itemCtrl', function ($state, $scope, $http, $rootScope, $stateParams, $timeout, $ionicActionSheet, $cordovaSocialSharing, $ionicModal, $ionicPopup, nfcService) {
    $scope.message = {
      'processing': false
    };

    $scope.comment = {
      'processing': false
    };
    var background = angular.element(document.getElementById('itembackground'));
    $scope.domain = domain;
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
        $scope.product = result.items[0];
        $scope.isOwner = (result.items[0].owner.username === $rootScope.auth.username);
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
        }
      }).success(function (data) {
        $scope.requestData = data;
        $scope.hasRequested = data.requested;
      }).error(function () {
        $scope.error = true;
      });
    }

    function requestItem() {
      $http({
        url: backend + '/product/' + $stateParams.item + '/request',
        method: 'POST',
        headers: {
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        $scope.requestData = data;
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
        }
      }).success(function (data, status, headers, config) {
        getRequestStatus();
        $scope.hasRequest = false;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });
    }

    $scope.cancelRequest = function () {
      if ($rootScope.loggedIn) {
        cancelRequest();
      }
    };


    $scope.rentbuttonclick = function () {
      if ($scope.avail) {
        requestItem();
      }
    };

    $scope.return = function () {
      if ($scope.isOwner) {
        ownerReturn();
      } else {
        //returnItem();
      }
    };

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
            }
          }).success(function (data, status, headers, config) {
            $location.path('/owner/listing');
          }).error(function (data, status, headers, config) {
            $scope.error = true;
          });
        }
      });


    };

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
        }
      }).success(function (data, status, headers, config) {
        $scope.ava = data;
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
          }
        }).success(function (data, status, headers, config) {
          $scope.ownerAva = data;
        }).error(function (data, status, headers, config) {
          $scope.error = true;
        });
      }
    }

    $scope.doRefresh = function () {
      getRequestStatus();
      getItem();
      checkAva();
    };

    $scope.addComment = function (comment) {
      $scope.message.processing = true;
      sendComment(comment.message);
    };

    $scope.deleteComment = function (cid, index) {
      deleteComment(cid, index);
    };

    function sendComment(comment) {
      $http({
        url: backend + "/product/" + $stateParams.item + '/comment',
        method: 'POST',
        headers: {
          'token': window.localStorage.token,
          'comment': comment,
          'rating': Number($scope.newrating)
        }
      }).success(function (data, status, headers, config) {
        $scope.product.comments.reviews.shuffle(data);
      }).error(function (data, status, headers, config) {
        console.log('error');
      }).finally(function () {
        $scope.message.processing = false;
      });
    }

    function deleteComment(cid, index) {
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

    $scope.goTo = function (path, product) {
      $state.go('app.itemdescription', {'product': product});
    };


    $scope.ratingsObject = {
      iconOn: 'ion-ios-star',
      iconOff: 'ion-ios-star-outline',
      iconOnColor: 'rgb(200, 200, 100)',
      iconOffColor: 'rgb(200, 100, 100)',
      rating: 2,
      minRating: 1,
      readOnly: true,
      callback: function (rating) {
        $scope.ratingsCallback(rating);
      }
    };

    $scope.ratingsCallback = function (rating) {
      $scope.newrating = rating;
    };


    $ionicModal.fromTemplateUrl('review-model.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.reviewModal = modal;
    });
    $scope.showReviewWrite = function () {
      $scope.reviewModal.show();
    };
    $scope.closeReviewWrite = function () {
      $scope.reviewModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.reviewModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });


  });
