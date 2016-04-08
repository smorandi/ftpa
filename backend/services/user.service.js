/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var _ = require("lodash");
var uuid = require("node-uuid");

var config = require("../config");
var User = require("../models/dto").User;


var firstNames = ["Sophie", "Isabelle", "Emily", "Olivia", "Lily", "Chloe", "Isabella",
    "Amelia", "Jessica", "Sophia", "Ava", "Charlotte", "Mia", "Lucy", "Grace", "Ruby",
    "Ella", "Evie", "Freya", "Isla", "Poppy", "Daisy", "Layla"];

var lastNames = ["Beckham", "Black", "Braxton", "Brennan", "Brock", "Bryson", "Cadwell",
    "Cage", "Carson", "Chandler", "Cohen", "Cole", "Corbin", "Dallas", "Dalton", "Dane",
    "Donovan", "Easton", "Fisher", "Fletcher", "Grady", "Greyson", "Griffin", "Gunner",
    "Hayden", "Hudson", "Hunter", "Jacoby", "Jagger", "Jaxon", "Jett", "Kade", "Kane",
    "Keating", "Keegan", "Kingston", "Kobe"];

module.exports.createRandomUser = function () {
    var user = new User();

    user.id = uuid.v4().toString();
    user.firstname = _.sample(firstNames);
    user.lastname = _.sample(lastNames);
    user.loginname = user.firstname + "_" + user.lastname;
    user.password = "derFisch";
    user.age = _.random(20, 60);

    return user;
}

module.exports.createRandomUsers = function(nb) {
    var users = [];
    for (var i = 0; i < nb; i++) {
        var user = exports.createRandomUser();
        users.push(user);
    }
    return users;
}

var users = exports.createRandomUsers(10000);

module.exports.users = users;
module.exports.users.big = users;
module.exports.users.small = _.sampleSize(users, 10);