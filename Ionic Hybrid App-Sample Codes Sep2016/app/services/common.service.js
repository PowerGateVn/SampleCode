angular.module('starter.controllers')
        .factory('commonService', commonService);

function commonService($rootScope, $http) {
    var service = {
        getStatus: getStatus,
        setStatus: setStatus,
        checkEmail: checkEmail,
        checkDate: checkDate,
        checkUrl:   checkUrl
    };
    return service;
    function getStatus() {
        return JSON.parse(localStorage.getItem('Setting'));
    }

    function setStatus(status) {
        localStorage.setItem('Setting', JSON.stringify(status));
    }

    function checkEmail(email) {
        var pattCheckEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
        return pattCheckEmail.test(email);
    }

    function checkUrl(url) {
        var urlregex = new RegExp("^(http://|https://){1}([0-9A-Za-z]+\.)");
        return urlregex.test(url);
    }

    function checkDate(date) {
        var pattcheckDate = /(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}/;
        return pattcheckDate.test(date);
    }
}