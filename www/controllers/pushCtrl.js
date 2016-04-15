angular.module('App.pushCtrl', [])
  .controller('pushCtrl', function ($scope, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, $ionicPlatform, $http, $cordovaLocalNotification, $rootScope) {
    var settings = $rootScope.settings;

    if (window.localStorage.settings != undefined) {
      settings = JSON.parse(window.localStorage.settings);
    } else {
      var defaultSettings = {
        "notification": {
          "mute": false,
          "enable": true
        }
      };
      window.localStorage.settings = JSON.stringify(defaultSettings);
      settings = defaultSettings;
    }

    $scope.notifications = [];
    $ionicPlatform.ready(function () {
      var deviceInformation = ionic.Platform.device();
      var isWebView = ionic.Platform.isWebView();

      if (isWebView) {
        if (settings.notification.enable) {
          registerDevice();
        }
      }
    });

    function registerDevice() {
      var config = null;
      if (ionic.Platform.isAndroid()) {
        config = {
          "senderID": "885655955576"
        };
      }
      else if (ionic.Platform.isIOS()) {
        config = {
          "badge": "true",
          "sound": "true",
          "alert": "true"
        }
      }

      $cordovaPush.register(config).then(function (result) {
        console.log(result);
      }, function (err) {
        console.log('register error: ' + err);
      })
    }

    function uploadRegID(regID, type) {
      $http({
        url: backend + '/notification/register',
        method: 'POST',
        headers: {
          'token': window.localStorage.token,
          'type': type,
          'regid': regID
        }
      }).success(function (data, status, headers, config) {
        console.log(data)
      }).error(function (data, status, headers, config) {
        $scope.error = true;
      }).finally(function () {
      });
    }

    $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
      if (ionic.Platform.isAndroid()) {
        if (notification.event == 'registered') {
          uploadRegID(notification.regid, "android")
        }
      }
      else if (ionic.Platform.isIOS()) {
        $scope.$apply(function () {
          $scope.notifications.push(JSON.stringify(notification.alert));
        })
      }


    });

    function displayNotification(notification) {
      $cordovaLocalNotification.schedule({
        id: 1,
        title: notification.title,
        text: notification.message
      })

    }
  });

