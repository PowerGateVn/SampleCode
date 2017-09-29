var RESPONSE_STATUS_SUCCESS = 'success';
var RESPONSE_STATUS_ACCESS_DENIED = 'access_denied';
var RESPONSE_STATUS_FAIL = 'fail';
var ACCOUNT_TYPE = {
    PROFESSONAL: 'yes',
    NOT_PROFESSONAL: 'no'
};
var LOGIN_TYPE= {
    Facebook: 'fb',
    Google: 'g',
    Email:'e'
}
var LOCAL_STORAGE_KEY = {
    Account: '_docotop_user_account',
    NotificationLog: 'notificationLog'
}
var ADVICES_RESULT_INDEX = {
    TYPE_1: -1, // return first 2 results,
    TYPE_2: 0  // retun first 10 results
};
var URL_IMG_DOCTOR = 'http://media.docotop.com/docs/';
var URL_IMG_USER = 'http://media.docotop.com/users/';
var URL_IMG_PROCOVER = 'http://media.docotop.com/procover_pics/';
var URL_IMG_ADVISOR = 'http://media.docotop.com/advisors/';
var URL_IMG_COMMENT = 'http://media.docotop.com/comments_pics/';
var PHOTO_TYPE = '.jpg';

var SHARE_LINK = {
    ShareSheet: 'http://www.docotop.com/#/app/search/details/',
    ShareRate: 'http://www.docotop.com/#/app/readmore/'
}
var SHARE_PROFILE = "shareprofile.php?id=";
var SHARE_RATE = "sharerating.php?id=";
var DayOfWeek = {
    su: 0,
    mo: 1,
    tu: 2,
    we: 3,
    th: 4,
    fr: 5,
    sa: 6
}

var DataForGuest = {
    t: 'UNK',
    e: 'NIL',
    l: ''


}

var DAY_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
var MONTH_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
