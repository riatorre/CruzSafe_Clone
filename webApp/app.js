/*
 *	app.js
 *	Server Host file for CruzSafe
 *  API routes defined in ./backend/routes
 *  Database Connection defined in ./backend/DB
 *  SAML Core Files are in ./backend/Shibboleth
 *  Customized console defined in ./backend/utilities
 *  Core Routes, SAML SSO Definition, and cookies are defined here
 *  Custom 404 Page defined in ./404.html
 */

"use strict";

const localTest = true; // Global variable for debugging purposes.

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport_SAML = require("passport-saml").Strategy;
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

// Imports of our files
const connectionPool = require("./backend/DB/config");
const myConsole = require("./backend/utilities/customConsole");
const users = require("./backend/routes/users");
const reports = require("./backend/routes/reports");
const messages = require("./backend/routes/messages");
const facilities = require("./backend/routes/facilities");
const assignments = require("./backend/routes/assignments");

const app = express();

const aPIKey = "AIzaSyDi4bKzq04VojQXEGXec4wDsdRVZhht5vY";

const googleMapsClient = require("@google/maps").createClient({
  key: aPIKey
});

// Production Level Session Store
let sessionStore = new MySQLStore(
  {
    // auto clear expired
    clearExpired: true,
    // Check every hour
    checkExpirationInterval: 3600000,
    // Lasts 8 hours
    expiration: 28800000,
    createDatabaseTable: true
  },
  connectionPool
);

// Session Configuration
app.use(
  session({
    secret: "CruzSafe_WebApp_Secret_Key",
    httpOnly: true,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    maxAge: 28800000,
    name: "CruzSafe_Connection",
    cookie: { secure: false }
  })
);

// Allow for Cross Origin Requests
app.use(cors());
// Sets up app to allow for JSON parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Website Icon
app.get("/favicon.ico", (req, res) => {
  res.sendFile("favicon.ico", { root: __dirname + "/public" });
});

// Serve Static Resources; stylesheets, JS Libs, images,
app.use(express.static(__dirname + "/public/static"));

