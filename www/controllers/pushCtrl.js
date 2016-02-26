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

    //console.log("notifications are enabled: " + settings.notification.enable)
    //console.log("notifications are muted: " + settings.notification.mute)

    //var

    $scope.notifications = [];
    $ionicPlatform.ready(function () {
      var deviceInformation = ionic.Platform.device();
      var isWebView = ionic.Platform.isWebView();

      //console.warn(deviceInformation)


      if (isWebView) {
        //console.warn('not mobile')
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
        //$scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
      if (ionic.Platform.isAndroid()) {
        if (notification.event == 'registered') {
          uploadRegID(notification.regid, "android")
        } else {
          //displayNotification(notification);
        }
        //console.log(notification.regid)
        //handleAndroid(notification);
      }
      else if (ionic.Platform.isIOS()) {
        //handleIOS(notification);
        $scope.$apply(function () {
          $scope.notifications.push(JSON.stringify(notification.alert));
        })
      }


    });

    function displayNotification(notification) {
      //debugger
      $cordovaLocalNotification.schedule({
        id: 1,
        title: notification.title,
        text: notification.message,
        //data: {
        //  customProperty: 'custom value'
        //}
      }).then(function (result) {
        // ...
      });

    }


    //function handleAndroid(notification) {
    //  // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
    //  //             via the console fields as shown.
    //  console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
    //  if (notification.event == "registered") {
    //    $scope.regId = notification.regid;
    //    storeDeviceToken("android");
    //  }
    //  else if (notification.event == "message") {
    //    $cordovaDialogs.alert(notification.message, "Push Notification Received");
    //    $scope.$apply(function () {
    //      $scope.notifications.push(JSON.stringify(notification.message));
    //    })
    //  }
    //  else if (notification.event == "error")
    //    $cordovaDialogs.alert(notification.msg, "Push notification error event");
    //  else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
    //}


  });


//.controller('pushCtrl', function($scope, $rootScope, $ionicUser, $ionicPush) {
//  console.log("hello push controller here");
//
//  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
//    //alert('Success: ' + data.token);
//    console.log('Got token: ' + data.token, data.platform);
//  })
//
//  function identifyUser() {
//    var user = $ionicUser.get();
//
//    if (!user.user_id) {
//      user.user_id = $ionicUser.generateGUID();
//    }
//    var data = JSON.parse(window.localStorage.auth)
//
//    angular.extend(user, {
//      name: data.username,
//      image: 'http://www.gravatar.com/avatar/' + data.gravatar
//    });
//
//    $ionicUser.identify(user).then(function() {
//      $scope.identified = true;
//      //console.log("identified");
//      console.log('name: ' + user.name + " ---id " + user.user_id)
//      registerPush();
//    });
//
//  }
//
//  identifyUser();
//
//
//  function registerPush() {
//    $ionicPush.register({
//      canShowAlert: true,
//      canSetBadge: true,
//      canPlaySound: true,
//      canRunActionsOnWake: true,
//      onNotification: function(notification) {
//        //displayNotification(notification);
//        return true;
//      }
//    })
//  }
//
//  function displayNotification(data) {
//    var alarmTime = new Date();
//    alarmTime.setMinutes(alarmTime.getMinutes() + 1);
//    $cordovaLocalNotification.add({
//      id: "1234",
//      date: alarmTime,
//      message: "This is a message",
//      title: "This is a title",
//      autoCancel: true,
//      sound: null
//    }).then(function () {
//      console.log("The notification has been set");
//    });
//  }
//
//
//});
