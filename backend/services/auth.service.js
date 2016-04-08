/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var auth = require("basic-auth");
var _ = require("lodash");
var HTTPErrors = require("http-custom-errors");

var config = require("../config");
var userService = require("../services/user.service");

function getUser(credentials, callback) {
    var users = userService.users;

    var foundUser = _.find(users, function (e) {
        return e.loginname === credentials.name;
    });

    if (!foundUser) {
        callback(new HTTPErrors.UnauthorizedError("User not found: '%s'", credentials.name));
    }
    else if (foundUser.password !== credentials.pass) {
        callback(new HTTPErrors.UnauthorizedError("Invalid Password: '%s'", credentials.pass));
    }
    else {
        callback(null, foundUser);
    }
}

module.exports.authenticate = function (req, callback) {
    var credentials = auth(req);
    if (credentials) {
        getUser(credentials, function (err, user) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, user);
            }
        });
    }
    else {
        callback(new HTTPErrors.UnauthorizedError("Basic-auth header missing"));
    }
};