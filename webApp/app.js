/*
 *	app.js
 *	Server Host file for CruzSafe
 */

"use strict";

const express = require("express");
const passport = require("passport");
const passport_SAML = require("passport-saml").Strategy;
const bodyParser = require("body-parser");
const cors = require("cors");

/*passport.use(
    new passport_SAML({ path: "", entryPoint: "", issuer: "" }, function(
        profile,
        done
    ) {
        findByEmail(profile.email, function(err, user) {
            if (err) {
                return done(err);
            }
            return done(null, user);
        });
    })
);*/

// Imports of our files
const myConsole = require("./backend/utilities/customConsole");
const users = require("./backend/routes/users");
const reports = require("./backend/routes/reports");
const messages = require("./backend/routes/messages");

const app = express();

app.use(cors());
// Sets up app to allow for JSON parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Use the Router on the sub routes
app.use("/api/users", users);
app.use("/api/reports", reports);
app.use("/api/messages", messages);

// Sets default page to welcome.html
app.get("/", function(req, res) {
    res.sendFile("welcome.html", {
        root: __dirname + "/public"
    });
});

// "Redirects" '/welcome.html' to '/'; just for consistency with url and to catch before authentication check
app.get("/welcome.html", function(req, res) {
    res.redirect("/");
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

/*
 *  Sets up an interval timer to handle the clearing of reports
 *  Executes once per day (in milliseconds)
 */
setInterval(clearExpiredReports, 86400000);

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
/*
 *  Function used to clear all reports that have passed their expiry date
 *  TODO: Implement a proper function that accomplishes this
 */
function clearExpiredReports() {}
