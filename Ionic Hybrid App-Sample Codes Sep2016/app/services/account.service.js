angular.module('starter.controllers')
        .factory('accountService', accountService);
function accountService($rootScope, $http, $interval, apiService) {
    var service = {
        getLocalId: getLocalId,
        getUserAccount: getUserAccount,
        setUserAccount: setUserAccount
    };
    return service;
    function getLocalId() {
        // provides most probably a unique ID for the current device & user

        var _dt = new Date();
        var _secs = _dt.getSeconds() + (60 * _dt.getMinutes()) + (60 * 60 * _dt.getHours());
        var _secs_str = _secs.toString(16);

        var _random = Math.floor((Math.random() * 100000) + 1).toString(16);

        localID = _secs_str + _random;

        localStorage.setItem('token', localID);
        return localID;
    }
    function getUserAccount() {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.Account));
    }

    function setUserAccount(userAccount) {
        localStorage.setItem(LOCAL_STORAGE_KEY.Account, JSON.stringify(userAccount));
    }
    
}