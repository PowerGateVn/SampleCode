angular.module("starter.controllers")
    .controller("SearchResultCtrl", SearchResultCtrl);

function SearchResultCtrl($scope, $rootScope, $ionicSideMenuDelegate, $ionicPlatform, $state, $log, $http, $ionicLoading, $ionicPopup, $timeout, $ionicModal, $ionicScrollDelegate, apiService) {
    var vm = this;
    vm.result = [];

    $rootScope.scrollIpad = false;

    window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e) {
        if (ionic.Platform.isIPad()) {
            //alert('Keyboard height is: ' + e.keyboardHeight);
            document.body.classList.add('keyboard-open');
        }
    }
    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler(e) {
        if (ionic.Platform.isIPad()) {
            document.body.classList.remove('keyboard-open');
        }
    }

    $rootScope.stateData = {
        url: $state.current.name
    }
    vm.dataCallAPI = {
        t: "",
        e: "",
        l: ""
    };
    if ($rootScope.user != null) {
        vm.user = $rootScope.user;
        vm.dataCallAPI.t = vm.user.loginType;
        vm.dataCallAPI.e = vm.user.Id;
        vm.dataCallAPI.l = vm.user.token;
    } else {
        vm.dataCallAPI.t = DataForGuest.t;
        vm.dataCallAPI.e = DataForGuest.e;
        if (localStorage.token != null) {
            vm.dataCallAPI.l = localStorage.token;
        }
    }
    // data for search
    vm.searchData = {
        specId: 0,
        locationId: "",
        locationName: "",
        useGeolocation: 0,
        cityUrl: ""
    };
    if ($rootScope.searchInfo != null) {
        vm.searchData.specId = $rootScope.searchInfo.specId;
        vm.searchData.locationId = $rootScope.searchInfo.locationId;
        vm.searchData.locationName = $rootScope.searchInfo.locationName;
        vm.searchData.useGeolocation = $rootScope.searchInfo.useGeolocation;
        if ($rootScope.searchInfo.useGeolocation == 1) {
            vm.searchData.geoActiveInfo = {
                lat: $rootScope.searchInfo.geoActiveInfo.lat,
                lng: $rootScope.searchInfo.geoActiveInfo.lng
            };
        }
        vm.searchData.cityUrl = $rootScope.searchInfo.cityUrl;
    }
    else {
        $rootScope.searchInfo = {
            specId: 0,
            locationId: "",
            locationName: "",
            useGeolocation: 0,
            cityUrl: ""
        };
        vm.searchData.cityUrl = URL_API + "cities.php?e=" + vm.dataCallAPI.e + "&l=" + vm.dataCallAPI.l + "&t=" + vm.dataCallAPI.t + "&tc=";
        if ($rootScope.setting != null && $rootScope.setting.activeGeoLocation) {
            $ionicPlatform.ready(function () {
                if ($rootScope.setting != null && $rootScope.setting.activeGeoLocation) {
                    vm.searchData.locationId = $rootScope.searchInfo.locationId;
                    vm.searchData.locationName = $rootScope.searchInfo.locationName;
                    vm.searchData.useGeolocation = $rootScope.searchInfo.useGeolocation;
                }
            });
        }

    }

    // get list specialities
    function succSpec(response) {
        if (response.status === RESPONSE_STATUS_SUCCESS) {
            vm.listSpeciality = response.specialties;

        } else if (response.status === RESPONSE_STATUS_FAIL && response.specialties.length > 0) { // for API1
            vm.listSpeciality = response.specialties;
        } else {
            $rootScope.errorShow();
        }
    }
    function err() {
        $('.search-submit').css('background-color', '#f39323');
        $('.backdrop').removeClass('active visible backdrop-loading');
        $('.loading-container').removeClass('active visible');
        $rootScope.errorShow();
    }
    if ($rootScope.listSpeciality != null && $scope.listSpeciality.length > 0) {
        vm.listSpeciality = $rootScope.listSpeciality;
    } else {
        vm.specialties = {
            t: vm.dataCallAPI.t,
            e: vm.dataCallAPI.e,
            l: vm.dataCallAPI.l
        };
        apiService.specialities(vm.specialties, succSpec, err);
    }

    // call search when from first search view
    vm.CurrentPage = 1;
    var loadMoreStatus = false;
    vm.searchByInfo = {
        t: vm.dataCallAPI.t,
        e: vm.dataCallAPI.e,
        l: vm.dataCallAPI.l,
        c: "",
        sid: vm.searchData.specId,
        idx: vm.CurrentPage
    };
    if ($rootScope.searchInfo != null) {
        if ($rootScope.searchInfo.useGeolocation == 1) {
            vm.searchByInfo.c = $rootScope.searchInfo.geoActiveInfo.lat + "," + $rootScope.searchInfo.geoActiveInfo.lng;
        } else {
            vm.searchByInfo.tid = $rootScope.searchInfo.locationId;
        }
    }
    // search with info from search screen 
    function viewMapForDesktop() {
        var mapCanvas = document.getElementById("map");
        //var location = { lat: vm.latitude, lng: vm.longtitude };
        // Create a map object and specify the element has Id = mapDetail
        var mapOption = {
            zoom: 7,
            streetViewControl: false,
            draggable: true,
            scrollwheel: false,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_TOP
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // create a marker and set its position
        var detailMap = new google.maps.Map(mapCanvas, mapOption);

        var center = {
            lat: 48.8567,
            lng: 2.3508
        };
        var addressCenter = vm.result[1].city.toString();
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': addressCenter }, function (response, status) {

            if (status === google.maps.GeocoderStatus.OK) {
                center.lat = response[0].geometry.location.lat();
                center.lng = response[0].geometry.location.lng();
                detailMap.setCenter(center);
            }
        });
        if (vm.result != null) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < vm.result.length; i++) {
                var latLng = vm.result[i].gps.trim().split(",");

                var location = {
                    lat: parseFloat(latLng[0].toString()),
                    lng: parseFloat(latLng[1].toString())
                };

                //var location = calLatLng(vm.result[i].adr1 + ' ' + vm.result[i].city);
                var marker = new google.maps.Marker({
                    map: detailMap,
                    position: location,
                    title: vm.result[i].adr1
                });
                bounds.extend(marker.getPosition());
            }
            detailMap.setCenter(bounds.getCenter());
            detailMap.fitBounds(bounds);
            //detailMap.setZoom(detailMap.getZoom() - 1);
            //if (detailMap.getZoom() > 15) {
            //    detailMap.setZoom(15);
            //}
        }
    }
    function succSearch(response) {
        $('.backdrop').removeClass('active visible backdrop-loading');
        $('.loading-container').removeClass('active visible');
        if (response.status === RESPONSE_STATUS_SUCCESS) {
            $('.search-submit').css('background-color', '#f39323');
            for (var i = 0; i < response.results.length; i++) {
                response.results[i].imgurl = URL_IMG_DOCTOR + response.results[i].imgurl + PHOTO_TYPE;
                response.results[i].adrFull = response.results[i].post;
                if (response.results[i].city !== "") {
                    if (response.results[i].adrFull === "") {
                        response.results[i].adrFull = response.results[i].city;
                    } else {
                        response.results[i].adrFull += ', ' + response.results[i].city;
                    }
                }
                if (response.results[i].note == undefined) {
                    response.results[i].note = 0;
                }
                else {
                    response.results[i].note = Math.round(response.results[i].note);
                }
                if (response.results[i].note_g == undefined) {
                    response.results[i].note_g = 0;
                }
                else {
                    response.results[i].note_g = Math.round(response.results[i].note_g);
                }
            }

            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        if (vm.result.length == 0) {
            vm.result = response.results;
        } else {
            $.each(response.results, function (key, value) { vm.result.push(value) });
        }
        $rootScope.ProSearchResult = vm.result;
        loadMoreStatus = true;
        if (vm.searchByInfo)
            // view map for desktop
            $timeout(viewMapForDesktop, 2000);

        vm.isLoading = false;
    }
    function errSearch() {
        $('.search-submit').css('background-color', '#f39323');
        $('.backdrop').removeClass('active visible backdrop-loading');
        $('.loading-container').removeClass('active visible');
        $rootScope.errorShow();
        vm.isLoading = false;
    }
    function firstTimeSearch() {
        $('.backdrop').addClass('active visible backdrop-loading');
        $('.loading-container').addClass('active visible');
        vm.isLoading = true;
        apiService.search(vm.searchByInfo, succSearch, errSearch);
    }
    firstTimeSearch();

    // search in search result screen
    vm.searchInfo = function () {
        var currSpecId = angular.element(document.getElementById("speciality")).val();
        //if (vm.searchData.locationName == "") {
        //    if ($rootScope.Geolocation != null) {
        //        vm.searchData.useGeolocation = 1;
        //        vm.searchData.locationName = "Au plus près d’ici";
        //    }
        //}
        if (currSpecId > 0 && (vm.searchData.useGeolocation == 1 && vm.searchData.locationName === "Au plus près d’ici") || (vm.searchData.useGeolocation === 0 && vm.searchData.locationId !== "")) {
            $rootScope.searchInfo.locationId = vm.searchData.locationId;
            $rootScope.searchInfo.locationName = vm.searchData.locationName;
            $rootScope.searchInfo.useGeolocation = vm.searchData.useGeolocation;
            $rootScope.searchInfo.specId = currSpecId;
            vm.searchData.specId = currSpecId;
            if ($rootScope.searchInfo.useGeolocation == 1) {
                vm.searchByInfo.c = $rootScope.searchInfo.geoActiveInfo.lat + "," + $rootScope.searchInfo.geoActiveInfo.lng;
                vm.searchByInfo.tid = "";
            } else {
                vm.searchByInfo.tid = $rootScope.searchInfo.locationId;
                vm.searchByInfo.c = "";
            }
            vm.searchByInfo.sid = vm.searchData.specId;
            vm.CurrentPage = 1;

            vm.searchByInfo.idx = vm.CurrentPage;
            vm.isLoading = true;
            $ionicScrollDelegate.$getByHandle('resultlist').scrollTop();
            vm.result = [];
            apiService.search(vm.searchByInfo, succSearch, err);
        }
        else {
            if (vm.searchData.locationName == '') {
                $("#cityName_value").addClass("input-error");
            }
            $rootScope.errorShow();
        }

    };
    vm.viewDetail = function (id) {
        var currSpecId = angular.element(document.getElementById("speciality")).val();
        for (var i = 0; i < vm.listSpeciality.length; i++) {
            if (vm.listSpeciality[i].id == currSpecId) {
                sessionStorage.currSpecName = vm.listSpeciality[i].n;
                sessionStorage.currSpecId = vm.listSpeciality[i].id;
                break;
            }
        }
        for (var i = 0; i < vm.result.length; i++) {
            if (vm.result[i].id == id) {
                $rootScope.proDetail = vm.result[i];
                break;
            }
        }
        $state.go("app.SearchDetails/:proId", { proId: id });
    };
    vm.viewRating = function (id, event) {
        event.stopPropagation();
        if ($rootScope.user != null) {
            for (var i = 0; i < vm.result.length; i++) {
                if (vm.result[i].id == id) {
                    $rootScope.proDetail = vm.result[i];
                    $rootScope.dataShareRate = {
                        fullName: vm.result[i].first + " " + vm.result[i].second,
                        note_g: 0,
                        specName: vm.result[i].spec,
                        avatar: vm.result[i].imgurl
                    }
                    break;
                }
            }
            $state.go("app.Rating/:proId", { proId: id });
        } else {
            if (!$rootScope.isSentDataLogin) {
                $rootScope.forcedShow();
            } else {
                $rootScope.modalForcedPopupShow();
            }
        }

    };

    vm.goViewAddParamed = function () {
        if ($rootScope.user != null) {
            var addParamed = {
                sid: 0,
                sname: "",
                city: ""
            };
            var currSpecId = angular.element(document.getElementById("speciality")).val();
            var cityName = angular.element(document.getElementById("cityName")).val();
            if (currSpecId > 0) addParamed.sid = currSpecId;
            addParamed.city = cityName;
            for (var i = 0; i < vm.listSpeciality.length; i++) {
                if (vm.listSpeciality[i].id == currSpecId) {
                    addParamed.sname = vm.listSpeciality[i].n;
                    break;
                }
            }
            $rootScope.addParamedInfo = addParamed;
            $state.go("app.ParamedsAdd");
        } else {
            if (!$rootScope.isSentDataLogin) {
                $rootScope.forcedShow();
            } else {
                $rootScope.modalForcedPopupShow();
            }
        }

    };
    vm.selectedObject = function (sp) {
        if (sp != null) {
            vm.searchData.locationId = sp.originalObject.id;
            vm.searchData.locationName = sp.originalObject.n;
            vm.searchData.useGeolocation = 0;
        }
    };
    $scope.inputChangedFn = function (sp) {
        //vm.searchData.locationName = sp;
        //vm.searchData.useGeolocation = 0;
    };
    $scope.myInitialValue = function () {
        //if ($rootScope.setting.activeGeoLocation && vm.searchData != null && vm.searchData.locationName !== '') {
        return vm.searchData.locationName;
        //}
        //return '';
    };
    $scope.viewPro = function () {
        //event.stopPropagation();
        if ($scope.user != null) {
            if ($rootScope.user.isPro === ACCOUNT_TYPE.PROFESSONAL) {
                $state.go("app.Editprofile");
            }
            else {
                $state.go("app.CreateProfileInfo");
            }
        } else {
            if (!$rootScope.isSentDataLogin) {
                $rootScope.forcedShow();
            } else {
                $rootScope.modalForcedPopupShow();
            }
        }
    };

    // load more search result
    vm.loadMoreResults = function () {
        vm.searchByInfo.idx += 1;
        apiService.search(vm.searchByInfo, succSearch, err);
    }
    vm.checkLoadMoreResults = function () {
        if (vm.result.length == (vm.searchByInfo.idx * 20) && loadMoreStatus) {
            return true;
        }
        return false;
    }
    $scope.focusIn = function () {
        //vm.searchData.useGeolocation = 1;
        $("#cityName_value").removeClass("input-error");
        vm.searchData.locationId = "";
        vm.searchData.locationName = "";
        $scope.$broadcast('angucomplete-alt:clearInput', 'cityName');
    };
    $scope.defaultLocation = function () {
        if (!(vm.searchData != null && vm.searchData.useGeolocation == 0 && vm.searchData.locationId !== "" && vm.searchData.locationName !== "")) {
            $scope.$broadcast('angucomplete-alt:clearInput', 'cityName'); // code for hide dropdown result                 
            if ($rootScope.setting.activeGeoLocation && $rootScope.Geolocation != null) {
                $rootScope.searchInfo.geoActiveInfo = {
                    lat: $rootScope.Geolocation.lat,
                    lng: $rootScope.Geolocation.lng
                }
                vm.searchData.locationName = "Au plus près d’ici";
                vm.searchData.useGeolocation = 1;
                $scope.$broadcast('angucomplete-alt:changeInput', 'cityName', vm.searchData.locationName);

            }
        }

    }
    window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e) {
        var widthScreen = $(document).width();
        if (widthScreen < 1024 && widthScreen > 640) {
            $(".scroll").css('height', '1000px');
            $("#right-content").css('height', '1300px');
            $("#right-content").css("transform", 'translate3d(0px, -300px, 0px) scale(1)');
        }
    }

    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler(e) {
        var widthScreen = $(document).width();
        //if (widthScreen < 1024 && widthScreen > 640) {
        $(".scroll").css('height', '');
        $("#right-content").css('height', '');
        $("#right-content").css("transform", '');
        //}
    }

}