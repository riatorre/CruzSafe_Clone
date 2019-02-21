var express = require("express");
var router = express.Router();
var connection = require("../DB/config");
var myConsole = require("../utilities/customConsole");

/*
 *  Code to get the information from a user given a user ID.
 */
router.post("/checkID", function(req, res) {
    myConsole.log(
        "[Database] Attempting to get mobileID from email = " + req.body.email
    );
    connection.query(
        "SELECT * FROM mobileUsers WHERE email=?",
        req.body.email,
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has Occured" });
            } else {
                myConsole.log(
                    "[Database] All mobileID by email = " +
                        req.body.email +
                        " have been selected"
                );
                res.json(rows);
            }
        }
    );
});

/*
 * Code to create a new user id; takes in body.firstName, body.lastName, body.email.
 * Returns mobileID.
 */
router.post("/newID", function(req, res) {
    myConsole.log(
        "[Database] Attempting create new ID with email = " +
            req.body.email +
            " firstName = " +
            req.body.firstName +
            " lastName = " +
            req.body.lastName
    );
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var query =
        "INSERT IGNORE INTO mobileUsers (firstName, lastName, email) VALUES (?, ?, ?)";
    connection.query(query, [firstName, lastName, email], function(err, rows) {
        if (err) {
            myConsole.error(err);
            res.json({ message: "An Error has Occured" });
        } else {
            myConsole.log("[Database] A user has been created.");
        }
    });
    connection.query("SELECT LAST_INSERT_ID()", function(err, rows) {
        if (err) {
            myConsole.error(err);
            res.json({ message: "An Error has Occured" });
        } else {
            myConsole.log("[Database] Returned user ID.");
            res.json(rows);
        }
    });
});

module.exports = router;
