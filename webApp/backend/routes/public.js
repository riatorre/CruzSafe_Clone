/*
 *  public.js
 *  Routing file for all "public" routes
 *  Sets the default page to the welcome page and restricts access based on Authentication
 */
const express = require("express");
const router = express.Router();
const myConsole = require("../utilities/customConsole");

// Converts directory name to utilize public folder rather than current folder
const mainDir = __dirname.replace("\\backend\\routes", "\\public\\");

// Sets default page to welcome.html
router.get("/", function(req, res) {
    res.sendFile("welcome.html", {
        root: mainDir
    });
});

// Sets up Access Control for any page that is not the welcome page
// Only affects html pages; should not affect APIs, images, css, js, etc pages/files
// Uncomment out portion below in order to enable Authentication Verification
router.get("/*.html" /* verifyAuthentication*/);

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

module.exports = router;
