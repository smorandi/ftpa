/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var _ = require("lodash");
var uuid = require("node-uuid");

var config = require("../config");
var User = require("../models/dto").User;
var Hobby = require("../models/dto").Hobby;
var UserHobby = require("../models/dto").UserHobby;
var userService = require("./user.service");
var hobbyService = require("./hobby.service.js");


var users = userService.users;
var hobbies = hobbyService.hobbies;

var userHobbies = [];

_.forEach(users, function (user) {
    var nbOfHobbies = _.random(1, hobbies.length - 1);
    var hobbySample = _.sampleSize(hobbies, nbOfHobbies);

    _.forEach(hobbySample, function (sample) {
        userHobbies.push(new UserHobby(uuid.v4().toString(), user.id, sample.id));
    });
});

module.exports.getHobbies = function (userId) {
    var uHobbies = _.filter(userHobbies, function (item) {
        return item.userId === userId;
    });

    var uHobbyIds = _.map(uHobbies, "hobbyId");

    return _.filter(hobbies, function (item) {
        return _.find(uHobbyIds, function (id) {
            return item.id === id;
        });
    });
}

module.exports.userHobbies = userHobbies;