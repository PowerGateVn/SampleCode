angular.module('starter.controllers')
    .controller('SearchDetailsCtrl', SearchDetailsCtrl);
function SearchDetailsCtrl($ionicPlatform, $scope, $rootScope, $state, $ionicModal, $stateParams, $timeout, $http, $ionicPopup, $cordovaDevice, $cordovaSocialSharing, apiService) {
    var vm = this;
    // Blur screen when click menu left
    var elementDiv = angular.element(document.querySelector('.mask-overlay'));
    var elementDiv2 = angular.element(document.querySelector('.mask-overlay-2'));
    var elementDiv3 = angular.element(document.querySelector('.mask-overlay-3'));
    var elementBody = angular.element(document.querySelector('body'));
    $rootScope.addMaskClass = function () {

        elementDiv.toggleClass('active');
        elementDiv2.toggleClass('active');
        elementDiv3.toggleClass('active');
        //$rootScope.maskClass='overlays-details';
        //var elementDiv = angular.element(document.querySelector('.col.datax'));

        //elementBody.toggleClass('mask-overlay-bg');
    }
    $rootScope.removeMaskClass = function () {
        elementDiv.removeClass('active');
        elementDiv2.removeClass('active');
        elementDiv3.removeClass('active');
    }


    if ($rootScope.user != null) {
        vm.user = $rootScope.user;
    } else {
        vm.user = {
            loginType: DataForGuest.t,
            Id: DataForGuest.e,
            token: ''
        }
        if (localStorage.token != null) {
            vm.user.token = localStorage.token;
        }
    }
    vm.isAndroid = false;
    if (ionic.Platform.isAndroid()) {
        vm.isAndroid = true;
    }
    if (window.cordova) {
        vm.isCordova = true;
    } else {
        vm.isCordova = false;
    }
    // get Data detail for doctor from server
    var proId = $stateParams.proId;
    $rootScope.stateData = {
        url: $state.current.name,
        param: $stateParams.proId
    }

    vm.extraDoctor = {
        t: vm.user.loginType,
        e: vm.user.Id,
        l: vm.user.token,
        did: proId
    };
    vm.proDetailFull = null;
    //var loadMoreStatus = false;
    function getDayOfWeek(data) {
        var dateNow = new Date();
        switch (dateNow.getDay()) {
            case 0:
                return data.su;
            case 1:
                return data.mo;
            case 2:
                return data.tu;
            case 3:
                return data.we;
            case 4:
                return data.th;
            case 5:
                return data.fr;
            case 6:
                return data.sa;
            default:
                break;
        }
        return null;
    }
    function isNullOrWhitespace(input) {

        if (typeof input === 'undefined' || input == null) return true;

        return input.replace(/\s/g, '').length < 1;
    }
    // change rating and redirect to rate view
    vm.viewRating = function () {
        if ($rootScope.user != null) {
            vm.proDetailFull.rating = 0;
            $rootScope.dataShareRate = {
                fullName: vm.proDetailFull.first + " " + vm.proDetailFull.second,
                note_g: vm.proDetailFull.rating,
                specName: vm.proDetailFull.spec,
                avatar: vm.proDetailFull.imgurl
            };
            $state.go('app.Rating/:proId', { proId: vm.proDetailFull.id });
        } else {
            if (!$rootScope.isSentDataLogin) {
                $rootScope.forcedShow();
            } else {
                $rootScope.modalForcedPopupShow();
            }
        }
    }
    vm.setStar = function (index) {
        if ($rootScope.user != null) {
            changeStar(index);
            vm.proDetailFull.rating = index;
            if ($rootScope.user != null) {
                $rootScope.dataShareRate = {
                    fullName: vm.proDetailFull.first + " " + vm.proDetailFull.second,
                    note_g: vm.proDetailFull.rating,
                    specName: vm.proDetailFull.spec,
                    avatar: vm.proDetailFull.imgurl
                };
                $state.go('app.Rating/:proId', { proId: vm.proDetailFull.id });
            }
            else {
                $scope.modal.show();
            }
        }
        // call api to post
    };
    vm.gotoLogin = function () {
        $scope.modal.hide();
        $state.go('app.Login');
    }
    vm.closeModal = function () {
        $scope.modal.hide();
    }
    function changeStar(index) {
        for (var i = 1; i <= 5; i++) {
            angular.element(document.getElementById('ratebottom' + i)).removeClass('active');
        }
        for (var i = 1; i <= index; i++) {
            angular.element(document.getElementById('ratebottom' + i)).addClass('active');
        }
    }

    vm.getDirections = function () {
        if (vm.proDetailFull != null) {
            if (window.cordova) {
                launchnavigator.navigate([vm.proDetailFull.lat, vm.proDetailFull.long]);
            } else {
                var link = "https://maps.google.com?saddr=Current+Location&daddr=" + vm.proDetailFull.lat + "," + vm.proDetailFull.long;
                window.open(link, '_system', '');
            }
        }
    }

    // direction with geolocation
    function activeGeoLocation() {
        vm.endPoint = {
            lat: parseFloat(vm.proDetailFull.lat.toString()),
            lng: parseFloat(vm.proDetailFull.long.toString())
        };
        var map = document.getElementById('mapDetail');
        var mapOption = {
            zoom: 12,
            streetViewControl: false,
            center: new google.maps.LatLng(vm.currPoint.lat, vm.currPoint.lng),
            draggable: true,
            scrollwheel: false,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_TOP
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var detailMap = new google.maps.Map(map, mapOption);
        //Set destination, origin and travel mode.                         
        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: detailMap
        });
        var request = {
            origin: vm.currPoint,
            destination: vm.endPoint,
            travelMode: google.maps.TravelMode.DRIVING
        };
        // Pass the directions request to the directions service.

        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (resDirection, sttDirection) {
            if (sttDirection === google.maps.DirectionsStatus.OK) {
                // Display the route on the map.
                directionsDisplay.setDirections(resDirection);
            }
        });

    }
    function noActiveGeoLocation() {
        var location = {
            lat: parseFloat(vm.proDetailFull.lat.toString()),
            lng: parseFloat(vm.proDetailFull.long.toString())
        };
        var mapOption = {
            zoom: 12,
            streetViewControl: true,
            draggable: true,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_TOP
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapCanvas = document.getElementById('mapDetail');
        var detailMap = new google.maps.Map(mapCanvas, mapOption);
        detailMap.setCenter(location);
        var marker = new google.maps.Marker({
            map: detailMap,
            position: location,
            title: vm.proDetailFull.adr1
        });
    }
    function successExtra(response) {
        vm.proDetailFull = response.results;    //for API 2
        //vm.proDetailFull = response;          //for API 1
        vm.proDetailFull.id = proId;
        vm.proDetailFull.imgurl = URL_IMG_DOCTOR + vm.proDetailFull.imgurl + PHOTO_TYPE;
        if (vm.proDetailFull.prourl != undefined && vm.proDetailFull.prourl != '') {
            $('#profile_card').css({
                'background-image': 'url(' + URL_IMG_PROCOVER + vm.proDetailFull.prourl + PHOTO_TYPE + ')', 'background-size': '100%',
                'background-repeat': 'no-repeat', 'background-position': 'center center'
            });
        }
        vm.proDetailFull.prourl = URL_IMG_PROCOVER + vm.proDetailFull.prourl + PHOTO_TYPE;
        if (vm.proDetailFull !== "") {
            $rootScope.proDetailFull = vm.proDetailFull;
        }
        if (!isNullOrWhitespace(vm.proDetailFull.adr1)) {
            vm.proDetailFull.adrFull = vm.proDetailFull.adr1;
        }
        if (!isNullOrWhitespace(vm.proDetailFull.post)) {
            if (!isNullOrWhitespace(vm.proDetailFull.adr1))
                vm.proDetailFull.adrFull += ', ' + vm.proDetailFull.post;
            else vm.proDetailFull.adrFull = vm.proDetailFull.post;
        }
        if (!isNullOrWhitespace(vm.proDetailFull.city)) {
            if (vm.proDetailFull.adrFull !== "") {
                vm.proDetailFull.adrFull += ', ' + vm.proDetailFull.city;
            }
            else vm.proDetailFull.adrFull = vm.proDetailFull.city;
        }
        if (sessionStorage.currSpecName != null && sessionStorage.currSpecId != null) {
            vm.proDetailFull.SpecName = sessionStorage.currSpecName;
            vm.proDetailFull.SpecId = sessionStorage.currSpecId;
            sessionStorage.removeItem('currSpecName');
            sessionStorage.removeItem('currSpecId');
        }
        var dayNow = getDayOfWeek(vm.proDetailFull);
        if (dayNow !== "") {
            var arrayTime = dayNow.split('_');
            vm.proDetailFull.time1 = arrayTime[0];
            vm.proDetailFull.time2 = arrayTime[1];
            var strHour1 = vm.proDetailFull.time1.substring(0, 2).trim();
            var strMin1 = vm.proDetailFull.time1.substring(2, 4).trim();
            var strHour2 = vm.proDetailFull.time2.substring(0, 2).trim();
            var strMin2 = vm.proDetailFull.time2.substring(2, 4).trim();
            var hourTime1 = isNaN(parseInt(strHour1)) ? 0 : parseInt(strHour1);
            var minTime1 = isNaN(parseInt(strMin1)) ? 0 : parseInt(strMin1);
            var hourTime2 = isNaN(parseInt(strHour2)) ? 0 : parseInt(strHour2);
            var minTime2 = isNaN(parseInt(strMin2)) ? 0 : parseInt(strMin2);

            if (minTime1 === 0) {
                vm.proDetailFull.timeFormat1 = hourTime1 + 'h00';
            } else {
                vm.proDetailFull.timeFormat1 = hourTime1 + 'h' + minTime1;
            }
            if (minTime2 === 0) {
                vm.proDetailFull.timeFormat2 = hourTime2 + 'h00';
            } else {
                vm.proDetailFull.timeFormat2 = hourTime2 + 'h' + minTime2;
            };
            if (vm.proDetailFull.note == undefined) {
                vm.proDetailFull.note = 0;
            }
        }


        vm.proDetailFull.mailto = 'mailto:' + vm.proDetailFull.email + '?subject=&body=';
        if (vm.proDetailFull.note != null) {
            vm.proDetailFull.note = Math.round(vm.proDetailFull.note);
        }
        if (vm.proDetailFull.note_g == null) { vm.proDetailFull.note_g = 0; }
        else { vm.proDetailFull.note_g = Math.round(vm.proDetailFull.note_g); }
        if (vm.proDetailFull.note_d == null) { vm.proDetailFull.note_d = 0; }
        else { vm.proDetailFull.note_d = Math.round(vm.proDetailFull.note_d); }
        if (vm.proDetailFull.note_e == null) { vm.proDetailFull.note_e = 0; }
        else { vm.proDetailFull.note_e = Math.round(vm.proDetailFull.note_e); }
        if (vm.proDetailFull.advices != null && vm.proDetailFull.advices.length > 0) {
            var advicesJson = response.advices;
            var adviceIds = vm.proDetailFull.advices;
            var advicesArr = [];
            var adviceIdsFromJson = [];
            for (var k = 0; k < advicesJson.length; k++) {
                vm.currObject = {};
                $.each(advicesJson[k], function (key, value) {
                    adviceIdsFromJson.push(key);
                    advicesArr.push(value);
                });
            }
            console.log(adviceIdsFromJson);
            if (vm.proDetailFull.advices != null && advicesArr.length === vm.proDetailFull.advices.length) {
                for (var i = 0; i < vm.proDetailFull.length; i++) {
                    advicesArr[i].id = vm.proDetailFull.advices[i];
                }
            }

            if (adviceIds.length === advicesArr.length) {
                for (var j = 0; j < adviceIdsFromJson.length; j++) {
                    advicesArr[j].id = adviceIdsFromJson[j];
                }
            }
            for (var index = 0; index < advicesArr.length; index++) {
                if (advicesArr[index].note === '' || advicesArr[index].note == null || advicesArr[index].note === 'undefined') {
                    advicesArr[index].note = 0;
                }
                if (advicesArr[index].note_g === '' || advicesArr[index].note_g == null || advicesArr[index].note_g === 'undefined') {
                    advicesArr[index].note_g = 0;
                } else {
                    advicesArr[index].note_g = Math.round(advicesArr[index].note_g);
                }
                if (advicesArr[index].xtrct != null)
                    advicesArr[index].xtrct = unescape(advicesArr[index].xtrct);
                if (advicesArr[index].xtrct.toString().length > 85) {
                    advicesArr[index].xtrct = advicesArr[index].xtrct.toString().substring(0, 85) + '...';
                }

                if (advicesArr[index].pics != null && advicesArr[index].pics.length > 0) {
                    var pics = [];
                    $.each(advicesArr[index].pics, function (keypic, valuepic) {
                        $.each(valuepic, function (keyp, valuep) {
                            valuep.imgurl = URL_IMG_COMMENT + valuep.imgurl + PHOTO_TYPE;
                            pics.push(valuep);
                        });
                    });

                    advicesArr[index].pics = pics[0];
                    console.log(advicesArr[index].pics);

                }
                if ((advicesArr[index].fname == null || advicesArr[index].fname === "") && (advicesArr[index].name == null || advicesArr[index].name === "")) {
                    advicesArr[index].fullName = advicesArr[index].nick;
                } else {
                    advicesArr[index].fullName = advicesArr[index].fname + " " + advicesArr[index].name;
                }
                advicesArr[index].imgurl = URL_IMG_ADVISOR + advicesArr[index].imgurl + PHOTO_TYPE;
                if (advicesArr[index].adv_n == null || advicesArr[index].adv_n == undefined) advicesArr[index].adv_n = 0;
                if (advicesArr[index].adv_u == null || advicesArr[index].adv_u == undefined) advicesArr[index].adv_u = 0;

            }
            vm.proDetailFull.advicesInfo = advicesArr;

        } else {
            vm.proDetailFull.advicesInfo = [];
        }
        vm.dataShareSheetFbAndGg = {
            link: SHARE_LINK.ShareSheet + vm.proDetailFull.id,
            title: 'Vous avez partagé le profil d’un professionnel de santé : ' + vm.proDetailFull.first + ' ' + vm.proDetailFull.second,
            description: 'Cliquez sur le lien pour plus de détails.',
            pic: vm.proDetailFull.imgurl,
            linkShareGG: URL_API + SHARE_PROFILE + vm.proDetailFull.id
        }
        $ionicPlatform.ready(function () {
            if ($rootScope.setting != null && $rootScope.setting.activeGeoLocation) {
                if ($rootScope.Geolocation != null) {
                    vm.currPoint = {
                        lat: $rootScope.Geolocation.lat,
                        lng: $rootScope.Geolocation.lng
                    }
                    vm.activeGeolocation = $timeout(activeGeoLocation(), 1000);
                } else {
                    if (navigator.geolocation) {
                        vm.currPoint = { lat: 0, lng: 0 };
                        function showPosition(position) {
                            vm.currPoint.lat = position.coords.latitude;
                            vm.currPoint.lng = position.coords.longitude;
                            $rootScope.Geolocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                            vm.activeGeolocation = $timeout(activeGeoLocation(), 1000);
                        }
                        function showError(error) {
                            vm.noActiveGeoLocation = $timeout(noActiveGeoLocation(), 1000);
                            switch (error.code) {
                                case error.PERMISSION_DENIED:
                                    {
                                        var a = "User denied the request for Geolocation.";
                                        $rootScope.showAlertPopup(a);
                                        break;
                                    }

                                case error.POSITION_UNAVAILABLE:
                                    {
                                        var a = "Location information is unavailable.";
                                        $rootScope.showAlertPopup(a);
                                        break;
                                    }

                                case error.TIMEOUT:
                                    {
                                        var a = "The request to get user location timed out.";
                                        $rootScope.showAlertPopup(a);
                                        break;
                                    }

                                case error.UNKNOWN_ERROR:
                                    {
                                        var a = "An unknown error occurred.";
                                        $rootScope.showAlertPopup(a);
                                        break;
                                    }

                            }
                        }
                        navigator.geolocation.getCurrentPosition(showPosition, showError);
                    }
                }

            }
            else {
                vm.noActiveGeoLocation = $timeout(noActiveGeoLocation(), 1000);
            }
        });

    }
    function errorExtra() {
        $rootScope.errorShow();
    }

    apiService.extra(vm.extraDoctor, successExtra, errorExtra);
    // contact Pro and exist button back to app
    vm.sendEmail = function () {
        if (window.cordova && vm.proDetailFull != null) {
            var message = "";
            function onSuccess() {
                window.plugins.socialsharing.shareViaEmail(message, null, vm.proDetailFull.email, null, null, function () { }, function () { });
            }
            function onError() {
                window.plugins.socialsharing.share(message, null, null, null, function () { }, function () { });
            }
            window.plugins.socialsharing.canShareViaEmail(onSuccess, onError);
        } else {
            if (vm.proDetailFull != null) {
                window.open(vm.proDetailFull.mailto, '_blank');
            }
        }
    }

    $timeout(function () {
        $("#gotoWebPro").click(function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            if (vm.proDetailFull.url !== "") {
                window.open($(e.currentTarget).attr('href'), '_system', '');
            }
        });
    }, 1000);

    vm.showPopupWarning = function () {
        if (!$rootScope.isSentDataLogin) {
            $rootScope.forcedShow();

        } else {
            $rootScope.modalForcedPopupShow();

        }

    }



    vm.showClaim = function showClaim() {
        if ($rootScope.user != null) {
            $rootScope.proDetail = vm.proDetailFull;
            $rootScope.proDetail.SpecName = vm.proDetailFull.spec;
            $rootScope.fromSearchDetailToClaim = true;
            $state.go('app.Claim');
        }
    };

    // event when click tab Paramed
    vm.addNewParams = function (id) {
        if ($rootScope.proDetailFull != null) {
            vm.proDetailFull = $rootScope.proDetailFull;
        }
        // call api to post and save new Paramsed      
        vm.addDoc = {
            t: vm.user.loginType,
            e: vm.user.Id,
            l: vm.user.token,
            a: 'u',
            did: vm.proDetailFull.id
        }
        apiService.prefdocupdate(vm.addDoc, succAddDoc, errAddDoc);
        $ionicModal.fromTemplateUrl('app/viewrating/success.popup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        function succAddDoc(response) {
            if (response.status === RESPONSE_STATUS_SUCCESS) {
                $scope.modal.show();
                $timeout(function () { $scope.modal.hide(); }, 500);

            } else {
                $rootScope.errorShow();
            }
        }
        function errAddDoc() {
            $rootScope.errorShow();
        }
        $rootScope.addMaskClass();
    }
    vm.viewParamedAdd = function () {
        $rootScope.paramedAddInfo = vm.proDetailFull;
        $rootScope.fromSearchDetail = true;
        if ($rootScope.user != null && $rootScope.user.isPro == ACCOUNT_TYPE.PROFESSONAL && vm.proDetailFull.id == $rootScope.user.did) {
            $rootScope.enableEditMail = true;
        }

        $state.go("app.ParamedsAdd");
    }
    vm.viewParamedList = function () {
        $state.go('app.ParamedsDelete');
    }

    // share fb, gg, email
    vm.shareFacebook = function () {
        $rootScope.ShareToFacebook(vm.dataShareSheetFbAndGg.link, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description);
    }
    vm.shareGoogle = function () {
        //if (ionic.Platform.isIOS()) {
        //    window.plugins.socialsharing.share(vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.link);
        //} else if (ionic.Platform.isAndroid()) {
        //    function onSuccess() {
        //        window.plugins.socialsharing.shareVia('com.google.android.apps.plus', vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.link, function () { }, function () { });
        //    }
        //    function onError() {
        //        window.plugins.socialsharing.share(vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.link);
        //    }
        //    window.plugins.socialsharing.canShareVia('com.google.android.apps.plus', vm.dataShareSheetFbAndGg.title, vm.dataShareSheetFbAndGg.description, vm.dataShareSheetFbAndGg.pic, vm.dataShareSheetFbAndGg.link, onSuccess, onError);
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
    }
    vm.shareEmail = function () {
        if (vm.proDetailFull != null && vm.dataShareSheetFbAndGg != null) {
            var userShareName = "";
            var title = "";
            if ($rootScope.user != null) {
                if ($rootScope.user.fname != null && $rootScope.user.fname !== "") {
                    userShareName += $rootScope.user.fname;
                }
                if ($rootScope.user.name != null && $rootScope.user.name !== "") {
                    userShareName += " " + $rootScope.user.name;
                }
                if (userShareName.trim() === "") {
                    title = "Votre ami vous a envoyé une fiche Docotop";
                } else {
                    title = userShareName + " vous a envoyé une fiche Docotop";
                }
            } else {
                title = "Votre ami vous a envoyé une fiche Docotop";
            }
            if (window.cordova) {
                var messageMobile = ' Bonjour, <br/> Votre ami ' + userShareName + ' vous a recommandé une fiche: <br/> Consultez-le ici:' + vm.dataShareSheetFbAndGg.link + ' <br/> Rendez-vous vite sur DOCOTOP.COM pour consulter d’autres fiches professionnelles ! <br/> A bientôt, <br/> L’ équipe Docotop';
                function onSuccess() {
                    window.plugins.socialsharing.shareViaEmail(messageMobile, title, null, null, null, function () { }, function () { });
                }
                function onError() {
                    window.plugins.socialsharing.share(messageMobile, title, null, null, function () { }, function () { });
                }
                window.plugins.socialsharing.canShareViaEmail(onSuccess, onError);
            } else {
                var messageWeb = ' Bonjour, %0D%0A Votre ami ' + userShareName + ' vous a recommandé une fiche: %0D%0A Consultez-le ici:' + vm.dataShareSheetFbAndGg.link + ' %0D%0A Rendez-vous vite sur DOCOTOP.COM pour consulter d’autres fiches professionnelles ! %0D%0A A bientôt, %0D%0A L’ équipe Docotop';
                var mailtoLink = 'mailto:' + '' + '?subject=' + title + '&body=' + messageWeb;
                //$('#shareMail').attr('href', mailtoLink);
                window.location.href = mailtoLink;
            }
        }
    }

    // load more search result

    //vm.loadMoreResults = function () {
    //    if (vm.proDetailFull != null && vm.proDetailFull.advices.length - vm.proDetailFull.viewAdvices.length >= 1) {
    //        vm.proDetailFull.viewAdvices.push(vm.proDetailFull.advices[vm.proDetailFull.viewAdvices.length]);         
    //    }
    //    $scope.$broadcast('scroll.infiniteScrollComplete');
    //}
    //vm.checkLoadMoreResults = function () {
    //    if (vm.proDetailFull.viewAdvices.length < vm.proDetailFull.advices.length && loadMoreStatus) {
    //        return true;
    //    }
    //    loadMoreStatus = false;
    //    return false;
    //}

    // read more screen

    vm.viewReadMore = function (id) {
        if (id != null) {
            $state.go('app.Readmore/:adviceId', { adviceId: id });
        } else {
            $rootScope.errorShow();
        }
    }
    vm.GooglePlusWeb = false;
    if (!ionic.Platform.isAndroid() && !ionic.Platform.isIOS()) {
        vm.GooglePlusWeb = true;
    }

    vm.updateComment = function (rateValue, index) {

        if (vm.proDetailFull.advicesInfo[index].liked === true || vm.proDetailFull.advicesInfo[index].liked === false) {
            $rootScope.showLikedPopup();
        } else {
            function updateSuccess(response) {
                if (response.status === RESPONSE_STATUS_SUCCESS) {
                    for (var i = 0; i < vm.proDetailFull.advicesInfo.length; i++) {
                        if (vm.proDetailFull.advicesInfo[i].id == vm.proDetailFull.advicesInfo[index].id) {
                            if (rateValue == 0) {
                                vm.proDetailFull.advicesInfo[i].adv_n += 1;
                                vm.proDetailFull.advicesInfo[index].liked = true;
                            }
                            else if (rateValue == 1) {
                                vm.proDetailFull.advicesInfo[i].adv_u += 1;
                                vm.proDetailFull.advicesInfo[index].liked = false;
                            }
                        }
                    }

                }
            }

            function updateError() {
                $rootScope.errorShow();
            }
            if ($rootScope.user != null) {
                vm.postData = {
                    t: vm.user.loginType,
                    e: vm.user.Id,
                    l: vm.user.token,
                    adid: vm.proDetailFull.advicesInfo[index].id,
                    status: rateValue
                }
                apiService.ratecomment(vm.postData, updateSuccess, updateError);
            } else {
                $rootScope.forcedShow();
            }
        }

    }

}