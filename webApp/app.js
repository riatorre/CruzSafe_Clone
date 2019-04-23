/*
 *	app.js
 *	Server Host file for CruzSafe
 */

"use strict";

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const passport_SAML = require("passport-saml").Strategy;
const bodyParser = require("body-parser");
const cors = require("cors");
var fs = require("fs");

// Imports of our files
const connectionPool = require("./backend/DB/config");
const myConsole = require("./backend/utilities/customConsole");
const users = require("./backend/routes/users");
const reports = require("./backend/routes/reports");
const messages = require("./backend/routes/messages");
const facilities = require("./backend/routes/facilities");
const assignments = require("./backend/routes/assignments");

const app = express();

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

app.get("/testing.html", function(req, res) {
    res.sendFile("testing.html", {
        root: __dirname + "/public"
    });
});

app.get("/gridTesting.html", function(req, res) {
    res.sendFile("gridTesting.html", {
        root: __dirname + "/public"
    });
});

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(user, cb) {
    cb(null, user);
});

// SAML Strategy for Passport; Utilizes Shibboleth

const cert = fs.readFileSync("./backend/Shibboleth/sp-cert.pem", "utf-8");
const key = fs.readFileSync("./backend/Shibboleth/sp-key.pem", "utf-8");

const ShibbolethCert =
    "MIIDmDCCAoACCQDLTquv7ZdiLTANBgkqhkiG9w0BAQsFADCBjTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExEzARBgNVBAcMClNhbnRhIENydXoxLTArBgNVBAoMJFVuaXZlcnNpdHkgb2YgQ2FsaWZvcm5pYSwgU2FudGEgQ3J1ejEMMAoGA1UECwwDSVRTMRcwFQYDVQQDDA5sb2dpbi51Y3NjLmVkdTAeFw0xNTA2MDIyMzE3NDJaFw0yMDA1MzEyMzE3NDJaMIGNMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTETMBEGA1UEBwwKU2FudGEgQ3J1ejEtMCsGA1UECgwkVW5pdmVyc2l0eSBvZiBDYWxpZm9ybmlhLCBTYW50YSBDcnV6MQwwCgYDVQQLDANJVFMxFzAVBgNVBAMMDmxvZ2luLnVjc2MuZWR1MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs8RybvRl9WBJDpXGOsoBrEfFKsAuwnz0sSFmjI4zkkV7WXuX2lLbBPhOnJdKbrXL11J6mDZgf8ydhH31nJJvP98bHo0LQIXe2t1dfLVinhtpOy3TQguQ7Biipwe4g0E+HI4U9ndL7jEO/Xf2diMGCSOKyZjSubSYFpgXj0ORpvixqsAId0R0JLA4Xf4OV8+l6BqlB7DwzzeZcf49pSq8CCP8QkgU3DzaemNM6Yvqtu1cTpYJ9HqRV2aRGj+GOOMVshmJ+8iDr02U5jh+0E+5485lNKb7gWHNA7kLa0QBWm4eBAU0DYQzgnuVG2OeHpP1mKsc77wBkfScyGlOcKvCNQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAZBRvJsHdjLTtoPfa8MuuL3KcyE9dj9rWHeyrnEuWuMfhO95BN6utPkneoOsDKZORHDAVELTrZ4E4iq36xLWarv+37jh2U7EFFqW4zVm/0Pmoa+NtnKTs78tF80n4+Zwt2iPSIJS0ZPHiNl2XYjNb7auwUK2XvpqBqh8rP63+nSEHmgFOzg01nWoJz2Q0uQ7C0mEV6aai0jp7M5se6pgnauX2g28ZyFORa5H0DO8Ku0SY8l9lTKRgXgsEOk8b2jJwuYnHu2dafiqrLOkdpKFPczD6ZGIx6eofqKmMeT4x+rZSvIZsq1j1wRw04gzQTHWCuEb+aN4x9ogtc8tHKC0O7";
