var URL_API = 'https://api.docotop.com/';

var FACEBOOK_APP_ID = '1717132061875101';
var GOOGLE_API_CLIENT_ID = '234857729687-a2ibop4gv3mj9ksj6ifle3tsoeinhss1.apps.googleusercontent.com';

app.config(routeConfig);
app.config(httpInterceptorConfig);
app.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
    if (!ionic.Platform.isIOS()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }
    if (ionic.Platform.isAndroid()) {
        $ionicConfigProvider.scrolling.jsScrolling(true);
    }
});

app.directive('googlelogin', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {

            element.bind('click', function (e) {
                angular.element(e.target).siblings('#googleLoginButton').trigger('click');
            });
        }
    };
});
function routeConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'app/components/menu.html',
            title: 'DocOtop'
        })
        .state('app.Login', {
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'app/accounts/login.html'
                }
            }
        })
        .state('app.Authentication', {
            url: '/auth/:isForced',
            views: {
                'menuContent': {
                    templateUrl: 'app/accounts/authentication.html'
                }
            }
        })
        .state('app.CGU', {
            url: '/cgu',
            views: {
                'menuContent': {
                    templateUrl: 'app/accounts/cgu.html'
                }
            },
            title: 'CGU'
        })
        .state('app.Welcome', {
            url: '/welcome',
            views: {
                'menuContent': {
                    templateUrl: 'app/accounts/welcome.html',
                    controller: 'WelcomeCtrl'
                }
            }
        })
        .state('app.Search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'app/search/search.html',
                    controller: 'SearchCtrl'
                }
            },
            title: 'Search',
            description: 'cccccc'
        })
        .state('app.SearchDetails/:proId', {
            url: '/search/details/:proId',
            views: {
                'menuContent': {
                    templateUrl: 'app/search/search.details.html'
                }
            },
            title: 'Search Detail'
        })
        .state('app.SearchResult', {
            url: '/search/result',
            views: {
                'menuContent': {
                    templateUrl: 'app/search/search.result.html'
                    // controller: 'SearchResultCtrl'
                }
            },
            title: 'Search Result'
        })
        .state('app.Rating/:proId', {
            url: '/rating/rate/:proId',
            views: {
                'menuContent': {
                    templateUrl: 'app/rating/rating.html'
                }
            },
            title: 'Rating'
        })
        .state('app.RatingShare', {
            url: '/rating/share',
            views: {
                'menuContent': {
                    templateUrl: 'app/rating/rating.share.html'
                }
            },
            title: 'Rating Share'
        })
        .state('app.Claim', {
            url: '/claim',
            views: {
                'menuContent': {
                    templateUrl: 'app/claim/claim.html'
                }
            },
            title: 'Claim'
        })
        .state('app.Profile', {
            url: '/profile',
            views: {
                'menuContent': {
                    templateUrl: 'app/profile/profile.html'
                    //controller: 'ProfileCtrl'
                }
            },
            title: 'Profile'
        })
        .state('app.Editprofile', {
            url: '/editprofile',
            views: {
                'menuContent': {
                    templateUrl: 'app/pro/editprofile.html'
                }
            },
            title: 'Edit Profile'
        })
        //.state('app.Editprofile.Content', {
        //    url: '/content',
        //    views: {
        //        'tab-edit-profile': {
        //            templateUrl: 'app/pro/profile.content.html'
        //        }
        //    }
        //})
        .state('app.Uploadphoto', {
            url: '/uploadphoto',
            views: {
                'menuContent': {
                    templateUrl: 'app/pro/uploadphoto.html'
                    // controller: 'UploadphotoCtrl'
                }
            }
        })
        .state('app.ResultProfileInfo', {
            url: '/resultprofileinfo',
            views: {
                'menuContent': {
                    templateUrl: 'app/pro/result-profile-info.html'
                }
            }
        })
        .state('app.CreateProfileInfo', {
            url: '/createprofileinfo',
            views: {
                'menuContent': {
                    templateUrl: 'app/pro/create.profile.info.html'
                }
            },
            title: 'Create Profile'
        })
        .state('app.CreateProfilePhoto', {
            url: '/createprofilephoto',
            views: {
                'menuContent': {
                    templateUrl: 'app/pro/create.profile.photo.html'
                }
            },
            title: 'Create Profile'
        })
        .state('app.Setting', {
            url: '/setting',
            views: {
                'menuContent': {
                    templateUrl: 'app/profile/setting.html'
                }
            },
            title: 'Setting'
        })

        .state('app.Viewrating', {
            url: '/viewrating',
            views: {
                'menuContent': {
                    templateUrl: 'app/viewrating/viewrating.html'
                }
            },
            title: 'View Rating'
        })
        .state('app.Readmore/:adviceId', {
            url: '/readmore/:adviceId',
            views: {
                'menuContent': {
                    templateUrl: 'app/viewrating/readmore.html'
                }
            },
            title: 'Readmore'
        })

        .state('app.Norating', {
            url: '/norating',
            views: {
                'menuContent': {
                    templateUrl: 'app/viewrating/no.rating.html'
                }
            },
            title: 'Norating'
        })
        //.state('app.Op', {
        //    url: '/opz',
        //    views: {
        //        'menuContent': {
        //            templateUrl: 'app/op/op.html',
        //            controller: 'ModalCtrl'
        //        }
        //    }
        //})


        .state('app.Notif', {
            url: '/notification',
            views: {
                'menuContent': {
                    templateUrl: 'app/notification/notif.html'
                    // controller: 'NotifCtrl'
                }
            },
            title: 'Notification'
        })

        .state('app.ParamedsDelete', {
            url: '/parameds/delete',
            views: {
                'menuContent': {
                    templateUrl: 'app/parameds/parameds.html'
                }
            },
            title: 'Parameds Delete'
        })
        .state('app.ParamedsAdd', {
            url: '/parameds/add',
            views: {
                'menuContent': {
                    templateUrl: 'app/parameds/parameds.add.html'
                }
            },
            title: 'Parameds Add'
        })
        .state('app.FirstTimesUsage', {
            url: '/FirstTimesUsage',
            views: {
                'menuContent': {
                    templateUrl: 'app/first_time_usage/first.times.usage.html'
                }
            }
        })
        .state('app.FirstTimesUsageStep1', {
            url: '/FirstTimesUsageStep1',
            views: {
                'menuContent': {
                    templateUrl: 'app/first_time_usage/first.times.usage.1.html'
                }
            }
        })
        .state('app.FirstTimesUsageStep2', {
            url: '/FirstTimesUsageStep2',
            views: {
                'menuContent': {
                    templateUrl: 'app/first_time_usage/first.times.usage.2.html'
                }
            }
        })
        .state('app.FirstTimesUsageStep3', {
            url: '/FirstTimesUsageStep3',
            views: {
                'menuContent': {
                    templateUrl: 'app/first_time_usage/first.times.usage.3.html'
                }
            }
        })

    ;
    // if none of the above states are matched, use this as the fallback
    if (!ionic.Platform.isIOS() && !ionic.Platform.isAndroid()) {
        $urlRouterProvider.otherwise('/app/search');
    }
    else {
        if (localStorage.VIEWED == null) {
            localStorage.setItem('VIEWED', 'yes');
            $urlRouterProvider.otherwise('/app/FirstTimesUsage');
        } else {
            $urlRouterProvider.otherwise('/app/search');
        }
    }
}

function httpInterceptorConfig($httpProvider) {
    $httpProvider.interceptors.push(addLoadingBroadcast);

    function addLoadingBroadcast($rootScope) {
        var broadcastConfig = {
            request: addBroadcastShowLoading,
            requestError: addBroadcastHideLoading,
            response: addBroadcastHideLoading,
            responseError: addBroadcastHideLoading
        };
        return broadcastConfig;

        function addBroadcastShowLoading(config) {
            if (!($rootScope.disableLoading == true)) {
                $rootScope.$broadcast('loading:show');
            }
            return config;
        }

        function addBroadcastHideLoading(config) {
            $rootScope.$broadcast('loading:hide');
            return config;
        }
    }
}

