"use strict";

module.exports.User = function (id, firstname, lastname, loginname, password, age) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.loginname = loginname;
    this.password = password;
    this.age = age;
}

module.exports.Hobby = function (id, name, description) {
    this.id = id;
    this.name = name;
}

module.exports.UserHobby = function (id, userId, hobbyId) {
    this.id = id;
    this.userId = userId;
    this.hobbyId = hobbyId;
}