const SSOCircleCert =
    "MIIEYzCCAkugAwIBAgIDIAZmMA0GCSqGSIb3DQEBCwUAMC4xCzAJBgNVBAYTAkRFMRIwEAYDVQQKDAlTU09DaXJjbGUxCzAJBgNVBAMMAkNBMB4XDTE2MDgwMzE1MDMyM1oXDTI2MDMwNDE1MDMyM1owPTELMAkGA1UEBhMCREUxEjAQBgNVBAoTCVNTT0NpcmNsZTEaMBgGA1UEAxMRaWRwLnNzb2NpcmNsZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCAwWJyOYhYmWZF2TJvm1VyZccs3ZJ0TsNcoazr2pTWcY8WTRbIV9d06zYjngvWibyiylewGXcYONB106ZNUdNgrmFd5194Wsyx6bPvnjZEERny9LOfuwQaqDYeKhI6c+veXApnOfsY26u9Lqb9sga9JnCkUGRaoVrAVM3yfghv/Cg/QEg+I6SVES75tKdcLDTt/FwmAYDEBV8l52bcMDNF+JWtAuetI9/dWCBe9VTCasAr2Fxw1ZYTAiqGI9sW4kWS2ApedbqsgH3qqMlPA7tg9iKy8Yw/deEn0qQIx8GlVnQFpDgzG9k+jwBoebAYfGvMcO/BDXD2pbWTN+DvbURlAgMBAAGjezB5MAkGA1UdEwQCMAAwLAYJYIZIAYb4QgENBB8WHU9wZW5TU0wgR2VuZXJhdGVkIENlcnRpZmljYXRlMB0GA1UdDgQWBBQhAmCewE7aonAvyJfjImCRZDtccTAfBgNVHSMEGDAWgBTA1nEA+0za6ppLItkOX5yEp8cQaTANBgkqhkiG9w0BAQsFAAOCAgEAAhC5/WsF9ztJHgo+x9KV9bqVS0MmsgpG26yOAqFYwOSPmUuYmJmHgmKGjKrj1fdCINtzcBHFFBC1maGJ33lMk2bM2THx22/O93f4RFnFab7t23jRFcF0amQUOsDvltfJw7XCal8JdgPUg6TNC4Fy9XYv0OAHc3oDp3vl1Yj8/1qBg6Rc39kehmD5v8SKYmpE7yFKxDF1ol9DKDG/LvClSvnuVP0b4BWdBAA9aJSFtdNGgEvpEUqGkJ1osLVqCMvSYsUtHmapaX3hiM9RbX38jsSgsl44Rar5Ioc7KXOOZFGfEKyyUqucYpjWCOXJELAVAzp7XTvA2q55u31hO0w8Yx4uEQKlmxDuZmxpMz4EWARyjHSAuDKEW1RJvUr6+5uA9qeOKxLiKN1jo6eWAcl6Wr9MreXR9kFpS6kHllfdVSrJES4ST0uh1Jp4EYgmiyMmFCbUpKXifpsNWCLDenE3hllF0+q3wIdu+4P82RIM71n7qVgnDnK29wnLhHDat9rkC62CIbonpkVYmnReX0jze+7twRanJOMCJ+lFg16BDvBcG8u0n/wIDkHHitBI7bU1k6c6DydLQ+69h8SCo6sO9YuD+/3xAGKad4ImZ6vTwlB4zDCpu6YgQWocWRXE+VkOb+RBfvP755PUaLfL63AFVlpOnEpIio5++UjNJRuPuAA=";
/*
var SSOCircle = new passport_SAML(
    {
        protocol: "http://",
        host: "169.233.232.43:8080",
        path: "/login/callback",
        issuer: "http://169.233.232.43:8080",
        entryPoint:
            "https://idp.ssocircle.com/sso/idpssoinit?metaAlias=%2Fpublicidp&spEntityID=http://169.233.232.43:8080",
        cert: SSOCircleCert,
        decryptionPvk: key,
        privateCert: key,
        logoutCallbackUrl: "http://169.233.232.43:8080/logout/callback"
    },
    function(profile, done) {
        return done(null, profile);
    }
);

passport.use(SSOCircle);

/* */

var Shibboleth = new passport_SAML(
    {
        protocol: "https://",
        host: "cruzsafe.appspot.com",
        path: "/login/callback",
        issuer: "https://cruzsafe.appspot.com/shibboleth",
        entryPoint: "https://login.ucsc.edu/idp/profile/SAML2/Redirect/SSO",
        cert: ShibbolethCert,
        decryptionPvk: key,
        privateCert: key,
        logoutCallbackUrl: "https://cruzsafe.appspot.com/logout/callback"
    },
    function(profile, done) {
        return done(null, profile);
    }
);

passport.use(Shibboleth);

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

// Redirects to SAML login (Shibboleth); first portion is fine, need to fix in order to sort between Mobile and Web Requests
app.get(
    "/login",
    function(req, res, next) {
        //console.log(req.query);
        const redirect_Url = req.query.redirect_uri;
        req.session.redirect_Url = redirect_Url;
        //console.log(req.session.redirect_Url);
        return next();
    },
    passport.authenticate("saml", {
        failureRedirect: "/",
        failureFlash: true
    })
);

//Callback path for SAML login
app.post(
    "/login/callback",
    passport.authenticate("saml", {
        failureRedirect: "/",
        failureFlash: true
    }),
    function(req, res) {
        const { redirect_Url } = req.session;
        //console.log(req.user);
        const redirectUrl = redirect_Url
            ? `${redirect_Url}?user=${JSON.stringify(req.user)}`
            : "/homepage.html";
        req.session.redirect_Url = undefined;
        //console.log(`Returning to: ${redirectUrl}`);
        res.redirect(redirectUrl);
    }
);

/*
app.get("/Shibboleth.sso/Metadata", function(req, res) {
    fs.writeFileSync(
        "Metadata.xml",
        Shibboleth.generateServiceProviderMetadata(cert, cert)
    );
    res.sendFile("Metadata.xml", { root: __dirname });
});*/

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
// * NOTE! Comment this function out if you want to run locally, and only navagate using URL.
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
