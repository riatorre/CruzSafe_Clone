/*
 *	app.js
 *	Server Host file for CruzSafe
 */

"use strict";

var http = require("http");
var https = require("https");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");

// Imports of our files
var myConsole = require("./backend/utilities/customConsole");
var users = require("./backend/routes/users");
var reports = require("./backend/routes/reports");

var app = express();

// Variables for HTTP and HTTPS servers
var hostname = "127.0.0.1";
var HTTP_port = 8080; // Testing Port, traditionally '80'
var HTTPS_port = 8443; // Testing Port, traditionally '443'

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
        "HTTPS Server running at https://" + hostname + ":" + HTTPS_port + "/"
    );
});

app.use(cors());

// Redirects all HTTP requests to HTTPS requests
app.use(function(req, res, next) {
    if (!req.secure) {
        // localhost:8443 portion is temporary
        return res.redirect(["https://localhost:8443", req.baseUrl].join(""));
    }
    next();
});

// Sets up app to allow for JSON parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Use the Router on the sub route /movies
// Replace this once our API is functional
//app.use("/api/users", users);
app.use("/api/reports", reports);

// Sets Default to public folder
app.use(express.static(__dirname + "/public"));

// Sets default page to homepage.txt for now
app.get("/", function(req, res) {
    res.sendFile("homepage.html", { root: __dirname + "/public/" });
});

// Arthur's attempt at making gae work
if (module == require.main) {
    // Start the server1
    const server = app.listen(process.env.PORT || 8080, () => {
        const port = server.address().port;
        console.log("App listening on port ${port}");
    });
}
