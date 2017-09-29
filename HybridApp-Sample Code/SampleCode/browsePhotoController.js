angular.module('starter.controllers')
.controller('BrowsePhotosCtrl', function($scope, $http, $state, $rootScope, $timeout, $ionicPopup) {
    $rootScope.Photos = [];
    $scope.morePhotoAvailable = true;

    $scope.loadMore = function() {
        $scope.morePhotoAvailable = false;
        $('#lookgoodLoading').show();
        $http.get(SERVER_API + 'photo/browsephotos?start=' + $rootScope.Photos.length, {
                withCredentials: true
            })
            .success(function(response) {
                $('#lookgoodLoading').hide();
                if (response.Status == RESPONSE_STATUS_SUCCESS) {
                    $rootScope.Photos = $rootScope.Photos.concat(response.Data.Photos);
                    $scope.morePhotoAvailable = response.Data.HasMore;
                }
            }).error(function(response) {
                $('#lookgoodLoading').hide();
                $ionicPopup.alert({
                    title: 'No Internet connection !',
                    template: "No Internet connection. Please recheck it to continue."
                });
            });
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.viewAPhoto = function(photoIndex) {
        $state.go('app.ViewAPhoto/:photoType/:photoIndex', {
            photoIndex: photoIndex,
            photoType: VIEW_PHOTO_TYPE_BROWSE
        });
    };
    $scope.lovePhoto = function(photoIndex) {
        if ($rootScope.user == null) {
            $rootScope.LoginToLovePhoto = {
                photoIndex: photoIndex,
                photoType: VIEW_PHOTO_TYPE_BROWSE
            };
            $state.go('app.Login');
        } else {
            var url = SERVER_API + 'photo/LovePhoto?photoId=' + $rootScope.Photos[photoIndex].Id;
            $('#lookgoodLoading').show();
            $http.get(url, {
                withCredentials: true
            }).success(function(response) {
                $('#lookgoodLoading').hide();
                if (response.Status == RESPONSE_STATUS_SUCCESS) {
                    $rootScope.Photos[photoIndex].NumOfLike = response.Data.NumOfLike;
                    $rootScope.Photos[photoIndex].IsLoved = response.Data.IsLoved;
                } else if (response.Status == 2) {
                    $rootScope.LoginToLovePhoto = {
                        photoIndex: photoIndex,
                        photoType: VIEW_PHOTO_TYPE_BROWSE
                    };
                    $state.go('app.Login');
                }

            }).error(function(response) {
                $('#lookgoodLoading').hide();
                $ionicPopup.alert({
                    title: 'No Internet connection !',
                    template: "No Internet connection. Please recheck it to continue."
                });
            });
        }
    };
})