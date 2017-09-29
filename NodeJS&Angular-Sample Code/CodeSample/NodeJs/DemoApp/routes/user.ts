import express = require('express');
var userService = require('../service/user_service.js');
var constant = require('../config/constant.js');
var config = require('../config/config.js');


export function login(req: express.Request, res: express.Response) {
    userService.login(req.query.username, req.query.password, req.query.type, function (result) {
        if (result.Status == constant.FunctionStatusSuccess) {
            req.session.views[constant.SessionKeyUser] = result.Data;
            res.send({ Status: constant.ResponeStatusSuccess, Data: result.Data });
        } else {
            res.send({ Status: constant.ResponeStatusAccessDenied });
        }
    });
};