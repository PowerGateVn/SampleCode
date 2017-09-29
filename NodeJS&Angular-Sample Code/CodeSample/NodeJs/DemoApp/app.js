var express = require('express');
var userRoute = require('./routes/user');
var session = require('express-session');
var http = require('http');
var path = require('path');
var app = express();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.use(function (req, res, next) {
    if (req.headers.origin != null) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
});
app.use(session({
    secret: 'd6605b7c9978a9e636514ef4cbc382db',
    resave: false,
    saveUninitialized: true
}));
app.use(function (req, res, next) {
    if (!req.session.views) {
        req.session.views = {};
    }
});
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.cookieParser());
var stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    app.locals.pretty = true;
}
app.get('/user/login', userRoute.login);
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
//# sourceMappingURL=app.js.map