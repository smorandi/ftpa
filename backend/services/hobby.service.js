/**
 * Created by Stefano on 17.09.2015.
 */
"use strict";

var _ = require("lodash");
var uuid = require("node-uuid");

var config = require("../config");
var Hobby = require("../models/dto").Hobby;

var names = ["Hiking", "Dancing", "Reading", "Playing", "Eating", "Juggling", "Drinking", "Cooking"];

module.exports.createHobbies = function() {
    var items = [];
    for (var i = 0; i < names.length; i++) {
        items.push(new Hobby(uuid.v4().toString(), names[i]));
    }
    return items;
}

var hobbies = exports.createHobbies();

module.exports.hobbies = hobbies;