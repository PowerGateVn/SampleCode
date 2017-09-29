angular.module('starter.controllers')
        .factory('pushNotificationService', pushNotificationService);

function pushNotificationService($rootScope, $http, $state) {
    var service = {
        registPushNotification: registPushNotification
    };
    return service;

    //Register PushNotification
    function registPushNotification(user) {
        //alert(JSON.stringify(user));
        if (window.cordova) {
            var pushNotification;
            function doRegisterPushNotification() {
                try {
                    //alert("Do register");
                    pushNotification = window.plugins.pushNotification;

                    if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
                        //alert("Do register android");
                        pushNotification.register(
                        registerPushNotificationSuccessHandler,
                        registerPushNotificationErrorHandler,
                        {
                            "senderID": "234857729687",
                            "ecb": "window.onNotification"
                        });
                    } else if (device.platform == 'blackberry10') {
                        pushNotification.register(
                        registerPushNotificationSuccessHandler,
                        registerPushNotificationErrorHandler,
                        {
                            invokeTargetId: "replace_with_invoke_target_id",
                            appId: "replace_with_app_id",
                            ppgUrl: "replace_with_ppg_url", //remove for BES pushes
                            ecb: "pushNotificationHandler",
                            simChangeCallback: replace_with_simChange_callback,
                            pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                            launchApplicationOnPush: true
                        });
                    } else {
                        pushNotification.register(
                        registerPushNotificationTokenHandler,
                        registerPushNotificationErrorHandler,
                        {
                            "badge": "true",
                            "sound": "true",
                            "alert": "true",
                            "ecb": "window.onNotificationAPN"
                        });
                    }
                }
                catch (err) {
                    console.log(err)
                }
            }
            function registerPushNotificationSuccessHandler(result) {
                //alert('device token = ' + result);
            }
            function registerPushNotificationErrorHandler(error) {
                //alert('error = ' + error);
            }
            function registerPushNotificationTokenHandler(result) {
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
                //alert('device token = ' + result);
                if (result) {
                    var url = URL_API + 'pushnotification.php?devicetoken=' + result + '&os=iOS&l=' + user.token + '&e=' + user.Id + '&t=' + user.loginType;
                    //alert(url);
                    $.get(url);
                }
            }
            // Android and Amazon Fire OS
            window.onNotification = function (e) {
                //alert(JSON.stringify(e));
                switch (e.event) {
                    case 'registered':
                        if (e.regid.length > 0) {
                            //alert("regID = " + e.regid);
                            if (e.regid.length > 0) {
                                var url = URL_API + 'pushnotification.php?devicetoken=' + e.regid + '&os=Android&l=' + user.token + '&e=' + user.Id + '&t=' + user.loginType;
                                //alert(url);
                                $.get(url);
                            }
                        }
                        break;

                    case 'message':
                        // if this flag is set, this notification happened while we were in the foreground.
                        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                        if (e.foreground) {
                            // on Android soundname is outside the payload.
                            // On Amazon FireOS all custom attributes are contained within payload
                            var soundfile = e.soundname || e.payload.sound;
                            // if the notification contains a soundname, play it.
                            var my_media = new Media("/android_asset/www/" + soundfile);
                            my_media.play();
                        }
                        else {  // otherwise we were launched because the user touched a notification in the notification tray.
                            $state.go("app.Notif", {}, { reload: true });
                            if (e.coldstart) {
                            }
                            else {
                            }
                        }
                        break;

                    case 'error':
                        break;

                    default:
                        break;
                }
            }
            // iOS
            window.OnNotificationAPN = function (event) {
            $state.go("app.Notif", {}, { reload: true });
                if (event.alert) {
                    navigator.notification.alert(event.alert);
                    if (event.foreground != 1) {

                    }
                }

                if (event.sound) {
                    var snd = new Media(event.sound);
                    snd.play();
                }

                if (event.badge) {
                    pushNotification.setApplicationIconBadgeNumber(registerPushNotificationSuccessHandler, registerPushNotificationErrorHandler, event.badge);
                }
               
            }
            doRegisterPushNotification();
        }
    }
}