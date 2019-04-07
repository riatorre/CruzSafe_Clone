/*
 * users.js
 * Routing for Users API
 */
const express = require("express");
const router = express.Router();
const connectionPool = require("../DB/config");

/*
 * Given a webID, returns the user privilege level.
 */
router.post("/checkPrivilege", function(req, res) {
    const query = "SELECT role FROM webUsers WHERE webID = " + req.body.webID;
    connectionPool.handleAPI(
        req.body.webID,
        null,
        1,
        query,
        val => {
            res.json(val);
        },
        () => {
            res.json({ message: "An Error has Occured" });
        }
    );
});

/*
 *  Code to get the information from a user given a user ID.
 */
router.post("/checkID", function(req, res) {
    const query =
        "SELECT * FROM mobileUsers WHERE email = " +
        connectionPool.sanitizeString(req.body.email);
    connectionPool.handleAPI(
        null,
        req.body.email,
        0,
        1,
        query,
        val => {
            res.json(val);
        },
        () => {
            res.json({ message: "An Error has Occurred." });
        }
    );
});

/*
 * Code to create a new user id; takes in body.firstName, body.lastName, body.email.
 * Returns mobileID.
 */
router.post("/newID", function(req, res) {
    const firstName = connectionPool.sanitizeString(req.body.firstName);
    const lastName = connectionPool.sanitizeString(req.body.lastName);
    const email = connectionPool.sanitizeString(req.body.email);
    const query =
        "INSERT INTO mobileUsers (firstName, lastName, email) VALUES (" +
        firstName +
        ", " +
        lastName +
        ", " +
        email +
        ") ON DUPLICATE KEY UPDATE mobileID =LAST_INSERT_ID(mobileID), firstName = " +
        firstName +
        ", lastName = " +
        lastName +
        ", email = " +
        email;
    connectionPool.handleAPI(
        null,
        [firstName, lastName, email],
        0,
        3,
        query,
        val => {
            res.json(val.insertId);
        },
        () => {
            res.json({ message: "An Error has Occurred." });
        }
    );
});

router.post("/checkFirstLogin", function(req, res) {
    const query =
        "SELECT firstLogin FROM mobileUsers WHERE mobileID = " +
        req.body.mobileID;
    connectionPool.handleAPI(
        req.body.mobileID,
        null,
        1,
        1,
        query,
        val => {
            res.json(val);
        },
        () => {
            res.json({ message: "An Error has Occured" });
        }
    );
});

router.post("/updateLogin", function(req, res) {
    const query =
        "UPDATE mobileUsers SET firstLogin = 0 WHERE mobileID = " +
        req.body.mobileID;
    connectionPool.handleAPI(
        req.body.mobileID,
        null,
        1,
        1,
        query,
        () => {
            res.json({ message: "Update Successful" });
        },
        () => {
            res.json({ message: "An Error has Occured" });
        }
    );
});

module.exports = router;
