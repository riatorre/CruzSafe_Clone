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
router.post("/", function(req, res) {
    myConsole.log(
        "[Database] Attempting to select reports with ids = " + req.body.id
    );

    // Convert string of reportIDs into an array and complete query.
    var reportIDs = JSON.parse(req.body.id);
    var query =
        "SELECT * FROM reports LEFT JOIN mobileUsers ON reports.mobileID = mobileUsers.mobileID WHERE reportID = ";
    for (i = 0; i < reportIDs.length; i++) {
        if (i == 0) {
            query = query + reportIDs[i];
        } else {
            query = query + " OR reportID = " + reportIDs[i];
        }
    }
    query =
        query +
        " ORDER BY initialOpenTS IS NULL DESC, initialOpenTS IS NOT NULL AND completeTS IS NULL DESC, completeTS IS NOT NULL DESC, reportTS DESC"; // Ordering clause
    connection.query(query, function(err, rows, fields) {
        if (err) {
            myConsole.error(err);
            res.json({ message: "An Error has occured" });
        } else {
            myConsole.log("[Database] Select all reports Successful");
            res.json(rows);
        }
    });
});

/*
    Given a dictionary of key: value = columnTitle:value,
    returns all reportIDs adhering to those constraints.

    Requires dict to be passed in body.
*/
router.post("/specifyReportIDs", function(req, res) {
    myConsole.log(
        "[Database] Attempting to select reportIDs adhering to specific values"
    );

    // Interpret passed JSON string to dictionary
    var filters = {};
    var dictionary = JSON.parse(req.body.dict);
    for (var key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            var value = dictionary[key];
            filters[key] = value;
        }
    }

    // Dictionary populated, construct query.
    var query =
        "SELECT reportID FROM reports LEFT JOIN mobileUsers ON reports.mobileID = mobileUsers.mobileID";
    if (Object.keys(filters).length != 0) {
        // If anything in dictionary
        query = query + " WHERE "; // Add an initial where clause
        var firstItem = true;
        for (var key in filters) {
            const value = "" + filters[key];
            // For each item in dictionary
            if (!firstItem) {
                query = query + " AND "; // If not first item, etc.
            }
            if (value.startsWith("LIKE ")) {
                query = query + key + " " + value; // EX) SELECT reportID FROM reports WHERE column LIKE '${$needle}$'
                firstItem = false;
            } else if (value.startsWith("IS ")) {
                query = query + key + " " + value; // EX) SELECT reportID FROM reports WHERE column IS NOT NULL'
                firstItem = false;
            } else {
                query = query + key + " = " + value;
                firstItem = false;
            }
        }
        query =
            query +
            " ORDER BY initialOpenTS IS NULL DESC, initialOpenTS IS NOT NULL AND completeTS IS NULL DESC, completeTS IS NOT NULL DESC, reportTS DESC;"; // Ordering clause
        connection.query(query, function(err, rows) {
            if (err) {
                myConsole.error(err);
                res.json({
                    message: "[Database] An Error has occured: query = " + query
                });
            } else {
                myConsole.log(
                    "[Database] Select all reportIDs Successful: query = " +
                        query
                );
                res.json(rows);
            }
        });
    } else {
        res.json({ message: "[Database] Nothing found! Query = " + query });
    }
});

// Get all tags
router.post("/tags", function(req, res) {
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
router.post("/reportIDs", function(req, res) {
    myConsole.log(
        "[Database] Attempting to select all reportIDs ORDER BY initialOpenTS IS NULL DESC, initialOpenTS IS NOT NULL AND completeTS IS NULL DESC, completeTS IS NOT NULL DESC, reportTS DESC"
    );
    connection.query(
        "SELECT reportID FROM reports ORDER BY initialOpenTS IS NULL DESC, initialOpenTS IS NOT NULL AND completeTS IS NULL DESC, completeTS IS NOT NULL DESC, reportTS DESC",
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has occured" });
            } else {
                myConsole.log("[Database] Select all reportIDs Successful");
                res.json(rows);
            }
        }
    );
});

// Get Report by internal ID #, should return either 0 or 1 entry
router.post("/reportID", function(req, res) {
    myConsole.log(
        "[Database] Attempting to select report with reportID = " + req.body.id
    );
    connection.query(
        "SELECT * FROM reports LEFT JOIN mobileUsers ON reports.mobileID = mobileUsers.mobileID WHERE reportID = ?",
        req.body.id,
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has occured" });
            } else {
                myConsole.log("[Database] Select by reportID Successful");
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
router.post("/incidentID", function(req, res) {
    myConsole.log(
        "[Database] Attempting to select report with incidentID = " +
            req.body.id
    );
    connection.query(
        "SELECT * FROM reports WHERE incidentID = ?",
        req.body.id,
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has occured" });
            } else {
                myConsole.log("[Database] Select by incidentID Successful");
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

/*
 *  Function that submits a single Report by given user
 */
router.post("/submitReport", function(req, res) {
    myConsole.log("[Database] Attempting to submit a new report");
    // Sets up values to be inserted into the table
    var values = [
        [
            req.body.mobileID,
            req.body.incidentDesc,
            req.body.incidentLocationDesc,
            req.body.incidentCategory
        ]
    ];
    connection.query(
        "INSERT INTO reports (mobileID, body, location, tag) VALUES ?",
        [values],
        function(err, result) {
            if (err) {
                // An error has occured during insertion.
                // Details are logged into console while user is given a generic message
                myConsole.error(err);
                res.json({ message: "An Error has Occurred" });
            } else {
                // This is used to set up incidentID to equal the reportID
                // Should default the report as a unique incident
                connection.query(
                    "UPDATE reports SET incidentID = ? WHERE reportID = ?",
                    [result.insertId, result.insertId]
                );
                // Logs Success & returns the "incident" ID
                myConsole.log(
                    "[Database] New report successfully submitted as ID = " +
                        result.insertId
                );
                res.json({ incidentID: result.insertId });
            }
        }
    );
});

/*
 *  Function that grabs all reports made by given user
 */
router.post("/userReports", function(req, res) {
    myConsole.log(
        "[Database] Attempting to get all reports for mobileID = " +
            req.body.mobileID
    );
    connection.query(
        "SELECT * FROM reports WHERE mobileID=?",
        req.body.mobileID,
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has Occured" });
            } else {
                myConsole.log(
                    "[Database] All reports by mobileID = " +
                        req.body.mobileID +
                        " have been selected"
                );
                res.json(rows);
            }
        }
    );
});

module.exports = router;
