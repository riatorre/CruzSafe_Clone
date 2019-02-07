/*
 *	app.js
 *	Server Host file for CruzSafe
 */

"use strict";

// Custom Console that automatically provides a timestamp to all messages.
var myConsole = require("./customConsole");
var bodyParser = require("body-parser");

// Variables for HTTP and HTTPS servers
var hostname = "127.0.0.1";
var HTTP_port = 8080; // Testing Port, traditionally '80'
var HTTPS_port = 8443; // Testing Port, traditionally '443'

// Importing express.js to handle web server(s)
var express = require("express");
var app = express();

// Importing HTTP and HTTPS
var http = require("http");
var https = require("https");
// Importing Local File System
var fs = require("fs");
// Importing Database Connection
var connection = require("./config");

// Importing certificates for HTTPS to function. Certificates are self-signed with OpenSSL.
// Certificates will need to be updated before release, as current are self-signed
var privateKey = fs.readFileSync("certificates/key.pem", "utf8");
var certificate = fs.readFileSync("certificates/cert.pem", "utf8");
var credentials = { key: privateKey, cert: certificate };

// Creating Servers for HTTP and HTTPS through Express.js
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// Set up ports for servers
httpServer.listen(HTTP_port, () => {
    myConsole.log(
        "HTTP Server running at http://" + hostname + ":" + HTTP_port + "/"
    );
});
httpsServer.listen(HTTPS_port, () => {
    myConsole.log(
        "HTTPS Server running at http://" + hostname + ":" + HTTPS_port + "/"
    );
});

// This Portion may need changing

// Redirects all HTTP requests to HTTPS requests
app.use(function(req, res, next) {
    if (!req.secure) {
        // localhost:8443 portion is temporary
        return res.redirect(["https://localhost:8443", req.baseUrl].join(""));
    }
    next();
});

// Restricts Webs Server File Access to "public"'s contents
app.use(express.static(__dirname + "/public"));

// Allows app to parse JSON, and as a result, accept AJAX requests
app.use(bodyParser.json());

// Sets up default page
app.get("/", function(req, res) {
    res.sendFile("welcome.html", { root: __dirname + "/public/" });
});

// Post route that accepts any page
// May be replaced, although could pass an action along with data needed to be processed
// Handler should see action and parse data based on that action if it exists as a possible action
// I.E. action = addUser, adds user with given params
app.post("/*", function(req, res) {
    myConsole.log("Request Received");
    //myConsole.log(JSON.stringify(req.body));
    res.send("");
});
