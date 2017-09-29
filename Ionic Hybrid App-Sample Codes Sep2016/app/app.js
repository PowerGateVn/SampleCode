// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'angucomplete-alt', 'ngResource', 'ngIOS9UIWebViewPatch', 'ui.bootstrap', 'ngFileUpload', 'ngCordova', 'ngTouch']);
app.run(function ($ionicPlatform, $rootScope, $ionicLoading,$ionicScrollDelegate) {
    $rootScope.$on('loading:show', showLoading);
    $rootScope.$on('loading:hide', hideLoading);

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);        
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
   
    function showLoading() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    }

    function hideLoading() {
        $ionicLoading.hide();
    }
    
})
.directive('focusMe', function ($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                console.log('value=', value);
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('blur', function () {
                console.log('blur');
                scope.$apply(model.assign(scope, false));
            });
        }
    };
});
app.directive('fileDialog', [function () {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attr) {
            element.bind('change', function (evt) {
                scope.$emit('fileAdded', evt.target.files[0]);
            });
        }
    };
}]);




