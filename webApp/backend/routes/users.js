const express = require("express");
const router = express.Router();
const connection = require("../DB/config");
const myConsole = require("../utilities/customConsole");

/*
 * Given a webID, returns the user privilege level.
 */
router.post("/privilege", function(req, res) {
    myConsole.log(
        "[Database] Attempting to get privilege from webID = " + req.body.webID
    );
    connection.query(
        "SELECT role FROM mobileUsers WHERE webID=?",
        req.body.webID,
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has Occured" });
            } else {
                myConsole.log(
                    "[Database] Got privilege from webID = " + req.body.webID
                );
                res.json(rows);
            }
        }
    );
});

router.post("/insertToken", function(req, res) {
    myConsole.log("[Database] Attempting to set token for" + req.body.mobileID);
    connection.query(
        "UPDATE mobileUsers SET token = " +
            JSON.stringify(req.body.token) +
            " WHERE mobileID = " +
            req.body.mobileID,
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has Occured" });
            } else {
                myConsole.log(
                    "[Database] set token for mobileID = " + req.body.mobileID
                );
                res.json(rows);
            }
        }
    );
});

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
        "INSERT INTO mobileUsers (firstName, lastName, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE mobileID =LAST_INSERT_ID(mobileID), firstName =?, lastName = ?, email=?";
    connection.query(
        query,
        [firstName, lastName, email, firstName, lastName, email],
        function(err) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has Occured" });
            } else {
                myConsole.log("[Database] A user has been created.");
            }
        }
    );
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
