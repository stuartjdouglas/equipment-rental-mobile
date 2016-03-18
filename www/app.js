angular.module('App', [
    'ionic',
    'ngCordova',
    'ngAnimate',
    'ionic.service.core',
    'App.pushCtrl',
    'App.currentRentalCtrl',

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
    'App.item',
    'App.items',
    'App.adminItemAdd',
    'App.my.items',
    'App.account.settings',
    'App.settings',
    'App.tag',
    'App.requests',
    'App.request',
    'App.userrequests',
    'App.itemDescription',


    // Owner views
    'App.ownerItems',
    'App.ownerRequests',

    // Factories
    'App.config',
    'App.factory.scanner',
    'App.nfcHandler',

    // Filters
    'App.Filters',

    // Components | Directives
    'App.availability',
    'App.imagepreview',
    'App.rentbutton',
    'App.image',
    'App.imageSlider',
    'App.Slider',

    //Dependencies
    'angularMoment',
    'base64',
    'ngColorThief',
    'ionic-ratings'
  ])

  .run(function ($ionicPlatform, $window) {
    $ionicPlatform.ready(function () {
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
          //window.localStorage.themeColour = '#3498DB'
          var colour = window.localStorage.themeColour;
          if (colour != "") {
            if (colour != "") {
              window.StatusBar.backgroundColorByHexString('#2C3E50');
              // window.StatusBar.backgroundColorByHexString(colour);
            } else {
              window.StatusBar.backgroundColorByHexString('#2C3E50');
            }
          } else {
            window.localStorage.themeColour = '#2C3E50';
            window.StatusBar.backgroundColorByHexString('#2C3E50');
          }


        } else {
          StatusBar.styleLightContent();
        }
      }

      $window.addEventListener('SamklUrl', function (e) {
        if (e.detail.url === 'letskarite://') {
          console.log(e)
          alert('got url')
        }
      })

    });
  })
  .config(['$ionicAppProvider', function ($ionicAppProvider) {
    $ionicAppProvider.identify({
      app_id: 'db428b22',
      api_key: '22ee5b3d6e19516fce11a5d436715e9f20588a17e7268543',
      dev_push: true,
    })

  }])

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'views/timeline/timeline.html',
            controller: 'timelineCtrl'
          }
        }
      })

      .state('app.items', {
        url: '/items',
        cache: true,
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
            templateUrl: 'views/item/item.html',
            controller: 'itemCtrl'
          }
        }
      })
      .state('app.itemdescription', {
        url: '/item/:item/description',
        views: {
          'menuContent': {
            templateUrl: 'views/item/itemDescription/itemDescription.html',
            controller: 'itemDescriptionCtrl'


          }

        },
        params: {
          'product': 'none'
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
        cache: true,
        views: {
          'menuContent': {
            templateUrl: 'views/user/my/items/myitems.html',
            controller: 'myItemsCtrl'
          }
        }
      })

      .state('app.accountSettings', {
        url: '/account/settings',
        cache: true,
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

      // Tag route

      .state('app.tag', {
        url: '/tag/:tag',
        views: {
          'menuContent': {
            templateUrl: 'views/tag/tag.html',
            controller: 'tagCtrl'
          }
        }
      })

      // Requests

      .state('app.request', {
        url: '/request/:request',
        views: {
          'menuContent': {
            templateUrl: 'views/requests/request/request.html',
            controller: 'requestCtrl'
          }
        }
      })

      .state('app.requests', {
        url: '/owner/requests',
        views: {
          'menuContent': {
            templateUrl: 'views/requests/requests/requests.html',
            controller: 'requestsCtrl'
          }
        }
      })

      .state('app.userrequests', {
        url: '/my/requests',
        views: {
          'menuContent': {
            templateUrl: 'views/user/my/requests/requests.html',
            controller: 'userRequestsCtrl'
          }
        }
      })


    $urlRouterProvider.otherwise('/app/timeline');

  })


  .controller('AppCtrl', ['$scope', '$rootScope', 'scanner', '$location', '$ionicSideMenuDelegate', 'nfcService', function ($scope, $rootScope, scanner, $location, $ionicSideMenuDelegate, nfcService, $watch) {
    $rootScope.loggedIn = window.localStorage.token != undefined;


    if (window.localStorage.auth) {
      $rootScope.auth = JSON.parse(window.localStorage.auth);
    }

    $scope.theme = {
      color: 'pink'
    };

    if (window.localStorage.settings != undefined) {
    } else {
      var defaultSettings = {
        "notification": {
          "mute": false,
          "enable": true
        }
      };

      window.localStorage.settings = JSON.stringify(defaultSettings);
      $rootScope.settings = defaultSettings;
    }

    $rootScope.api = backend;
    $rootScope.data = data;
    $scope.scan = scanner.scan;

    $scope.goto = function (state) {
      console.log(state);

      $location.path('#/app/user/profile');
    };

    // This function is called when we scan a nfc tag or access the app through the custom url
    $rootScope.NFCurlAccess = function (url) {
      $rootScope.NFCurl = url;
      var type = $rootScope.NFCurl.split('/')[2]
      var id = $rootScope.NFCurl.split('/')[3]
      if (type === 'product') {
        $location.path('app/item/' + id)
      }
    }


    $ionicSideMenuDelegate.canDragContent(false);

  }]);

function handleOpenURL(url) {
  setTimeout(function () {
    angular.element(document.getElementsByTagName('body')[0]).scope().NFCurlAccess(url);
  }, 0);
}
