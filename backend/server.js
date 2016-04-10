"use strict";

var fs = require("fs");
var path = require("path");
var _ = require("lodash");

var config = require("./config");
var userService = require("./services/user.service");

var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
var morgan = require('morgan');

var express = require("express");
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

// common body parser as json..
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// and a cookie parser just in case...
app.use(cookieParser());

//use cors to allow everything (for now)
app.use(cors());

// logs the response...
app.use(function (req, res, next) {
    var end = res.end;
    res.end = function (chunk, encoding) {
        res.end = end;
        console.log(req.protocol + "://" + req.headers.host + req.path);
        console.log(chunk ? chunk.toString('utf8') : "empty");

        res.end(chunk, encoding);
    };
    next();
});

// morgan access logging...
app.use(morgan('common'));
app.use(express.static(config.publicDir));

// Globbing routing files
var routesPath = path.join(__dirname, "/routes/");
var routesFiles = fs.readdirSync(routesPath);
console.log("initializing routes...\n", routesFiles);
routesFiles.forEach(function (routePath) {
    return require(path.resolve(routesPath, routePath))(app);
});

// end of line...analyse what error we got and return any infos to the client...
app.use(function (err, req, res, next) {
    var status = err.code || err.status || 500;
    console.log("application error: ", err);
    res.status(status).json(err);
});


require('socketio-auth')(io, {
    authenticate: function (socket, data, callback) {
        //get credentials sent by the client
        var credentials = JSON.parse(data);
        var username = credentials.username;
        var password = credentials.password;

        var foundUser = _.find(userService.users, function (e) {
            return e.loginname === username;
        });

        if (!foundUser) {
            callback(new Error("User not found"));
        }
        else {
            callback(null, foundUser.password === password);
        }
    },
    postAuthenticate: function (socket, data) {
        socket.on(config.ws_channel_java_events, function (data, ack) {
            console.log(config.ws_channel_java_events + " - received: " + data);
            if (ack) {
                ack('suppi - java!');
            }

            io.emit(config.ws_channel_java_events, data);
        });
        socket.on(config.ws_channel_js_events, function (data, ack) {
            console.log(config.ws_channel_js_events + " - received: " + data);
            if (ack) {
                ack('suppi - js!');
            }

            io.emit(config.ws_channel_js_events, data);
        });
    },
});

// io.on('connection', function (socket) {
//     socket.on(config.ws_channel_java_events, function (data, ack) {
//         console.log(config.ws_channel_java_events + " - received: " + data);
//         if (ack) {
//             ack('suppi - java!');
//         }
//
//         io.emit(config.ws_channel_java_events, data);
//     });
//     socket.on(config.ws_channel_js_events, function (data, ack) {
//         console.log(config.ws_channel_js_events + " - received: " + data);
//         if (ack) {
//             ack('suppi - js!');
//         }
//
//         io.emit(config.ws_channel_js_events, data);
//     });
// });

// start up the server and listen on the port...
server.listen(config.port, function () {
    console.log("                                                        _");
    console.log("                                                       (_)");
    console.log("  ___  ___ _ ____   _____ _ __   _ __ _   _ _ __  _ __  _ _ __   __ _");
    console.log(" / __|/ _ \\ '__\\ \\ / / _ \\ '__| | '__| | | | '_ \\| '_ \\| | '_ \\ / _` |");
    console.log(" \\__ \\  __/ |   \\ V /  __/ |    | |  | |_| | | | | | | | | | | | (_| |");
    console.log(" |___/\\___|_|    \\_/ \\___|_|    |_|   \\__,_|_| |_|_| |_|_|_| |_|\\__, |");
    console.log("                                                                 __/ |");
    console.log("                                                                |___/ ");
    console.log("port: " + config.port);
});


// setInterval(function () {
//     console.log("broadcast")
//     io.emit(config.ws_channel_java_events, JSON.stringify({type: "test-event", payload: "broadcast"}));
// }, 3000);
