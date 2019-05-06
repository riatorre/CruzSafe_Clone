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

// Send email notification when new report is assigned
router.post("/emailNotification", function(req, res) {
    let nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: "cruzsafe2019@gmail.com",
            pass: "BananaSlugs"
        }
    });

    let mailOptions = {
        from: "cruzsafe2019@gmail.com",
        to: req.body["email"],
        subject: "Send to facility",
        text: "Success"
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
