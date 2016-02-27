angular.module('App.items', [])
  .controller('itemsCtrl', function ($scope, $http, $rootScope) {
    var sortByUrl = '/products/updated/newest';
    var previousURL = '/products/updated/newest';
    $scope.domain = domain;
    $scope.count = 3;
    $scope.start = 0;
    resetProducts();
    $scope.start += $scope.count;
    $scope.filters = [{
      title: 'Updated: newest first',
      path: 'updated: newest first',
      active: 'active'
    },{
      title: 'Added: newest first',
      path: 'added: newest first',
      active: 'inactive'
    },{
      title: 'added: oldest first',
      path: 'added: oldest first',
      active: 'inactive'
    },{
      title: 'Updated: oldest first',
      path: 'updated: oldest first',
      active: 'inactive'
    },{
      title: 'Likes: Most likes',
      path: 'Likes: Most likes',
      active: 'inactive'
    }]
    //updateResults();

    $scope.revealSearch = function () {
      $scope.showSearch = true;
      $scope.SearchClass = 'inputs animated enter';
      //$scope.doRefresh();
    }
    $scope.hideSearch = function () {
      $scope.SearchClass = 'inputs animated away';

      //setTimeout(function() {
      $scope.showSearch = false;
      //}, 300)
      if (sortByUrl != previousURL) {

        sortByUrl = previousURL;

        resetProducts();
        $scope.start = $scope.start + $scope.count;
        updateResults();
      }
    }

    $scope.getFilteredResults = function (filter, index) {
      resetProducts();
      if ($scope.showSearch) {

        $scope.hideSearch();
      }

      for (var i = 0; i < $scope.filters.length; i++) {
        $scope.filters[i].active = 'inactive';
      }

      $scope.filters[index].active = 'active';

      console.log(filter)
      $scope.start = $scope.start + $scope.count;
      switch (filter) {
        case 'added: newest first':
          sortByUrl = '/products/added/newest';
          break;
        case 'added: oldest first':
          sortByUrl = '/products/added/oldest';
          break;
        case 'updated: newest first':
          sortByUrl = '/products/updated/newest';
          break;
        case 'updated: oldest first':
          sortByUrl = '/products/updated/oldest';
          break;
        case 'Likes: Most likes':
          sortByUrl = '/products/likes/most';
          break;
        case 'Likes: Least likes':
          sortByUrl = '/products/likes/least';
          break;
        case 'Duration: Highest first':
          sortByUrl = '/products/duration/highest';
          break;
        case 'Duration: Lowest first':
          sortByUrl = '/products/duration/lowest';
          break;
        default:
          sortByUrl = '/products/updated/newest';
          break;
      }
      updateResults();
    }


    if ($rootScope.loggedIn) {
      // updateResults();
    } else {
      $scope.view = false;
    }

    $scope.doRefresh = function () {
      resetProducts();
      $scope.start = $scope.start + $scope.count;
      updateResults();
    }

    $scope.$watch("count", function (newValue) {
      // console.log(newValue);
      window.localStorage.setItem("product_count", newValue);
      updateResults();
    });

    $scope.back = function () {
      if ($scope.start - $scope.count < 0) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start + $scope.count;
        updateResults();
      }
    }

    $scope.forward = function () {
      if ($scope.start >= $scope.products.total - $scope.count) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start + $scope.count;
        updateResults();
      }
    }

    $scope.search = function (term) {
      console.log('>' + term)
      resetProducts();
      $scope.start += $scope.count;

      console.log(previousURL.split('/')[0])
      if (previousURL.split('/')[0] == 'products') {
        previousURL = sortByUrl;

      }
      sortByUrl = '/search/' + term;
      updateResults();

    };


    $scope.loadMore = function () {
      console.log("gotta load more")
      $scope.start += $scope.count;
      if (!$scope.noMoreData) {
        updateResults()
      }
    };

    function resetProducts() {
      $scope.noMoreData = false;
      $scope.start = -$scope.count;
      $scope.products = {
        items: [],
        total: 0
      };
    }


    $scope.releaseImage = function (index) {
      //$scope.holding = false;
      $scope.products.items[index].fullscreenenabled = false;
    };

    $scope.holdImage = function (index) {
      $scope.products.items[index].fullscreenenabled = true;
      //$scope.holding = true;
      //console.log("product")
      //$scope.fullscreenImage = product.images.size.large
    };


    function like(index, id) {
      $http({
        url: backend + "/product/" + id + "/like",
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        $scope.products.items[index].likes.liked = true;
        $scope.products.items[index].likes.likes++;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });
      //
    }

    function unlike(index, id) {
      $http({
        url: backend + "/product/" + id + "/unlike",
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': window.localStorage.token
        }
      }).success(function (data, status, headers, config) {
        $scope.products.items[index].likes.liked = false;
        $scope.products.items[index].likes.likes--;
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      });

    }


    $scope.like = function (index, id, status) {
      if (status) {

        $scope.products.items[index].heartClass = 'hide';
        unlike(index, id)
      } else {
        $scope.products.items[index].heartClass = 'reveal';
        like(index, id)

      }
    }

    console.log($scope.auth)

    function updateResults() {
      var url = backend + sortByUrl;
      if (!$scope.noMoreData) {
        $http({
          url: url,
          method: 'GET',
          headers: {
            'Start': $scope.start,
            'Count': $scope.count,
            'token': window.localStorage.token
          }
        }).success(function (data, status, headers, config) {
          //$scope.products = data;
          console.log(data)
          $scope.products.total += data.total;
          for (var i = 0; i < data.total; i++) {
            $scope.products.items.push(data.items[i])
          }
          var urls = [];
          $scope.busy = false;
          if (data.total === 0) {
            $scope.noMoreData = true;
          }

        }).error(function (data, status, headers, config) {
          console.log(data);
          $scope.error = true;
        }).finally(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.refreshComplete');
        });
      }
    }

  });
