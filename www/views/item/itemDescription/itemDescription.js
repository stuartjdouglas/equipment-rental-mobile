angular.module('App.itemDescription', [])
  .controller('itemDescriptionCtrl', function($scope, $http, $rootScope, $state, $stateParams) {
    if ($stateParams.product != 'none') {
      $scope.product = $stateParams.product
    } else {

    }


  });
