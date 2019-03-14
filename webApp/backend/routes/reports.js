/*
 * reports.js
 * Routing for Reports API
 * MUST CONVERT TO "POST" AT SOME POINT
 * POST allows more data to be transfered, and does not allow
 * page to be bookmarked or cached.
 */

const express = require("express");
const path = require("path");
const router = express.Router();
const connection = require("../DB/config");
const myConsole = require("../utilities/customConsole");
const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

const numDays = 90; // number of days before a report expires

// Define where multer will store the incoming files and how to name them
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../../public/assets/images/upload"));
    },
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
});

// Google Cloud Definition to allow storage on GAE
var googleStorageConfig = {
    bucket: process.env.GCS_BUCKET,
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.GCS_KEYFILE,
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
};

// Generate the middleware that will be used to handle files
var upload = multer({
    storage: process.env.GCS_BUCKET
        ? multerGoogleStorage.storageEngine(googleStorageConfig)
        : storage
});

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

// Get notes joined with webID given a reportID.
router.post("/notes", function(req, res) {
    myConsole.log(
        "[Database] Attempting to select notes with reportID = " +
            req.body.reportID
    );
    connection.query(
        "SELECT * FROM reportNotes LEFT JOIN webUsers ON reportNotes.webID = webUsers.webID WHERE reportID = ?",
        req.body.reportID,
        function(err, rows) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has occured" });
            } else {
                myConsole.log(
                    "[Database] Select notes with reportID = " +
                        req.body.reportID +
                        " Sucessful"
                );
                res.json(rows);
            }
        }
    );
});

/*
    Given a new note with reportID, webID, and content.
*/
router.post("/newNote", function(req, res) {
    myConsole.log(
        "[Database] Attempting to add note with reportID, webID, and content of " +
            req.body.reportID +
            ", " +
            req.body.webID +
            ", " +
            req.body.content
    );
    connection.query(
        "INSERT INTO reportNotes (reportID, webID, content) VALUES (?,?,?)",
        [req.body.reportID, req.body.webID, req.body.content],
        function(err, rows) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has occured" });
            } else {
                myConsole.log(
                    "[Database] Successful in adding a note with reportID, webID, and content of " +
                        req.body.reportID +
                        ", " +
                        req.body.webID +
                        ", " +
                        req.body.content
                );
                res.json(rows);
            }
        }
    );
});

/*
 *  Function that submits a single Report by given user
 *  Needs fixing to allow proper storage of BOTH image and report
 *  Image is already stored with a file name defined way above, but
 *  The name does not match the reportID. Unsure as to how to change the name,
 *  But it may be easier to just store the file name in the DB alongside the other Report elements.
 */
router.post("/submitReport", upload.single("media"), function(req, res) {
    myConsole.log("[Database] Attempting to submit a new report");
    // Sets up values to be inserted into the table
    const attachment = req.file ? req.file.filename : null;
    const hasAttachment = attachment ? 1 : 0;
    const values = [
        [
            req.body.mobileID,
            req.body.incidentDesc,
            req.body.incidentLocationDesc,
            req.body.incidentCategory,
            req.body.incidentLatitude,
            req.body.incidentLongitude,
            req.body.incidentUnchangedLocation,
            hasAttachment,
            attachment,
            req.body.token
        ]
    ];
    connection.query(
        "INSERT INTO reports (mobileID, body, location, tag, latitude, longitude, unchangedLocation, attachments, filename, token) VALUES ?",
        [values],
        function(err, result) {
            if (err) {
                // An error has occured during insertion.
                // Details are logged into console while user is given a generic message
                myConsole.error(err);
                res.json({ message: "An Error has Occurred" });
            } else {
                // This is used to set up incidentID to equal the reportID
                // as well as define the expiry date & time.
                // 1st query gets the date that is officially recorded in the DB, then
                // adds numDays to the Date portion of the DateTime OBJ.
                // Should default the report as a unique incident
                connection.query(
                    "SELECT reportTS FROM reports WHERE reportID = ?",
                    result.insertId,
                    function(err, rows, fields) {
                        if (err) {
                            myConsole.log(err);
                        } else {
                            var expireTS = rows[0].reportTS;
                            expireTS.setDate(expireTS.getDate() + numDays);
                            connection.query(
                                "UPDATE reports SET incidentID = ?, expireTS = ? WHERE reportID = ?",
                                [result.insertId, expireTS, result.insertId]
                            );
                        }
                    }
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
        "SELECT * FROM reports WHERE mobileID=? ORDER BY reportTS DESC",
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

router.post("/getToken", function(req, res) {
    myConsole.log(
        "[Database] Attempting to get token for reportID = " + req.body.reportID
    );
    connection.query(
        "SELECT * FROM reports WHERE reportID=?",
        req.body.reportID,
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has Occured" });
            } else {
                myConsole.log(
                    "[Database] token by reportID = " +
                        req.body.reportID +
                        " have been selected"
                );
                res.json(rows);
            }
        }
    );
});

/*
 * Inserts current time as a timestamp to either intialOpenTS or complete TS.
 * initialOpenTS is either 1 or 0.
 * Takes in id as well.
 */
router.post("/timestamp", function(req, res) {
    myConsole.log(
        "[Database] Attempting to update timestamp(s) for reportID = " +
            req.body.reportID
    );
    if (req.body.initialOpenTS == 1) {
        query =
            "UPDATE reports SET initialOpenTS = current_timestamp(), initialOpenWebID = ? WHERE reportID = ?";
    } else {
        query =
            "UPDATE reports SET completeTS = current_timestamp(), completeWebID = ? WHERE reportID = ?";
    }
    connection.query(query, [req.body.webID, req.body.reportID], function(
        err,
        results
    ) {
        if (err) {
            myConsole.error(err);
            res.json({
                message: "An Error has occured. Please try again later."
            });
        } else {
            myConsole.log(
                "[Database] Report(s) Timestamp(s) has been updated for incidentID = " +
                    req.body.reportID
            );
            res.json({ message: "Timestamp Update Successful" });
        }
    });
});

router.post("/latestReports", function(req, res) {
    var num_reports = 7;
    myConsole.log(
        "[Database] Attempting to select the latest " + num_reports + " reports"
    );
    connection.query(
        "SELECT * FROM reports ORDER BY reportTS DESC LIMIT ?",
        num_reports,
        function(err, rows, fields) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has Occured" });
            } else {
                myConsole.log(
                    "[Database] Select latest " +
                        num_reports +
                        " reports successful"
                );
                res.json(rows);
            }
        }
    );
});

/*
    Grab the reportIDs and TSs of all reports.
*/
router.post("/allReportTS", function(req, res) {
    myConsole.log("[Database] Attempting to select all reports by ID and TS.");
    connection.query("SELECT reportID, reportTS FROM reports", function(
        err,
        rows
    ) {
        if (err) {
            myConsole.error(err);
            res.json({ message: "An Error has Occured" });
        } else {
            myConsole.log(
                "[Database] Select all reports by ID and TS successful"
            );
            res.json(rows);
        }
    });
});

/*
    Sets expire TS given reportDict. (ID:newExpireTS)
*/
router.post("/setExpire", function(req, res) {
    myConsole.log("[Database] Attempting to insert dict of reports.");

    // Interpret passed JSON string to dictionary
    var reportsDict = {};
    var dictionary = JSON.parse(req.body.reportsDict);
    for (var key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            var value = dictionary[key];
            reportsDict[key] = value;
        }
    }
    //res.json({ message: "Dict = " + reportsDict });
    if (reportsDict != {}) {
        // Dictionary populated. Now construct the query.
        var query = "UPDATE reports SET expireTS = CASE ";
        for (key in reportsDict) {
            var expireTS = reportsDict[key];
            query =
                query + "WHEN reportID = " + key + " THEN " + expireTS + " ";
        }
        query = query + "END WHERE reportID IN (";
        var firstValue = true;
        for (key in reportsDict) {
            if (firstValue) {
                query = query + key;
                firstValue = false;
            } else {
                query = query + "," + key;
            }
        }
        query = query + ")";
        connection.query(query, function(err, rows) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has Occured" });
            } else {
                myConsole.log(
                    "[Database] Inserting dict of reports successful."
                );
                res.json(rows);
            }
        });
    }
});

