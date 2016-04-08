/**
 * Created by Stefano on 14.10.2015.
 */
"use strict";

var HTTPErrors = require("http-custom-errors");
var authService = require("../services/auth.service");
var config = require("../config");

exports.requireLogin = function (req, res, next) {
    authService.authenticate(req, function (err, user) {
        if (err) {
            next(err);
        }
        else {
            req.user = user;
            next();
        }
    });
};

exports.requireMatchingUserId = function (req, res, next, id) {
    // if the ids match, we can continue...
    if (req.user.id === id) {
        next();
    }
    // otherwise, well, bye bye...
    else {
        next(new HTTPErrors.ForbiddenError("Id mismatch"));
    }
};

exports.requireMatchingUserIdByKey = function (paramIdKey) {
    return function (req, res, next) {
        // if the ids match, we can continue...
        if (req.user.id === req.params[paramIdKey]) {
            next();
        }
        // otherwise, well, bye bye...
        else {
            next(new HTTPErrors.ForbiddenError("Id mismatch"));
        }
    };
};