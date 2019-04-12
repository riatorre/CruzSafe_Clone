/*
 *	app.js
 *	Server Host file for CruzSafe
 */

"use strict";

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const passport_SAML = require("passport-saml").Strategy;
const localStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const cors = require("cors");

// Imports of our files
const connectionPool = require("./backend/DB/config");
const myConsole = require("./backend/utilities/customConsole");
const users = require("./backend/routes/users");
const reports = require("./backend/routes/reports");
const messages = require("./backend/routes/messages");
const facilities = require("./backend/routes/facilities");
const assignments = require("./backend/routes/assignments");

const app = express();

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(id, cb) {
    findById(id, function(err, user) {
        cb(err, user);
    });
});

function findById(id, cb) {
    const query = "SELECT * FROM webUsers WHERE webID = " + id;
    connectionPool.handleAPI(
        id,
        null,
        1,
        1,
        query,
        user => {
            cb(null, user);
        },
        err => {
            cb(err, null);
        }
    );
}

// Allow for Cross Origin Requests
app.use(cors());
// Sets up app to allow for JSON parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/favicon.ico", function(req, res) {
    res.sendFile("favicon.ico", { root: __dirname + "/public" });
});
app.use(express.static(__dirname + "/public/static"));

//Use the Router on the sub routes
app.use("/api/users", users);
app.use("/api/reports", reports);
app.use("/api/messages", messages);
app.use("/api/facilities", facilities);
app.use("/api/assignments", assignments);

app.use(
    session({
        secret: "REEEEEE",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

app.use(passport.initialize());
app.use(passport.session());

// SAML Strategy for Passport; Utilizes Shibboleth
/*passport.use(
    new passport_SAML(
        {
            path: "",
            entryPoint: "https://login.ucsc.edu/idp/shibboleth",
            issuer: "https://cruzsafe.appspot.com/shibboleth"
        },
        function(profile, done) {
            findByEmail(profile.email, function(err, user) {
                if (err) {
                    return done(err);
                }
                return done(null, user);
            });
        }
    )
);*/

// Local Strategy for Passport
passport.use(
    new localStrategy(function(username, password, done) {
        const query =
            "SELECT webID FROM webUsers WHERE username = '" +
            username +
            "' AND PW = '" +
            password +
            "'";
        connectionPool.handleAPI(
            null,
            null,
            0,
            0,
            query,
            val => {
                if (val) {
                    return done(null, val[0].webID);
                } else {
                    return done(null, false);
                }
            },
            err => {
                return done(err);
            }
        );
    })
);

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

// Catch for login.html; allows for user to navigate here w/o authentication
app.get("/login.html", function(req, res) {
    res.sendFile("login.html", {
        root: __dirname + "/public"
    });
});

// Handles form data for login.html; Logs user in
app.post("/login.html", function(req, res, next) {
    passport.authenticate(
        "local",
        function(err, user, info) {
            if (err) {
                myConsole.error(err);
            } else if (info) {
                myConsole.log(info);
            } else {
                req.login(user, function(err) {
                    if (err) {
                        myConsole.error(err);
                    } else {
                        res.redirect("/homepage.html");
                    }
                });
            }
        },
        { successRedirect: "/homepage.html", failureRedirect: "/login.html" }
    )(req, res, next);
});

// Sets up Access Control for any page that is not the welcome page
// Only affects html pages; should not affect APIs, images, css, js, etc pages/files
// Uncomment out portion below in order to enable Authentication Verification
app.use(/^\/(.*)\.html\/?$/i, verifyAuthentication);

// Serves the rest of the HTML files as static files
app.use(express.static(__dirname + "/public"));

app.get("*", function(req, res) {
    res.status(404).sendFile("404.html", { root: __dirname });
});

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
        return next();
    }
    res.redirect("/");
}
/*
 *  Function used to clear all reports that have passed their expiry date
 *  TODO: Implement a proper function that accomplishes this
 */
function clearExpiredReports() {}