// caching disabled for every route
app.use(function(req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

//Use the Router on the sub routes
// User related APIs
app.use("/api/users", users);
// Report related APIs
app.use("/api/reports", reports);
// Message related APIs
app.use("/api/messages", messages);
// Facilities related APIs
app.use("/api/facilities", facilities);
// Assignments related APIs
app.use("/api/assignments", assignments);

app.get("*", (req, res, next) => {
  if (localTest) {
    res.cookie("cruzsafe_webID", 1, {
      httpOnly: false,
      secure: false,
      secret: "CruzSafe_WebApp_Secret_Key"
    });
  }
  next();
});

// Sets default page to welcome.html
app.get("/", (req, res) => {
  res.sendFile("welcome.html", {
    root: __dirname + "/public"
  });
});

// "Redirects" '/welcome.html' to '/'; just for consistency with url and to catch before authentication check
app.get("/welcome.html", (req, res) => {
  res.redirect("/");
});

// CSS Testing Page
app.get("/testing.html", (req, res) => {
  res.sendFile("testing.html", {
    root: __dirname + "/public"
  });
});

// CSS Grid Testing Page
app.get("/gridTesting.html", (req, res) => {
  res.sendFile("gridTesting.html", {
    root: __dirname + "/public"
  });
});

// For use in serializing User into Session
passport.serializeUser((user, cb) => {
  cb(null, user);
});

// For use with getting info from User Session
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// SAML Strategy for Passport; Utilizes Shibboleth

// Certificate for our Host
const cert = fs.readFileSync("./backend/Shibboleth/sp-cert.pem", "utf-8");
// Key for our Host
const key = fs.readFileSync("./backend/Shibboleth/sp-key.pem", "utf-8");

// Certificate from Shibboleth IDP
const ShibbolethCert =
  "MIIDmDCCAoACCQDLTquv7ZdiLTANBgkqhkiG9w0BAQsFADCBjTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExEzARBgNVBAcMClNhbnRhIENydXoxLTArBgNVBAoMJFVuaXZlcnNpdHkgb2YgQ2FsaWZvcm5pYSwgU2FudGEgQ3J1ejEMMAoGA1UECwwDSVRTMRcwFQYDVQQDDA5sb2dpbi51Y3NjLmVkdTAeFw0xNTA2MDIyMzE3NDJaFw0yMDA1MzEyMzE3NDJaMIGNMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTETMBEGA1UEBwwKU2FudGEgQ3J1ejEtMCsGA1UECgwkVW5pdmVyc2l0eSBvZiBDYWxpZm9ybmlhLCBTYW50YSBDcnV6MQwwCgYDVQQLDANJVFMxFzAVBgNVBAMMDmxvZ2luLnVjc2MuZWR1MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs8RybvRl9WBJDpXGOsoBrEfFKsAuwnz0sSFmjI4zkkV7WXuX2lLbBPhOnJdKbrXL11J6mDZgf8ydhH31nJJvP98bHo0LQIXe2t1dfLVinhtpOy3TQguQ7Biipwe4g0E+HI4U9ndL7jEO/Xf2diMGCSOKyZjSubSYFpgXj0ORpvixqsAId0R0JLA4Xf4OV8+l6BqlB7DwzzeZcf49pSq8CCP8QkgU3DzaemNM6Yvqtu1cTpYJ9HqRV2aRGj+GOOMVshmJ+8iDr02U5jh+0E+5485lNKb7gWHNA7kLa0QBWm4eBAU0DYQzgnuVG2OeHpP1mKsc77wBkfScyGlOcKvCNQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAZBRvJsHdjLTtoPfa8MuuL3KcyE9dj9rWHeyrnEuWuMfhO95BN6utPkneoOsDKZORHDAVELTrZ4E4iq36xLWarv+37jh2U7EFFqW4zVm/0Pmoa+NtnKTs78tF80n4+Zwt2iPSIJS0ZPHiNl2XYjNb7auwUK2XvpqBqh8rP63+nSEHmgFOzg01nWoJz2Q0uQ7C0mEV6aai0jp7M5se6pgnauX2g28ZyFORa5H0DO8Ku0SY8l9lTKRgXgsEOk8b2jJwuYnHu2dafiqrLOkdpKFPczD6ZGIx6eofqKmMeT4x+rZSvIZsq1j1wRw04gzQTHWCuEb+aN4x9ogtc8tHKC0O7";

// Shibboleth SAML Strategy Definition
let Shibboleth = new passport_SAML(
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
  (profile, done) => {
    return done(null, profile);
  }
);

passport.use(Shibboleth);

// Function used to prepare SAML (Shibboleth) logout
//"nameID":"ali64@ucsc.edu"
//"nameIDFormat":"urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
passport.logoutSaml = (req, res) => {
  //Here add the nameID and nameIDFormat to the user if you stored it someplace.
  console.log(req.session.userCore);
  req.user.nameID = req.session.userCore.nameID;
  req.user.nameIDFormat = req.session.userCore.nameIDFormat;

  Shibboleth.logout(req, function(err, request) {
    if (!err) {
      //redirect to the IdP Logout URL
      res.redirect(request);
    } else {
      console.log(err);
    }
  });
};

// Callback function to return to welcome screen after SAML (Shibboleth) logout
passport.logoutSamlCallback = (req, res) => {
  req.logout();
  res.redirect("/");
};

app.use(passport.initialize());
app.use(passport.session());

// Redirects to SAML login (Shibboleth); first portion is fine, need to fix in order to sort between Mobile and Web Requests
app.get(
  "/login",
  (req, res, next) => {
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
  (req, res) => {
    const { redirect_Url } = req.session;
    console.log(req.session);
    const { user } = req;
    const userCore = {
      firstName: user["urn:oid:2.5.4.42"],
      lastName: user["urn:oid:2.5.4.4"],
      email: user["email"],
      nameID: user["nameID"],
      nameIDFormat: user["nameIDFormat"]
    };
    //console.log(userCore);
    let redirectUrl = "";
    if (redirect_Url) {
      const query =
        "INSERT INTO mobileUsers (firstName, lastName, email) VALUES (" +
        connectionPool.sanitizeString(userCore.firstName) +
        ", " +
        connectionPool.sanitizeString(userCore.lastName) +
        ", " +
        connectionPool.sanitizeString(userCore.email) +
        ") ON DUPLICATE KEY UPDATE mobileID =LAST_INSERT_ID(mobileID), firstName = " +
        connectionPool.sanitizeString(userCore.firstName) +
        ", lastName = " +
        connectionPool.sanitizeString(userCore.lastName) +
        ", email = " +
        connectionPool.sanitizeString(userCore.email);
      connectionPool.handleAPI(
        null,
        [userCore.firstName, userCore.lastName, userCore.email],
        0,
        3,
        query,
        val => {
          req.session.mobileUserID = val.insertId;

          redirectUrl = `${redirect_Url}?user=${JSON.stringify(
            req.session.mobileUserID
          )}`;
          myConsole.log("redirect: " + redirectUrl);
          req.session.redirect_Url = undefined;
          req.session.userCore = userCore;
          res.redirect(redirectUrl);
        },
        () => {}
      );
    } else {
      const query =
        "SELECT * FROM webUsers WHERE firstName = " +
        connectionPool.sanitizeString(userCore.firstName) +
        "AND lastName = " +
        connectionPool.sanitizeString(userCore.lastName) +
        "AND email = " +
        connectionPool.sanitizeString(userCore.email);
      connectionPool.handleAPI(
        null,
        [userCore.firstName, userCore.lastName, userCore.email],
        0,
        3,
        query,
        val => {
          console.log(val[0]);
          if (val != null) {
            req.session.webUserID = val[0].webID;
            redirectUrl = "/homepage.html";
            req.session.userCore = userCore;
            res.cookie("cruzsafe_webID", val[0].webID, {
              maxAge: 28800000,
              httpOnly: false,
              secure: true,
              secret: "CruzSafe_WebApp_Secret_Key"
            });
            myConsole.log("redirect: " + redirectUrl);
            res.redirect(redirectUrl);
          } else {
            myConsole.log(
              "An Invalid User attempted to sign in; " +
                userCore.firstName +
                " " +
                userCore.lastName +
                "with email: " +
                userCore.email
            );
            res.redirect("/");
          }
        },
        () => {
          res.redirect("/");
        }
      );
    }
  }
);

// "https://cruzsafe.appspot.com/logout"
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// "https://cruzsafe.appspot.com/logout/callback"
app.get("/logout/callback", passport.logoutSamlCallback);

/*
// Generate Metadata for Shibboleth
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
if (!localTest) {
  app.use(/^\/(.*)\.html\/?$/i, verifyAuthentication);
}

// Serves the rest of the HTML files as static files
app.use(express.static(__dirname + "/public"));

// 404 Not Found; Catch all unmatched requests
app.get("*", (req, res) => {
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

// Modify all buildings to insert coordinates.
connectionPool.handleAPI(
  // GET ALL NULL BUILDINGS.
  null,
  null,
  0,
  0,
  "SELECT buildingKey, buildingStreet, buildingCity, buildingState FROM buildings WHERE buildingLat IS NULL AND buildingLng IS NULL",
  valBuildings => {
    console.log("Buildings is set to:");
    console.log(valBuildings);
    let buildings = valBuildings;
    // Got all the buildings.
    if (buildings.length > 0 && buildings) {
      // If no, for each one, run the google map API and insert the longitude and lattitude.
      Array.from(buildings).forEach(building => {
        let buildingAddress =
          building["buildingStreet"] +
          ", " +
          building["buildingCity"] +
          ", " +
          building["buildingState"]; // Concat all address into one string
        console.log("Gotten buildingAddress:");
        console.log(buildingAddress);

        googleMapsClient.geocode(
          {
            address: buildingAddress
          },
          (err, response) => {
            if (!err) {
              let googleResult = response.json.results;
              console.log("Gotten google result:");
              console.log(googleResult);
              let buildingLat = googleResult[0]["geometry"]["location"]["lat"];
              let buildingLng = googleResult[0]["geometry"]["location"]["lng"];
              let buildingKey = building["buildingKey"];

              // For each buildingKey, run through google maps API and insert into database.
              const buildingQuery =
                "UPDATE buildings SET buildingLat = " +
                buildingLat +
                ", buildingLng = " +
                buildingLng +
                " WHERE buildingKey = " +
                buildingKey;
              connectionPool.handleAPI(
                // UPDATE EACH NULL BUILDING LAT AND LONG
                [buildingLat, buildingLng, buildingKey],
                null,
                3,
                3,
                buildingQuery,
                () => {},
                () => {
                  myConsole.log(
                    "An Error has Occurred - Updating a building's lat and long."
                  );
                }
              );
            } else {
              console.log("Google Maps API call failed.");
            }
          }
        );
      });
    }
  },
  () => {
    myConsole.log(
      "An Error has occurred - Finding buildings that have null lat and long."
    );
  }
);
// END TANGENT.
