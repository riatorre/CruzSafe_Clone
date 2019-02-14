/*
 * reports.js
 * Routing for Reports API
 * MUST CONVERT TO "POST" AT SOME POINT
 * POST allows more data to be transfered, and does not allow
 * page to be bookmarked or cached.
 */

var express = require("express");
var router = express.Router();
var connection = require("../DB/config");
var myConsole = require("../utilities/customConsole");

// Get all reports, Default request
router.get("/", function(req, res) {
    myConsole.log("Attempting to select all reports");
    connection.query(
        "SELECT * FROM reports LEFT JOIN mobileUsers ON reports.mobileID = mobileUsers.mobileID",
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has occured" });
            } else {
                myConsole.log("Select all reports Successful");
                res.json(rows);
            }
        }
    );
});

// Get all tags
router.get("/tags", function(req, res) {
    myConsole.log("[Database] Attempting to select all tags");
    connection.query("SELECT * FROM tags", function(err, rows, fields) {
        if (err) {
            myConsole.error(err);
            res.json({ message: "An Error has occured" });
        } else {
            myConsole.log("[Database] Select all tags Successful");
            res.json(rows);
        }
    });
});

/*
    Get all of the reportIDs in the database.
*/
router.get("/reportIDs", function(req, res) {
    myConsole.log("[Database] Attempting to select all reportIDs");
    connection.query("SELECT reportID FROM reports", function(
        err,
        rows,
        fields
    ) {
        if (err) {
            myConsole.error(err);
            res.json({ message: "An Error has occured" });
        } else {
            myConsole.log("[Database] Select all reportIDs Successful");
            res.json(rows);
        }
    });
});

// Get Report by internal ID #, should return either 0 or 1 entry
router.get("/reportID=:id([0-9]+)", function(req, res) {
    console.log(
        "[Databse] Attempting to select report with reportID = " + req.params.id
    );
    connection.query(
        "SELECT * FROM reports LEFT JOIN mobileUsers ON reports.mobileID = mobileUsers.mobileID WHERE reportID = ?",
        req.params.id,
        function(err, rows, fields) {
            if (err) {
                console.error(err);
                res.json({ message: "An Error has occured" });
            } else {
                console.log("Select by reportID Successful");
                if (rows.length > 0) {
                    res.json(rows);
                } else {
                    res.json({
                        message: "No report with given reportID found"
                    });
                }
            }
        }
    );
});

// Get Report By Incident ID #, may return 0+ entries
router.get("/incidentID=:id([0-9]+)", function(req, res) {
    myConsole.log(
        "Attempting to select report with incidentID = " + req.params.id
    );
    connection.query(
        "SELECT * FROM reports WHERE incidentID = ?",
        req.params.id,
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has occured" });
            } else {
                myConsole.log("Select by incidentID Successful");
                if (rows.length > 0) {
                    res.json(rows);
                } else {
                    res.json({
                        message: "No report with given incidentID found"
                    });
                }
            }
        }
    );
});

module.exports = router;
