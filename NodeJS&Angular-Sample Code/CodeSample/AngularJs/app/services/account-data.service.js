angular.module('starter.controllers')
    .factory('accountDataService', accountDataService);

accountDataService.$inject = ['$log', '$resource'];
function accountDataService($log, $resource) {

    var accountDataUrl = URL_API + '/user/:action';

    return $resource(accountDataUrl, {}, {
        register: { method: 'POST', params: { action: 'signup' }, isArray: false, withCredentials: true },
        login: { method: 'GET', params: { action: 'login' }, isArray: false, withCredentials: true },
        getUserDetail: { method: 'GET', params: { action: 'getUserDetail' }, isArray: false, withCredentials: true },
        updateProfile: { method: 'GET', params: { action: 'updateProfile' }, isArray: false, withCredentials: true },
        forgotPassword: { method: 'GET', params: { action: 'forgotPassword' }, isArray: false, withCredentials: true },
        updatePayment: { method: 'GET', params: { action: 'updatePayment' }, isArray: false, withCredentials: true }
    });
}