/*
    Remove TS given reportID.
*/
router.post("/removeTimestamp", function(req, res) {
    myConsole.log(
        "[Database] Removing completion of report with ID " + req.body.reportID
    );
    connection.query(
        "UPDATE reports SET completeTS = NULL AND completeWebID = NULL WHERE reportID = ?",
        req.body.reportID,
        function(err, rows) {
            if (err) {
                myConsole.error(err);
                res.json({ message: "An Error has Occured" });
            } else {
                myConsole.log(
                    "[Database] Removing of report completion with ID" +
                        req.body.reportID +
                        "successful"
                );
                res.json(rows);
            }
        }
    );
});

/*
    Grab latest TS in database.
*/
router.post("/latestTS", function(req, res) {
    myConsole.log("[Database] Attempting to select the latest report TS");
    connection.query("SELECT MAX(reportTS) FROM reports", function(err, rows) {
        if (err) {
            myConsole.error(err);
            res.json({ message: "An Error has Occured" });
        } else {
            myConsole.log("[Database] Select latest TS successful.");
            res.json(rows);
        }
    });
});

/*
    Given a TS, return a report.
*/
router.post("/reportTS", function(req, res) {
    myConsole.log(
        "[Database] Attempting to select the with TS: " + req.body.reportTS
    );
    query =
        "SELECT * FROM reports LEFT JOIN mobileUsers ON reports.mobileID = mobileUsers.mobileID WHERE reportTS = ";
    query = query + '"' + req.body.reportTS + '"';
    connection.query(query, function(err, rows) {
        if (err) {
            myConsole.error(err);
            res.json({ message: "An Error has Occured with query: " + query });
        } else {
            myConsole.log(
                "[Database] Found report with TS" + req.body.reportTS
            );
            res.json(rows);
        }
    });
});

router.post("/updateToken", function(req, res) {
    myConsole.log("[Database] Attempting to set token for" + req.body.mobileID);
    connection.query(
        "UPDATE reports SET token = " +
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
    Given a tag, return all prewritten responses
*/
router.post("/prewrittenResponses", function(req, res) {
    myConsole.log(
        "[Database] Attempting to get all prewritten Responses with tagID: " +
            req.body.tagID
    );
    connection.query(
        "SELECT * FROM prewrittenResponses WHERE tagID = ?",
        req.body.tagID,
        function(err, rows) {
            if (err) {
                myConsole.error(err);
                res.json({
                    message: "An Error has Occured with query: " + query
                });
            } else {
                myConsole.log(
                    "[Database] Found all prewritten Responses with tagID: " +
                        req.body.tagID
                );
                res.json(rows);
            }
        }
    );
});

/*
    The following is imported code to convert JS date to MySQL TS.
*/
/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return (
        this.getUTCFullYear() +
        "-" +
        twoDigits(1 + this.getUTCMonth()) +
        "-" +
        twoDigits(this.getUTCDate()) +
        " " +
        twoDigits(this.getUTCHours()) +
        ":" +
        twoDigits(this.getUTCMinutes()) +
        ":" +
        twoDigits(this.getUTCSeconds())
    );
};

module.exports = router;
