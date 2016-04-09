/**
 * Created by Stefano on 24.07.2015.
 */
"use strict";

var _ = require("lodash");
var router = require("express").Router();
var HTTPErrors = require("http-custom-errors");

var config = require("../config");

var requireLogin = require("../middleware/auth.middleware").requireLogin;
var requireMatchingUserId = require("../middleware/auth.middleware").requireMatchingUserId;

var service = require("../services/user.service");
var userHobbiesService = require("../services/user-hobbies.service");

module.exports = function (app) {
    console.log("initializing user routes...");
    app.use(config.urls.users, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin);

    router.route("/")
        .get(function (req, res, next) {
            var userBase = service.users;
            if(req.query.size === "small") {
                userBase = service.users.small;
            }

            res.json(userBase);
        });

    router.route("/:id")
        .get(function (req, res, next) {
            var user = _.find(service.users, function (user) {
                return user.id === req.params.id;
            });

            if (user) {
                res.json(user);
            }
            else {
                next(new HTTPErrors.NotFoundError("User with id '%s' not found", req.params.id));
            }
        });

    router.route("/:id/hobbies")
        .get(requireLogin, function (req, res, next) {
            res.json(userHobbiesService.getHobbies(req.params.id));
        });
};