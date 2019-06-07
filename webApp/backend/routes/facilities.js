/*
    facilities.js; used to edit and retrive data of facilities database.
*/

const express = require("express");
const router = express.Router();
const connectionPool = require("../DB/config");

// Default request for facilities; returns list of all facilities and all data
router.post("/", function(req, res) {
    const query = "SELECT * FROM facilities";
    connectionPool.handleAPI(
        null,
        null,
        0,
        0,
        query,
        val => {
            res.json(val);
        },
        () => {
            res.json({ message: "An Error has occurred" });
        }
    );
});

// Grabs all of the webIDs of the people that are part of a given facilityID.
router.post("/webIDs", function(req, res) {
    const query =
        "SELECT webID FROM webUsers LEFT JOIN facilities ON webUsers.facilityID = facilities.facilityID WHERE facilities.facilityID = " +
        req.body.facilityID;
    connectionPool.handleAPI(
        req.body.facilityID,
        null,
        1,
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

// Grabs all of the webIDs of the people that are part of a given facilityID.
router.post("/setEmail", function(req, res) {
    const query =
        "UPDATE facilities SET facilityEmail = " +
        req.body.facilityEmail +
        " WHERE facilityID = " +
        req.body.facilityID;
    connectionPool.handleAPI(
        req.body.facilityID,
        req.body.facilityEmail,
        1,
        2,
        query,
        val => {
            res.json(val);
        },
        () => {
            res.json({ message: "An Error has Occurred. Query = " + query });
        }
    );
});

// Send email notification when new report is assigned
router.post("/emailNotification", function(req, res) {
    var nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: "ucsc.cruzsafe@gmail.com",
            pass: "CMPS_117"
        }
    });

    var mailOptions = {
        from: "ucsc.cruzsafe@gmail.com",
        to: req.body["email"],
        subject: "New report assigned",
        text: req.body["emailBody"]
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
});
// Adds a facility to the database and returns the facilityID; if already exists, returns that.

// Removes a facility from the database.

module.exports = router;
