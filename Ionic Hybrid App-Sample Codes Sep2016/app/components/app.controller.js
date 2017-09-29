angular.module('starter.controllers', ['ionic']);
angular.module('starter.controllers')
    .controller('AppCtrl', AppCtrl)
    .directive('activemenu', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var menuitem = element.find('li');
                $('.nav.nav-right').find('li:first-child').addClass('activeColor');
                menuitem.click(function () {
                    $('.nav.nav-right').find('li').removeClass('activeColor');
                    $(this).addClass('activeColor');
                })
            }
        }
    });
function AppCtrl($scope, $timeout, $ionicPlatform, $ionicNavBarDelegate, $interval, $rootScope, $state, $stateParams, $log, $http, $ionicPopup, $ionicHistory, $ionicSideMenuDelegate, $ionicLoading, $ionicModal, apiService, accountService, commonService, pushNotificationService) {
    var vm = this;
    if (localStorage.getItem(LOCAL_STORAGE_KEY.Account) != null) {
        $rootScope.user = accountService.getUserAccount();
        if (($rootScope.user.fname == null || $rootScope.user.fname === "") && ($rootScope.user.name == null || $rootScope.user.name === "")) {
            $rootScope.user.displayName = $rootScope.user.nname;
        }
        else {
            $rootScope.user.displayName = $rootScope.user.fname + " " + $rootScope.user.name;
        }
    }

    //Check token and init
    if (localStorage.token == null) {
        localStorage.token = accountService.getLocalId();
    }
    //Check Sent Data Login?
    $rootScope.isSentDataLogin = false;
    // Setting
    if (localStorage.Setting == null) {
        $rootScope.setting = {
            activeNotification: true,
            activeGeoLocation: true
        }
        commonService.setStatus($rootScope.setting);
    } else {
        $rootScope.setting = commonService.getStatus();
    }
    vm.changeStatus = function (changeType) {
        commonService.setStatus($rootScope.setting);
        if (!$rootScope.setting.activeNotification) {
            $rootScope.numNotification = 0;
        }
        // Todo: get current location if active
        if (changeType == 2 && $rootScope.setting.activeGeoLocation) {
            $rootScope.getGeolocation();
        }
    }
    $rootScope.data = {
        canDrag: false
    };

    if (ionic.Platform.isIPad() || ionic.Platform.isIOS() || ionic.Platform.isAndroid() || ionic.Platform.isWindowsPhone()) {
        $rootScope.data = {
            canDrag: true
        };
    }
    if ($rootScope.loginData == null) {
        $rootScope.loginData = {};
    }

    //Logout
    vm.logout = function () {
        vm.accLogoutData = {
            t: $rootScope.user.loginType,
            e: $rootScope.user.Id,
            l: $rootScope.user.token
        }
        function succ(response) {
            //Remove true when connect api2
            if (response.status === RESPONSE_STATUS_SUCCESS) {
                if ($rootScope.user.loginType === LOGIN_TYPE.Google && !window.cordova) {
                    $.ajax({
                        type: 'GET',
                        url: 'https://accounts.google.com/o/oauth2/revoke?token=' + $rootScope.user.token,
                        async: false,
                        contentType: 'application/json',
                        dataType: 'jsonp',
                        success: function (result) {
                            console.log('Logout google success!');
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                }
                if ($rootScope.user.loginType === LOGIN_TYPE.Facebook && !window.cordova) {
                    facebookConnectPlugin.logout(function () { }, function () { });
                }
                $rootScope.user = null;
                $rootScope.loginData = {};
                $rootScope.notificationLog = [];
                $rootScope.numNotification = 0;
                $rootScope.stateData = null;
                $rootScope.isSentDataLogin = false;
                localStorage.removeItem(LOCAL_STORAGE_KEY.Account);
                localStorage.removeItem(LOCAL_STORAGE_KEY.NotificationLog);
                $interval.cancel($rootScope.countNotification);
                localStorage.removeItem('Setting');
                localStorage.removeItem('token');
                localStorage.token = accountService.getLocalId();
                $state.go('app.Search');
            } else {
                $ionicPopup.alert({
                    title: RESPONSE_ERROR,
                    template: RESPONSE_ERROR
                });
            }
        }
        function err() {
            $ionicPopup.alert({
                title: RESPONSE_ERROR,
                template: RESPONSE_ERROR_TEMP
            });
        }
        apiService.unlink(vm.accLogoutData, succ, err);
    };
    vm.help = help;
    vm.gotoStore = gotoStore;

    function help() {
        $state.go('app.Help');
    }

    function gotoStore() {
        if (ionic.Platform.isAndroid()) {
            window.open("market://details?id=com.docotop");
        }
        if (ionic.Platform.isIOS()) {
            window.open("itms-apps://itunes.apple.com/us/app/docotop/id1015215264?mt=8");
        }
    };

    //Modal

    $rootScope.errorShow = function () {
        $scope.openModal();
    };
    $rootScope.errorHide = function () {
        $scope.closeModal();
        $rootScope.class = "";
    }
    //error screen
    $ionicModal.fromTemplateUrl('app/viewrating/errorscreen.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalError = modal;
    });
    $ionicModal.fromTemplateUrl('app/viewrating/empty-errorscreen.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalEmptyError = modal;
    });
    $rootScope.errorInputShow = function () {
        $scope.modalEmptyError.show();
    };
    $rootScope.errorInputHide = function () {
        $scope.modalEmptyError.hide();
        $rootScope.class = "";

    }
    $scope.openModal = function () {
        $scope.modalError.show();
    };
    $scope.closeModal = function () {
        $scope.modalError.hide();
    };
    //Required pop-up
    $ionicModal.fromTemplateUrl('app/accounts/authentication.required.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalForced = modal;
    });
    $rootScope.forcedShow = function () {
        $scope.modalForced.show();
    };
    $rootScope.forcedHide = function () {
        $scope.modalForced.hide();
    };
    //Forced pop-up
    $ionicModal.fromTemplateUrl('app/accounts/forced-popup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalForcedPopup = modal;
    });
    $rootScope.modalForcedPopupShow = function () {
        $scope.modalForcedPopup.show();
    };
    $rootScope.modalForcedPopupHide = function () {
        $scope.modalForcedPopup.hide();
    };

    //Init popup login
    if (!window.cordova) {
        $ionicModal.fromTemplateUrl('app/accounts/popup-login.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modalLogin) {
            $scope.modalLogin = modalLogin;
        });
    }
    // liked popup
    $ionicModal.fromTemplateUrl('app/search/liked.popup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalLiked = modal;
    });
    $rootScope.showLikedPopup = function () {
        $scope.modalLiked.show();
        $timeout(function () { $scope.modalLiked.hide() }, 3000);
    }

    //Go to Login Screen if mobile, else Login Popup
    vm.gotoLogin = function () {
        $rootScope.forcedHide();
        if (!window.cordova) {
            $scope.modalLogin.show();
            RenderGoogleAuth();
            $rootScope.closePopUpLoginModal = function () {
                $scope.modalLogin.hide();
            }
        } else {
            $state.go("app.Login");
        }
    }
    function RenderGoogleAuth() {
        if (!window.cordova && $rootScope.RenderedGoogleLoginButtonPopup == null) {
            $rootScope.RenderedGoogleLoginButtonPopup = true;
            gapi.signin.render('googleLoginButtonPopup', {
                'callback': function (authResult) { $rootScope.onGoogleSignInCallback(authResult) },
                'clientid': GOOGLE_API_CLIENT_ID,
                'cookiepolicy': 'single_host_origin',
                'requestvisibleactions': 'http://schema.org/AddAction',
                'scope': 'https://www.googleapis.com/auth/plus.login email'
            });
        }
    }
    $rootScope.onGoogleSignInCallback = function (authResult) {
        gapi.client.load('plus', 'v1', function () {
            if (authResult['access_token']) {
                var request = gapi.client.plus.people.get({ 'userId': 'me' });
                request.execute(function (profile) {
                    if (profile) {
                        var params = {
                            t: LOGIN_TYPE.Google,
                            e: profile.id,
                            l: authResult['access_token']
                        };
                        function succ(response) {
                            $rootScope.user = response;
                            $rootScope.user.Id = params.e;
                            $rootScope.user.token = params.l;
                            $rootScope.user.loginType = LOGIN_TYPE.Google;
                            if (($rootScope.user.fname == null || $rootScope.user.fname === "") && ($rootScope.user.name == null || $rootScope.user.name === "")) {
                                $rootScope.user.displayName = $rootScope.user.nname;
                            }
                            else {
                                $rootScope.user.displayName = $rootScope.user.fname + " " + $rootScope.user.name;
                            }
                            accountService.setUserAccount($rootScope.user);
                            $scope.modalLogin.hide();
                        }
                        function err(response) {
                            $ionicPopup.alert({
                                title: RESPONSE_ERROR,
                                template: RESPONSE_ERROR_TEMP
                            });
                        }
                        apiService.authconfirm(params, succ, err);
                    } else {
                        $ionicPopup.alert({
                            title: "Google Authentication Failed",
                            template: RESPONSE_ERROR_TEMP
                        });
                    }
                });
            }
        });
    };
    vm.gotoCGU = function () {
        $rootScope.closePopUpLoginModal();
        $state.go("app.CGU");
    }
    vm.checkEmail = function () {
        var pattCheckEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        return pattCheckEmail.test($rootScope.loginData.email);
    }

    //Facebook Login
    $rootScope.facebookLogin = function () {
        if (!window.cordova) {
            facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
        }
        facebookConnectPlugin.getLoginStatus(function (response) {
            if (response && response.status === 'connected') {
                facebookConnectPlugin.logout(doLoginFacebook, doLoginFacebook);
            }
            else {
                doLoginFacebook();
            }
        });

        function doLoginFacebook() {
            facebookConnectPlugin.login(["public_profile,email,user_friends"], fbLoginSuccess, fbLoginError);

            function fbLoginSuccess(response) {
                if (response.authResponse != null && response.authResponse.userID != null && response.authResponse.accessToken != null) {
                    //alert(response.authResponse.userID);
                    //alert(response.authResponse.accessToken);
                    var params = {
                        t: LOGIN_TYPE.Facebook,
                        e: response.authResponse.userID,
                        l: response.authResponse.accessToken
                    };

                    function succ(response) {
                        $rootScope.user = response;
                        $rootScope.user.token = params.l;
                        $rootScope.user.Id = params.e;
                        $rootScope.user.loginType = LOGIN_TYPE.Facebook;
                        if (($rootScope.user.fname == null || $rootScope.user.fname === "") && ($rootScope.user.name == null || $rootScope.user.name === "")) {
                            $rootScope.user.displayName = $rootScope.user.nname;
                        }
                        else {
                            $rootScope.user.displayName = $rootScope.user.fname + " " + $rootScope.user.name;
                        }
                        accountService.setUserAccount($rootScope.user);
                        if (!window.cordova) {
                            $scope.modalLogin.hide();
                        }
                        else {
                            pushNotificationService.registPushNotification($rootScope.user);
                            if ($rootScope.stateReadmore != null) {
                                $state.go($rootScope.stateReadmore.url, { adviceId: $rootScope.stateReadmore.param });
                                $rootScope.stateReadmore = undefined;
                                $ionicNavBarDelegate.showBar(true);
                            } else if ($rootScope.stateData != null && $rootScope.stateData.url != 'app.Search') {
                                $state.go($rootScope.stateData.url, { proId: $rootScope.stateData.param });
                                $rootScope.stateData = undefined;
                            } else {
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go("app.Search");
                            }

                        }
                    }
                    function err(response) {
                        //$ionicPopup.alert({
                        //    title: RESPONSE_ERROR,
                        //    template: RESPONSE_ERROR_TEMP
                        //});
                    }
                    apiService.authconfirm(params, succ, err);
                } else {
                    //$ionicPopup.alert({
                    //    title: "Facebook Authentication Failed",
                    //    template: RESPONSE_ERROR_TEMP
                    //});
                }
            }

            function fbLoginError(response) {
                //$ionicPopup.alert({
                //    title: "Facebook Authentication Failed",
                //    template: RESPONSE_ERROR_TEMP
                //});
            }
        }
    };
    //Google Login
    $rootScope.googleLogin = function () {
        if (window.cordova) {
            window.plugins.googleplus.login({
                'scopes': 'profile email openid', // optional space-separated list of scopes, the default is sufficient for login and basic profile info
                'offline': true // optional and required for Android only - if set to true the plugin will also return the OAuth access token, that can be used to sign in to some third party services that don't accept a Cross-client identity token (ex. Firebase)
            },
            function (obj) {
                if (obj) {
                    //alert(JSON.stringify(obj));
                    var l = '';
                    if (ionic.Platform.isAndroid()) {
                        l = obj.oauthToken;
                    }
                    else if (ionic.Platform.isIOS()) {
                        l = obj.accessToken;
                    }
                    var params = {
                        t: LOGIN_TYPE.Google,
                        e: obj.userId,
                        l: l
                    };
                    //alert(JSON.stringify(params));
                    function succ(response) {
                        //alert(JSON.stringify(response));
                        $rootScope.user = response;
                        $rootScope.user.token = params.l;
                        $rootScope.user.Id = params.e;
                        $rootScope.user.loginType = LOGIN_TYPE.Google;
                        if (($rootScope.user.fname == null || $rootScope.user.fname === "") && ($rootScope.user.name == null || $rootScope.user.name === "")) {
                            $rootScope.user.displayName = $rootScope.user.nname;
                        }
                        else {
                            $rootScope.user.displayName = $rootScope.user.fname + " " + $rootScope.user.name;
                        }
                        accountService.setUserAccount($rootScope.user);
                        if (!window.cordova) {
                            $scope.modalLogin.hide();
                        }
                        else {
                            pushNotificationService.registPushNotification($rootScope.user);
                            if ($rootScope.stateReadmore != null) {
                                $state.go($rootScope.stateReadmore.url, { adviceId: $rootScope.stateReadmore.param });
                                $rootScope.stateReadmore = undefined;
                                $ionicNavBarDelegate.showBar(true);
                            } else if ($rootScope.stateData != null && $rootScope.stateData.url != 'app.Search') {
                                $state.go($rootScope.stateData.url, { proId: $rootScope.stateData.param });
                                $rootScope.stateData = undefined;
                            } else {
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go("app.Search");
                            }
                        }
                    }
                    function err(response) {
                        //$ionicPopup.alert({
                        //    title: RESPONSE_ERROR,
                        //    template: RESPONSE_ERROR_TEMP
                        //});
                    }
                    apiService.authconfirm(params, succ, err);
                } else {
                    //$ionicPopup.alert({
                    //    title: "Google Authentication Failed",
                    //    template: RESPONSE_ERROR_TEMP
                    //});
                }
            },
            function (msg) {
                //alert('error: ' + msg);
            });
        }
    };

    //Login in WebPlatform
    //Success Call Authconfirm
    $rootScope.successCallAuthconfirm = function (e, l) {
        vm.dataSuccessCall = {
            t: 'ec',
            e: e,
            l: l
        }

        function succ(response) {
            if (response.status === RESPONSE_STATUS_SUCCESS) {
                $rootScope.user = response;
                $rootScope.user.loginType = LOGIN_TYPE.Email;
                $rootScope.user.token = vm.dataSuccessCall.l;
                $rootScope.user.Id = vm.dataSuccessCall.e;
                if (($rootScope.user.fname == null || $rootScope.user.fname === "") && ($rootScope.user.name == null || $rootScope.user.name === "")) {
                    $rootScope.user.displayName = $rootScope.user.nname;
                }
                else {
                    $rootScope.user.displayName = $rootScope.user.fname + " " + $rootScope.user.name;
                }
                accountService.setUserAccount($rootScope.user);
                commonService.setStatus($rootScope.setting);
                pushNotificationService.registPushNotification($rootScope.user);
                $rootScope.getOldNotification = true; // add code by Doan
                $rootScope.countNotification();   // add code by Doan               
            }
            else {
                $ionicPopup.alert({
                    title: RESPONSE_ERROR,
                    template: RESPONSE_ERROR_TEMP
                });
            }

        }
        function err(response) {
            $ionicPopup.alert({
                title: RESPONSE_ERROR,
                template: RESPONSE_ERROR_TEMP
            });
        }
        apiService.authconfirm(vm.dataSuccessCall, succ, err);
    }
    $rootScope.initialCallAuthconfirm = function (t, e, l) {
        vm.dataInitialCall = {
            t: t,
            e: e,
            l: l
        }
        function succ(response) {
            $ionicModal.fromTemplateUrl('app/accounts/authentication.confirm.modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modalAuthen) {
                $scope.modalAuthen = modalAuthen;
                $scope.modalAuthen.show();
            });
            $rootScope.isSentDataLogin = true;
            vm.closeModal = function () {
                $scope.modalAuthen.hide();
                if (response.status === RESPONSE_STATUS_SUCCESS) {
                    $rootScope.user = response;
                    $rootScope.user.loginType = LOGIN_TYPE.Email;
                    $rootScope.user.token = vm.dataInitialCall.l;
                    $rootScope.user.Id = vm.dataInitialCall.e;
                    if (($rootScope.user.fname == null || $rootScope.user.fname === "") && ($rootScope.user.name == null || $rootScope.user.name === "")) {
                        $rootScope.user.displayName = $rootScope.user.nname;
                    }
                    else {
                        $rootScope.user.displayName = $rootScope.user.fname + " " + $rootScope.user.name;
                    }

                    accountService.setUserAccount($rootScope.user);
                    commonService.setStatus($rootScope.setting);

                }
                else {
                    $rootScope.checkAuthen(t, e, l);
                }
                if (ionic.Platform.isAndroid || ionic.Platform.isIOS) {
                    if ($rootScope.stateData == null) {
                        $state.go("app.Search");
                    } else {
                        if ($rootScope.stateData.url == 'app.Search') {
                            $state.go("app.Search");
                            $rootScope.stateData = undefined
                        } else if ($rootScope.stateReadmore != null) {
                            $state.go($rootScope.stateReadmore.url, { adviceId: $rootScope.stateReadmore.param });
                            $rootScope.stateReadmore = undefined;
                            $ionicNavBarDelegate.showBar(true);
                        } else {
                            $state.go($rootScope.stateData.url, { proId: $rootScope.stateData.param });
                            $ionicNavBarDelegate.showBar(true);
                        }
                    }

                }
            };
        }
        function err(response) {
            $ionicPopup.alert({
                title: RESPONSE_ERROR,
                template: RESPONSE_ERROR_TEMP
            });
        }
        apiService.authconfirm(vm.dataInitialCall, succ, err);
    }
    $scope.loginPopUpUser = function () {
        vm.postDataEmail = {
            t: LOGIN_TYPE.Email,
            e: $rootScope.loginData.email,
            l: localStorage.token
        };
        if (vm.checkEmail()) {
            $rootScope.initialCallAuthconfirm(vm.postDataEmail.t, vm.postDataEmail.e, vm.postDataEmail.l);
            $rootScope.closePopUpLoginModal();
        } else {
            if ($rootScope.loginData.email === '' || $rootScope.loginData.email == null) {
                $rootScope.errorShow();
            } else {
                $rootScope.errorInputShow();
            }
        }
    }

    $rootScope.checkAuthen = function (loginType, id, token) {
        var paramCheck = {
            t: loginType,
            e: id,
            l: token
        }
        if (loginType === LOGIN_TYPE.Facebook || loginType === LOGIN_TYPE.Google) {
            $rootScope.checkAuthenInterval(loginType, id, token, 15);
        } else {
            $rootScope.checkAuthenInterval(loginType, id, token, 2);
        }
    }

    $rootScope.checkAuthenInterval = function (loginType, email, token, frequency) {
        var paramCheck = {
            t: loginType,
            e: email,
            l: token
        }
        var counttime = 1;
        var intervalCheck = $interval(function () {
            function succ(response) {
                $rootScope.disableLoading = false;
                //response.status = 'success';
                counttime++;
                console.log(vm.counttime);
                if (response.status == RESPONSE_STATUS_SUCCESS) {
                    if (frequency == 2) {
                        $rootScope.successCallAuthconfirm(email, token);
                        $interval.cancel(intervalCheck);
                        $scope.checkAuthenInterval(loginType, email, token, 15);
                    }
                    $scope.authcheck15sec(loginType, email, token);
                } else {
                    if (frequency == 2) {
                        if (counttime * 2 >= 300) {
                            $interval.cancel(intervalCheck);
                            $scope.checkAuthenInterval(loginType, email, token, 15);
                        }
                    }
                }
            }
            function err(response) {
                $rootScope.disableLoading = false;
                $ionicPopup.alert({
                    title: RESPONSE_ERROR,
                    template: RESPONSE_ERROR_TEMP
                });
            }
            $rootScope.disableLoading = true;
            apiService.authcheck(paramCheck, succ, err);
        }, frequency * 1000);
    }
    // Todo: get new and update readed Notification
    // Todo: update readed notification
    $rootScope.saveNotifLog = function () {
        if ($rootScope.localNotificationLog != null && $rootScope.localNotificationLog.length > 0) {
            for (var i = 0; i < $rootScope.localNotificationLog.length; i++) {
                $rootScope.localNotificationLog[i].isReaded = true;
            }
            localStorage.setItem(LOCAL_STORAGE_KEY.NotificationLog, JSON.stringify($rootScope.localNotificationLog));
            $rootScope.numNotification = 0;
        }
    }

    // Todo: count number Noitfication not read
    $rootScope.numNotification = 0;
    function successNotification(response) {
        $rootScope.disableLoading = false;
        if (response.status === RESPONSE_STATUS_SUCCESS) {
            var newNotification = new Array();
            var oldNotification = new Array();
            var localNotificationLog = window.localStorage.getItem(LOCAL_STORAGE_KEY.NotificationLog);
            if (localNotificationLog != null) {
                oldNotification = JSON.parse(localNotificationLog);
                if (oldNotification.length > 20) {
                    oldNotification = oldNotification.splice(19, oldNotification.length - 20);
                }

            } else if ($rootScope.getOldNotification == true) {
                vm.dataForGetOldNotif = {
                    t: $rootScope.user.loginType,
                    e: $rootScope.user.Id,
                    l: $rootScope.user.token,
                    idx: 1
                }

                function successOldNotification(responseOld) {
                    $rootScope.disableLoading = false;
                    if (responseOld.status == RESPONSE_STATUS_SUCCESS) {
                        for (var j = responseOld.results.length - 1; j >= 0 ; j--) {
                            var notifiEntity = {
                                id: responseOld.results[j].id,
                                ct: responseOld.results[j].ct,
                                moreurl: responseOld.results[j].moreurl,
                                isReaded: true
                            }
                            oldNotification.push(notifiEntity);
                        }
                    }
                }

                function errorOldNotification() {
                    $rootScope.disableLoading = false;
                }
                $rootScope.disableLoading = true;
                apiService.notif(vm.dataForGetOldNotif, successOldNotification, errorOldNotification);
                $rootScope.getOldNotification = undefined;
            }
            $timeout(function () {
                if (response.results != null) {
                    for (var i = 0 ; i <= response.results.length - 1; i++) {
                        var notifiEntity = {
                            id: response.results[i].id,
                            ct: unescape(response.results[i].ct),
                            moreurl: response.results[i].moreurl,
                            isReaded: false
                        }
                        newNotification.splice(0, 0, notifiEntity);
                    }
                }
                $rootScope.localNotificationLog = new Array();
                $rootScope.localNotificationLog = newNotification.concat(oldNotification);
                var count = 0;
                for (var k = 0; k < $rootScope.localNotificationLog.length; k++) {
                    $rootScope.localNotificationLog[k].ct = unescape($rootScope.localNotificationLog[k].ct);
                    if ($rootScope.localNotificationLog[k].isReaded == false) {
                        count++;
                    }
                }
                $rootScope.numNotification = count;
                localStorage.setItem(LOCAL_STORAGE_KEY.NotificationLog, JSON.stringify($rootScope.localNotificationLog));
            }, 3000);
            if ($rootScope.localNotificationLog.length > 0 && $rootScope.localNotificationLog[0].isReaded == false) {
                $timeout($rootScope.saveNotifLog, 8000);
            }
        }
    }
    function errorNotification() {
        $rootScope.disableLoading = false;
        //$rootScope.errorShow();
    }
    $rootScope.countNotification = function () {
        if ($rootScope.user != null) {
            vm.dataForGetNotif = {
                t: $rootScope.user.loginType,
                e: $rootScope.user.Id,
                l: $rootScope.user.token
            }
            if ($rootScope.setting.activeNotification) {
                $rootScope.disableLoading = true;
                apiService.notif(vm.dataForGetNotif, successNotification, errorNotification);
            } else {
                $rootScope.numNotification = 0;
            }
        }
    }
    if ($rootScope.setting.activeNotification) {
        if ($rootScope.localNotificationLog == null) {
            $rootScope.numNotification = 0;
            $rootScope.localNotificationLog = new Array();
        }
        $rootScope.countNotification();
        $interval($rootScope.countNotification, 120000);
    }

    // share fb, gg, email
    $rootScope.ShareToFacebook = function (link, picture, title, description) {
        try {
            function shareToFacebook() {
                facebookConnectPlugin.showDialog(
                 {
                     method: 'feed',
                     link: link,
                     picture: picture,
                     name: title,
                     description: description
                 },
                 function (response) { },
                 function (response) { });
            }
            if ($rootScope.user == null || $rootScope.user.loginType != LOGIN_TYPE.Facebook) {
                if (!window.cordova) {
                    facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
                }

                var fbLoginSuccess = function (userData) {
                    shareToFacebook();
                }
                facebookConnectPlugin.login(["public_profile"],
                    fbLoginSuccess,
                    function (error) {
                        //alert("" + error);
                    }
                );
            }
            else {
                shareToFacebook();
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }
    vm.share = function (shareType) {
        if ($rootScope.user != null && $rootScope.user.isPro === ACCOUNT_TYPE.PROFESSONAL) {
            var params = {
                t: $rootScope.user.loginType,
                e: $rootScope.user.Id,
                l: $rootScope.user.token,
                did: $rootScope.user.did
            }
            function successExtra(response) {
                vm.proDetailFull = response.results;
                vm.proDetailFull.imgurl = URL_IMG_DOCTOR + vm.proDetailFull.imgurl + PHOTO_TYPE;
                vm.dataShareSheetFbAndGg = {
                    link: SHARE_LINK.ShareSheet + $rootScope.user.did,
                    title: "Vous avez partagé le profil d’un professionnel de santé : " + vm.proDetailFull.first + " " + vm.proDetailFull.second,
                    description: 'Cliquez sur le lien pour plus de détails. ',
                    pic: vm.proDetailFull.imgurl,
                    linkShareGG: URL_API + SHARE_PROFILE + vm.proDetailFull.id
                }
                switch (shareType) {
                    case 1:
                        $rootScope.ShareToFacebook(vm.dataShareSheetFbAndGg.link, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description);
                        break;
                    case 2:
                        //if (ionic.Platform.isIOS()) {
                        //    window.plugins.socialsharing.share(vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.link);
                        //} else if (ionic.Platform.isAndroid()) {
                        //    function onSuccessGg() {
                        //        window.plugins.socialsharing.shareVia('com.google.android.apps.plus', vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.link, function () { }, function () { });
                        //    }
                        //    function onErrorGg() {
                        //        window.plugins.socialsharing.share(vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.link);
                        //    }
                        //    window.plugins.socialsharing.canShareVia('com.google.android.apps.plus', vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.link, onSuccessGg, onErrorGg);
                        //}
                        if (!window.cordova) {
                            window.open("https://plus.google.com/share?url='" + vm.dataShareSheetFbAndGg.linkShareGG + "'", '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
                        }
                        else if (ionic.Platform.isIPad()) {
                            window.open("https://plus.google.com/share?url='" + vm.dataShareSheetFbAndGg.linkShareGG + "'", '_system', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
                        }
                        else {
                            var googlePlusLink = "https://plus.google.com/share?url='" + vm.dataShareSheetFbAndGg.linkShareGG + "'";
                            window.open(googlePlusLink, '_system', '');
                        }
                        break;
                    case 3:
                        var title = "";
                        if ($rootScope.user.fname != null && $rootScope.user.fname.trim() !== "" && $rootScope.user.name != null && $rootScope.user.name.trim() !== "") {
                            title = $rootScope.user.fname + " " + $rootScope.user.name + " vous a envoyé une fiche Docotop";
                        } else {
                            title = "Votre ami vous a envoyé une fiche Docotop";
                        }
                        if (window.cordova) {
                            var messageMobile = ' Bonjour, <br/> Votre ami ' + vm.proDetailFull.first + ' ' + vm.proDetailFull.second + ' vous a recommandé une fiche. <br/> Consultez-le ici:' + vm.dataShareSheetFbAndGg.link + ' <br/> Rendez-vous vite sur DOCOTOP.COM pour consulter d’autres fiches professionnelles ! <br/> A bientôt, <br/> L’ équipe Docotop';
                            function onSuccess() {
                                window.plugins.socialsharing.shareViaEmail(messageMobile, title, null, null, null, function () { }, function () { });
                            }
                            function onError() {
                                window.plugins.socialsharing.share(messageMobile, title, null, null, function () { }, function () { });
                            }
                            window.plugins.socialsharing.canShareViaEmail(onSuccess, onError);
                        }
                        else {
                            var messageWeb = ' Bonjour, %0D%0A Votre ami ' + +vm.proDetailFull.first + ' ' + vm.proDetailFull.second + ' vous a recommandé une fiche. %0D%0A Consultez-le ici:' + vm.dataShareSheetFbAndGg.link + ' %0D%0A Rendez-vous vite sur DOCOTOP.COM pour consulter d’autres fiches professionnelles ! %0D%0A A bientôt, %0D%0A L’ équipe Docotop';
                            var mailtoLink = 'mailto:' + '' + '?subject=' + title + '&body=' + messageWeb;
                            //$('#shareMail').attr('href', mailtoLink);
                            window.open(mailtoLink, '_blank');
                        }
                        break;
                    default:
                        break;
                }
            }

            function errorExtra() {
                $rootScope.errorShow();
            }
            apiService.extra(params, successExtra, errorExtra);
        }
    }
    $ionicModal.fromTemplateUrl('app/viewrating/success.popup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.successModal = modal;
    });
    $rootScope.showSuccess = function () {
        $scope.successModal.show();
        $timeout(function () {
            $scope.successModal.hide();
        }, 1000);
    }

    //Ionic alert popup
    $rootScope.showAlertPopup = function (a) {
        $ionicPopup.alert({
            title: RESPONSE_ERROR2,
            template: a
        });
    }

    vm.goEditPro = function () {
        $rootScope.addDocService = undefined;
        $rootScope.profileNoChange = undefined;
        $rootScope.imgPro = undefined;
        $rootScope.imgProCover = undefined;
        $rootScope.specList = undefined;
        $rootScope.fileAvatar = undefined;
        $rootScope.fileCover = undefined;
        $state.go('app.Editprofile');
    }
    vm.createProfileInfo = function () {
        $rootScope.profileProCreatePro = undefined;
        $state.go('app.CreateProfileInfo');
    }
    vm.goAddParam = function () {
        $rootScope.paramedAddInfo = undefined;
        $state.go('app.ParamedsAdd');
    }
    vm.isTermAccepted = function () {
        if (navigator.appName == 'Microsoft Internet Explorer' || navigator.appName == 'Netscape') {
            if ($rootScope.loginData.isTermAccepted) {
                $rootScope.loginData.isTermAccepted = false;
            }
            else {
                $rootScope.loginData.isTermAccepted = true;
            }
        }

    }

    vm.goSearch = function () {
        $state.go('app.Search');
    }
    vm.goProfile = function () {
        $state.go('app.Profile');
    }
    vm.goParamDelete = function () {
        $state.go('app.ParamedsDelete');
    }
    vm.goNoti = function () {
        $state.go('app.Notif');

    }
    vm.goViewrating = function () {
        vm.userRatingService =
        {
            t: $rootScope.user.loginType,
            e: $rootScope.user.Id,
            l: $rootScope.user.token,
            did: $rootScope.user.did,
            idx: 0
        };
        function userAdvicesSucc(response) {
            if (response.status === RESPONSE_STATUS_SUCCESS) {
                if (response.advices != null && response.advices.length !== 0) {
                    $state.go('app.Viewrating');
                } else {
                    $state.go('app.Norating');
                }
            } else {
                $state.go("app.Norating");
            }
        }

        function userAdvicesErr() {
            $rootScope.errorShow();
        }
        apiService.useradvices(vm.userRatingService, userAdvicesSucc, userAdvicesErr);
    }
    vm.goSetting = function () {
        $state.go('app.Setting');
    }

    $scope.dataCallAPI = {
        t: "",
        e: "",
        l: ""
    };
    if ($rootScope.user != null) {
        $scope.dataCallAPI.t = $rootScope.user.loginType;
        $scope.dataCallAPI.e = $rootScope.user.Id;
        $scope.dataCallAPI.l = $rootScope.user.token;
    } else {
        $scope.dataCallAPI.t = DataForGuest.t;
        $scope.dataCallAPI.e = DataForGuest.e;
        if (localStorage.token != null) {
            $scope.dataCallAPI.l = localStorage.token;
        }
    }

    function getGeolocation() {
        $ionicPlatform.ready(function () {
            if ($rootScope.Geolocation == null && $rootScope.setting != null && $rootScope.setting.activeGeoLocation) {
                if (navigator.geolocation) {
                    function showPossition(position) {
                        $rootScope.disableLoading = false;
                        $rootScope.Geolocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                        if ($rootScope.searchInfo == null) {
                            $rootScope.searchInfo = {
                                geoActiveInfo: {
                                    lat: '',
                                    lng: ''
                                },
                                locationName: '',
                                useGeolocation: 0
                            };
                        }

                        $rootScope.searchInfo.geoActiveInfo = {
                            lat: $rootScope.Geolocation.lat,
                            lng: $rootScope.Geolocation.lng
                        }
                        $rootScope.searchInfo.locationName = "Au plus près d’ici";
                        $rootScope.searchInfo.useGeolocation = 1;
                    }

                    function showError(error) {
                        $rootScope.disableLoading = false;
                        switch (error.code) {
                            case 1:
                                {
                                    $rootScope.showAlertPopup(GEOLOCATION_ERROR_CORE1);
                                    break;
                                }
                            case 2:
                                {
                                    $rootScope.showAlertPopup(GEOLOCATION_ERROR_CORE2);
                                    break;
                                }
                            case 3:
                                {
                                    $rootScope.showAlertPopup(GEOLOCATION_ERROR_CORE3);
                                    break;
                                }
                            case error.UNKNOWN_ERROR:
                                {
                                    $rootScope.showAlertPopup(GEOLOCATION_ERROR_UNKNOWN);
                                    break;
                                }
                        }
                    }
                    $rootScope.disableLoading = true;
                    navigator.geolocation.getCurrentPosition(showPossition, showError);
                } else {
                    $rootScope.showAlertPopup('Geolocation is not supported by this browser.');
                    $rootScope.setting.activeGeoLocation = false;
                }
            }
        });

    }
    $rootScope.getGeolocation = getGeolocation;
    $rootScope.getGeolocation();
}