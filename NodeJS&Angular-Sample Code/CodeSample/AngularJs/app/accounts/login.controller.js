angular.module('starter.controllers')
    .controller('LoginCtrl', LoginCtrl);
function LoginCtrl($scope, $rootScope, $state, $log, $http, $ionicSideMenuDelegate, accountDataService) {
    var vm = this;
    $ionicSideMenuDelegate.canDragContent(false);
    vm.account = {
        type: ACCOUNT_TYPE_PUBLISHER
    };
    vm.doLogin = doLogin;

    function doLogin(valid) {
        vm.msg = '';
        if (valid) {
            accountDataService.login(vm.account, succ, err);
            function succ(response) {
                if (response.Status == RESPONSE_STATUS_SUCCESS) {
                    $rootScope.user = response.Data;
                    $state.go("app.Campaigns");
                    localStorage.userKey = response.Data.key;
					vm.msg = '';
                }
                else {
                    vm.msg = ERROR_LOGIN_MESSAGE;
                }
            }
            function err(httpResponse) {
                vm.msg = CONNECTION_ERROR;
            }
        }
    }

}