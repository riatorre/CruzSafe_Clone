/*
 *	app.js
 *	Server Host file for CruzSafe
 */

"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

// Imports of our files
var myConsole = require("./backend/utilities/customConsole");
var users = require("./backend/routes/users");
var reports = require("./backend/routes/reports");

var app = express();

app.use(cors());
// Sets up app to allow for JSON parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Use the Router on the sub routes
app.use("/api/users", users);
app.use("/api/reports", reports);

// Sets Default to public folder
app.use(express.static(__dirname + "/public"));

// Sets default page to homepage.txt for now
app.get("/", function(req, res) {
    res.sendFile("welcome.html", { root: __dirname + "/public/" });
});

// Arthur's attempt at making gae work
if (module == require.main) {
    // Start the server1
    const server = app.listen(process.env.PORT || 8080, () => {
        const port = server.address().port;
        myConsole.log("App listening on port " + port);
    });
}
