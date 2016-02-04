angular.module('App.pushCtrl', [])
  .controller('pushCtrl', function ($scope, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, $ionicPlatform, $http, $cordovaLocalNotification) {
    console.log("hello from push");
    $scope.notifications = [];
    $ionicPlatform.ready(function () {
      registerDevice();
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

    $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
      console.log(JSON.stringify([notification]));
      if (ionic.Platform.isAndroid()) {
        console.log(notification.regid)
        //handleAndroid(notification);
      }
      else if (ionic.Platform.isIOS()) {
        //handleIOS(notification);
        $scope.$apply(function () {
          $scope.notifications.push(JSON.stringify(notification.alert));
        })
      }
      displayNotification(notification);
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
