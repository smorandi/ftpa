"use strict";

var _ = require("lodash");
var uuid = require("node-uuid");

var firstNames = ["Sophie", "Isabelle", "Emily", "Olivia", "Lily", "Chloe", "Isabella",
    "Amelia", "Jessica", "Sophia", "Ava", "Charlotte", "Mia", "Lucy", "Grace", "Ruby",
    "Ella", "Evie", "Freya", "Isla", "Poppy", "Daisy", "Layla"];

var lastNames = ["Beckham", "Black", "Braxton", "Brennan", "Brock", "Bryson", "Cadwell",
    "Cage", "Carson", "Chandler", "Cohen", "Cole", "Corbin", "Dallas", "Dalton", "Dane",
    "Donovan", "Easton", "Fisher", "Fletcher", "Grady", "Greyson", "Griffin", "Gunner",
    "Hayden", "Hudson", "Hunter", "Jacoby", "Jagger", "Jaxon", "Jett", "Kade", "Kane",
    "Keating", "Keegan", "Kingston", "Kobe"];

function User(firstname, lastname, loginname, password, age) {
    this.id = uuid.v4().toString();
    this.firstname = firstname;
    this.lastname = lastname;
    this.loginname = loginname;
    this.password = password;
    this.age = age;
}

function createRandomUsers(nb) {
    var users = [];
    for (var i = 0; i < nb; i++) {
        var user = createRandomUser();
        users.push(user);
    }
    return users;
}

function createRandomUser()
{
    var user = new User();

    user.id = uuid.v4().toString();
    user.firstname = _.sample(firstNames);
    user.lastname = _.sample(lastNames);
    user.loginname = user.firstname + "_" + user.lastname;
    user.password = "***";
    user.age = _.random(20, 60);

    return user;
}

module.exports = {
    createRandomUsers: createRandomUsers,
};