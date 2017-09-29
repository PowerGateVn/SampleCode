app.config(routeConfig);
app.config(httpInterceptorConfig);
app.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
});
function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('app.Login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'app/accounts/login.html',
                controller: 'LoginCtrl'
            }
        }
    })
    $urlRouterProvider.otherwise('/app/campaigns');
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
            $rootScope.$broadcast('loading:show');
            return config;
        }
        function addBroadcastHideLoading(config) {
            $rootScope.$broadcast('loading:hide');
            return config;
        }
    }
}

