angular.module("starter.controllers")
    .controller("SearchCtrl", SearchCtrl);

function SearchCtrl($ionicPlatform, $scope, $rootScope, $ionicHistory, $ionicModal, $http, $ionicPopup, $state, $ionicLoading, $timeout, apiService, accountService) {
    // var vm = this;
    //state Data in order to back to right screen

    window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e) {
        var searchpage = angular.element(document.querySelectorAll('.search-page'));
        //searchpage.css("top", "-" + e.keyboardHeight + "px");
        searchpage.css("top", "-160px");
    }
    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler(e) {
        var searchpage = angular.element(document.querySelectorAll('.search-page'));
        searchpage.removeAttr("style");
        //alert(searchpage);
    }


    $scope.specialCheck = false;
    $rootScope.stateData = {
        url: $state.current.name
    }
    $scope.dataCallAPI = {
        t: "",
        e: "",
        l: ""
    };
    if ($rootScope.user != null) {
        $scope.user = $rootScope.user;
        $scope.dataCallAPI.t = $scope.user.loginType;
        $scope.dataCallAPI.e = $scope.user.Id;
        $scope.dataCallAPI.l = $scope.user.token;
    } else {
        $scope.dataCallAPI.t = DataForGuest.t;
        $scope.dataCallAPI.e = DataForGuest.e;
        if (localStorage.token != null) {
            $scope.dataCallAPI.l = localStorage.token;
        }
    }
    $rootScope.searchInfo = {
        specId: 0,
        locationId: "",
        locationName: "",
        useGeolocation: 0,
        cityUrl: URL_API + "cities.php?e=" + $scope.dataCallAPI.e + "&l=" + $scope.dataCallAPI.l + "&t=" + $scope.dataCallAPI.t + "&tc="
    };

    // get data specialities 
    function succGetSpec(response) {
        $rootScope.disableLoading = false;
        if (response.status === RESPONSE_STATUS_SUCCESS) {
            $scope.listSpeciality = response.specialties;
            $rootScope.listSpeciality = $scope.listSpeciality;
        }
    }
    function errGetSpec() {
        $rootScope.disableLoading = false;
        $rootScope.errorShow();
    }
    if ($rootScope.listSpeciality != null && $rootScope.listSpeciality.length > 0) {
        $scope.listSpeciality = $rootScope.listSpeciality;
    } else {
        $rootScope.disableLoading = true;
        console.log(68);
        apiService.specialities($scope.dataCallAPI, succGetSpec, errGetSpec);
    }


    // get current position if active geo
    $ionicPlatform.ready(function () {
        $rootScope.disableLoading = true;
        if ($rootScope.setting != null && $rootScope.setting.activeGeoLocation) {
            $timeout(function () {
                if ($rootScope.Geolocation != null) {
                    $rootScope.searchInfo.geoActiveInfo = {
                        lat: $rootScope.Geolocation.lat,
                        lng: $rootScope.Geolocation.lng
                    }
                    $rootScope.searchInfo.locationName = "Au plus près d’ici";
                    $rootScope.searchInfo.useGeolocation = 1;
                }
            }, 1000);
        }
        $rootScope.disableLoading = false;
    });

    $scope.viewPro = function () {
        if ($rootScope.user != null) {
            if ($rootScope.user.isPro === ACCOUNT_TYPE.PROFESSONAL) {
                $state.go("app.Editprofile");
            }
            else {
                //$rootScope.NonData = true;
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

    $scope.search = function () {
        $rootScope.disableLoading = false;
        $scope.isClickedSearch = true;
        $rootScope.searchInfo.specId = document.getElementById("speciality").value;
        console.log($rootScope.searchInfo);
        if ($rootScope.searchInfo != null && $rootScope.searchInfo.specId > 0) {
            if (($rootScope.searchInfo.useGeolocation === 1 && $rootScope.searchInfo.locationName === "Au plus près d’ici") || ($rootScope.searchInfo.useGeolocation === 0 && $rootScope.searchInfo.locationId !== "")) {
                $state.go("app.SearchResult");

            } else {
                if ($rootScope.searchInfo.locationId == "") {
                    $("#cityName_value").addClass("input-error");
                    $rootScope.errorShow();
                }
                else {
                    $rootScope.errorInputShow();
                }
            }
        } else {
            if ($rootScope.searchInfo.locationId == "" && $rootScope.searchInfo.locationName != "Au plus près d’ici") {
                $("#cityName_value").addClass("input-error");
            }
            $scope.specialCheck = true;
            $rootScope.errorShow();
        }
    };


    $scope.selectedSP = function (sp) {
        if (sp != null) {
            $rootScope.searchInfo.locationId = sp.originalObject.id;
            $rootScope.searchInfo.locationName = sp.originalObject.n;
            $rootScope.searchInfo.useGeolocation = 0;
        }
    };
    $scope.inputChangedFn = function (sp) {
        $rootScope.searchInfo.locationName = sp;
        //$rootScope.searchInfo.useGeolocation = 0;
    };
    $scope.myInitialValue = function () {
        if ($rootScope.setting.activeGeoLocation) {
            return $rootScope.searchInfo.locationName;
        } else {
            return "";
        }

    };
    $scope.focusIn = function () {
        $rootScope.disableLoading = false;
        $("#cityName_value").removeClass("input-error");
        $scope.locationError = false;
        $rootScope.searchInfo.locationName = "";
        $scope.$broadcast('angucomplete-alt:clearInput', 'cityName');
    };
    $scope.specialFocus = function () {
        $rootScope.disableLoading = false;
        $scope.specialCheck = false;
    }
    $scope.defaultLocation = function () {

        if (!($rootScope.searchInfo != null && $rootScope.searchInfo.useGeolocation == 0 && $rootScope.searchInfo.locationId !== "" && $rootScope.searchInfo.locationName !== "")) {
            $scope.$broadcast('angucomplete-alt:clearInput', 'cityName'); // code for hide dropdown result 
            if ($rootScope.setting.activeGeoLocation == true && $rootScope.Geolocation) {
                $rootScope.searchInfo.geoActiveInfo = {
                    lat: $rootScope.Geolocation.lat,
                    lng: $rootScope.Geolocation.lng
                }
                $rootScope.searchInfo.locationName = "Au plus près d’ici";
                $rootScope.searchInfo.useGeolocation = 1;
                //console.log($rootScope.searchInfo.locationName);
                $scope.$broadcast('angucomplete-alt:changeInput', 'cityName', $rootScope.searchInfo.locationName);
                $rootScope.disableLoading = true;
            }
        }
    }
}