angular.module('App', [
  'ionic',
  'ngCordova',
  // Views
  'App.home',
  'App.about',
  'App.login',
  'App.logout',
  'App.register',
  'App.image.upload',
  'App.user.profile',
  'App.user.user',
  'App.user.users',
  'App.scanner',
  'App.timeline',
  'App.items',
  'App.adminItemAdd',
  'App.my.items',
  'App.account.settings',
  'App.settings',

  // Owner views
  'App.ownerItems',
  'App.ownerRequests',

  // Factories
  'App.config',
  'App.factory.scanner',



  // Components | Directives
  'App.availability',
  'App.imagepreview',
  'App.rentbutton',

  //Dependencies
  'angularMoment',
  'base64',
  'ngColorThief'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
      if (ionic.Platform.isAndroid()) {
        // window.StatusBar.backgroundColorByHexString('#039BE5');
        var colour = window.localStorage.themeColour;
        if (colour != "") {
          if (colour != "") {
            window.StatusBar.backgroundColorByHexString('#039BE5');
            // window.StatusBar.backgroundColorByHexString(colour);
          } else {
            window.StatusBar.backgroundColorByHexString('#039BE5');
          }
        } else {
          window.localStorage.themeColour = '#039BE5';
          window.StatusBar.backgroundColorByHexString('#039BE5');
        }

      } else {
        StatusBar.styleLightContent();
      }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'views/home/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('app.timeline', {
    url: '/timeline',
    views: {
      'menuContent': {
        templateUrl: 'views/timeline/timeline.html',
        controller: 'timelineCtrl'
      }
    }
  })

  .state('app.items', {
    url: '/items',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'views/items/items.html',
        controller: 'itemsCtrl'
      }
    }
  })

  .state('app.item', {
    url: '/item/:item',
    views: {
      'menuContent': {
        templateUrl: 'views/items/item.html',
        controller: 'itemCtrl'
      }
    }
  })

  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'views/about/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  .state('app.scanner', {
      url: '/scanner',
      views: {
        'menuContent': {
          templateUrl: 'views/scanner/scanner.html',
          controller: 'scannerCtrl'
        }
      }
    })
    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'views/login/login.html',
          controller: 'loginCtrl'
        }
      }
    })

  .state('app.logout', {
    url: '/logout',
    views: {
      'menuContent': {
        //templateUrl: 'views/logout/login.html',
        controller: 'logoutCtrl'
      }
    }
  })

  .state('app.register', {
    url: '/register',
    views: {
      'menuContent': {
        templateUrl: 'views/register/register.html',
        controller: 'registerCtrl'
      }
    }
  })


  // Image routes

  .state('app.imageUpload', {
    url: '/upload/image',
    views: {
      'menuContent': {
        templateUrl: 'views/imageUpload/imageUpload.html',
        controller: 'imageUploadCtrl'
      }
    }
  })


  // User routes

  .state('app.userProfile', {
    url: '/user/profile',
    views: {
      'menuContent': {
        templateUrl: 'views/user/profile/profile.html',
        controller: 'userProfileCtrl'
      }
    }
  })

  .state('app.userUser', {
    url: '/user/:user',
    views: {
      'menuContent': {
        templateUrl: 'views/user/user/user.html',
        controller: 'userUserCtrl'
      }
    }
  })

  .state('app.userUsers', {
    url: '/users',
    views: {
      'menuContent': {
        templateUrl: 'views/user/users/users.html',
        controller: 'userUsersCtrl'
      }
    }
  })

  .state('app.myItems', {
    url: '/my/items',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'views/user/my/items/myitems.html',
        controller: 'myItemsCtrl'
      }
    }
  })

  .state('app.accountSettings', {
    url: '/account/settings',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'views/account/account.html',
        controller: 'accountSettingsCtrl'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    cache: true,
    views: {
      'menuContent': {
        templateUrl: 'views/application/settings/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('app.adminItemAdd', {
    url: '/admin/item/add',
    views: {
      'menuContent': {
        templateUrl: 'views/admin/item/add/add.html',
        controller: 'adminItemAddCtrl'
      }
    }
  })
  .state('app.ownerItems', {
    url: '/owner/items',
    views: {
      'menuContent': {
        templateUrl: 'views/owner/ownerItems/ownerItems.html',
        controller: 'ownerItemsCtrl'
      }
    }
  })


  $urlRouterProvider.otherwise('/app/timeline');

})


.controller('AppCtrl', ['$scope', '$rootScope', 'scanner', '$location', '$ionicSideMenuDelegate', function($scope, $rootScope, scanner, $location, $ionicSideMenuDelegate) {
  $rootScope.loggedIn = window.localStorage.token != undefined;

  if (window.localStorage.auth) {
    $rootScope.auth = JSON.parse(window.localStorage.auth);
  }

  console.log($rootScope.auth);
  $scope.theme = {
    color: 'pink'
  }

  $rootScope.api = backend;
  $rootScope.data = data;
  $scope.scan = scanner.scan;

  $scope.goto = function(state) {
    console.log(state);

    $location.path('#/app/user/profile');
  }

  $ionicSideMenuDelegate.canDragContent(false);

}]);
