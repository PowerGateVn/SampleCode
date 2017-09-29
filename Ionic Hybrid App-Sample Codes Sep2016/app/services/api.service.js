angular.module('starter.controllers')
    .factory('apiService', apiService);

apiService.$inject = ['$log', '$resource'];
function apiService($log, $resource) {

    var apiUrl = URL_API + ':action.php';

    return $resource(apiUrl, {}, {
        unlink: { method: 'GET', params: { action: 'unlink' }, isArray: false, withCredentials: true },
        notif: { method: 'GET', params: { action: 'notifs' }, isArray: false, withCredentials: true },
        rating: { method: 'GET', params: { action: 'rate' }, isArray: false, withCredentials: true },
        authcheck: { method: 'GET', params: { action: 'authcheck' }, isArray: false, withCredentials: true },
        authconfirm: { method: 'GET', params: { action: 'authconfirm' }, isArray: false, withCredentials: true },
        specialities: { method: 'GET', params: { action: 'specialties' }, isArray: false, withCredentials: true },
        cities: { method: 'GET', params: { action: 'cities' }, isArray: false, withCredentials: true },
        search: { method: 'GET', params: {action: 'search'}, isArray:false, withCredentials: true},
        extra: { method: 'GET', params: { action: 'extra' }, isArray: false, withCredentials: true },
        adddoc: { method: 'GET', params: { action: 'adddoc' }, isArray: false, withCredentials: true },
        claim: { method: 'GET', params: { action: 'claim' }, isArray: false, withCredentials: true },
        profileupdate: { method: 'GET', params: { action: 'profileupdate' }, isArray: false, withCredentials: true },
        photoupload: { method: 'GET', params: { action: 'photoupload' }, isArray: false, withCredentials: true },
        useradvices: { method: 'GET', params: { action: 'useradvices' }, isArray:false, withCredentials:true },
        friends: { method: 'GET', params: { action: 'friends' }, isArray:false, withCredentials:true },
        prefdoc: { method: 'GET', params: {action: 'prefdoc' }, isArray: false, withCredentials: true},
        prefdocupdate: { method: 'GET', params: { action: 'prefdocupdate' }, isArray: false, withCredentials: true },
        sharewall: { method: 'POST', params: { action: 'sharewall' }, isArray: false, withCredentials: true },
        readmore:{method:'GET', params:{action: 'readmore'}, isArray: false, withCredentials: true},
        ratecomment: { method: 'GET', params: { action: 'ratecomment' }, isArray: false, withCredentials: true },
        reportcomment: { method: 'GET', params: { action: 'reportcomment' }, isArray: false, withCredentials: true },
        ftu: { method: 'GET', params: { action: 'ftu' }, isArray: false, withCredentials: true }
        
    });
    // Define functions
}

