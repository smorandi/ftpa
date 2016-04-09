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

var service = require("../services/hobby.service.js");

module.exports = function (app) {
    console.log("initializing home routes...");
    app.use(config.urls.home, router);

    // authentication middleware defaults for this router...
    router.use(requireLogin);

    router.route("/")
        .get(function (req, res, next) {
            res.json(req.user);
        });
};