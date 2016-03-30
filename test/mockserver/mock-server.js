"use strict";

var config = require("./config");

var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
var morgan = require('morgan');

var express = require("express");
var http = require("http");
var ws = require("ws");
var WebSocketServer = ws.Server;
var app = express();
var server = http.createServer(app);
var wss = new WebSocketServer({ server: server });

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

// end of line...analyse what error we got and return any infos to the client...
app.use(function (err, req, res, next) {
    var status = err.code || err.status || 500;
    console.log("application error: ", err);
    res.status(status).json(err);
});


// the actual route...
app.get('/api/demo', function (req, res) {
    var obj = {
        name: "der fisch",
        age: 22
    };

    res.json(obj);
});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    console.log("client connected...")
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function (client) {
        client.send(data);
    });
};

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

setInterval(function () {
    console.log("emitting on channel ws-global");
    wss.broadcast("der fisch");
}, 1000);
