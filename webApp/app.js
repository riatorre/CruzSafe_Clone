/*
 *	app.js
 *	Server Host file for CruzSafe
 */

"use strict";

const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");

// Imports of our files
const myConsole = require("./backend/utilities/customConsole");
const users = require("./backend/routes/users");
const reports = require("./backend/routes/reports");

const app = express();

app.use(cors());
// Sets up app to allow for JSON parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Use the Router on the sub routes
app.use("/api/users", users);
app.use("/api/reports", reports);

app.get("/", function(req, res) {
    res.sendFile("welcome.html", {
        root: __dirname + "/public"
    });
});

// Sets up Access Control for any page that is not the welcome page
// Only affects html pages; should not affect APIs, images, css, js, etc pages/files
// Uncomment out portion below in order to enable Authentication Verification
//app.use("/*.html", verifyAuthentication);

// Sets Default to public folder; allows for transfer of all files in public folder
app.use(express.static(__dirname + "/public"));

// Arthur's attempt at making gae work
if (module == require.main) {
    // Start the server1
    const server = app.listen(process.env.PORT || 8080, () => {
        const port = server.address().port;
        myConsole.log("App listening on port " + port);
    });
}

// Access Control Function
// Utilizes a function from Passport.js to determine if user is Authenticated
function verifyAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        myConsole.log("User is Verified");
        return next();
    } else {
        myConsole.log("User is Not Verified; redirecting to Welcome page");
        res.redirect("/");
    }
}
