var path = require("path");

//=============================================================================
// General configurations...
//-----------------------------------------------------------------------------
exports.port = 3000;
exports.publicDir = path.join(__dirname + "/../");

//=============================================================================
// WebSocket configurations...
//-----------------------------------------------------------------------------
exports.ws_channel_global = "ws-global";
exports.ws_channel_java_events = "ws-java-events";
exports.ws_channel_js_events = "ws-js-events";

//=============================================================================
// URL configurations...
//-----------------------------------------------------------------------------
exports.urls = {
    home: "/api/home",
    users: "/api/users",
    hobbies: "/api/hobbies",
    userHobbies: "/api/userHobbies"
};