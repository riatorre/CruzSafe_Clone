/*
 * reports.js
 * Routing for Reports API
 */

const express = require("express");
const path = require("path");
const router = express.Router();
const connectionPool = require("../DB/config");
const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

const aPIKey = "AIzaSyDi4bKzq04VojQXEGXec4wDsdRVZhht5vY";

const googleMapsClient = require("@google/maps").createClient({
    key: aPIKey
});

const numDays = 90; // number of days before a report expires

// Define where multer will store the incoming files and how to name them
let storage = multer.diskStorage({
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
let googleStorageConfig = {
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
let upload = multer({
    storage: process.env.GCS_BUCKET
        ? multerGoogleStorage.storageEngine(googleStorageConfig)
        : storage
});

/*** Tags ***/

// Get all tags
router.post("/tags", function(req, res) {
    const query = "SELECT * FROM tags";
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

router.post("/reportsTags", function(req, res) {
    const query =
        "SELECT * FROM reports LEFT JOIN tags ON reports.tag = tags.tagID";
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

/*** Report Data ***/

// Get all reports from a list of reportIDs
router.post("/", function(req, res) {
    let reportIDs = JSON.parse(req.body.id);
    let query =
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
    connectionPool.handleAPI(
        reportIDs,
        null,
        -1,
        -1,
        query,
        val => {
            res.json(val);
        },
        () => {
            res.json({ message: "An Error has occurred" });
        }
    );
});

// Get all reports
router.post("/allReports", function(req, res) {
    let query = "SELECT * FROM reports";
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

// Get all incomplete reports
router.post("/incompleteReports", function(req, res) {
    let query = "SELECT * FROM reports where completeTS is null";
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

// Get all reports that have been opened
router.post("/allOpenedReports", function(req, res) {
    let query = "SELECT * FROM reports WHERE initialOpenTS IS NOT NULL";
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

// Get all reportIDs, initialOpenTS and completeTS.
router.post("/reportAllTS", function(req, res) {
    let query = "SELECT reportID, initialOpenTS, completeTS FROM reports";
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

/*
    Given a dictionary of key: value = columnTitle:value,
    returns all reportIDs adhering to those constraints.

    Requires dict to be passed in body.
*/
router.post("/specifyReportIDs", function(req, res) {
    // Interpret passed JSON string to dictionary
    let filters = {};
    let dictionary = JSON.parse(req.body.dict);
    let value = undefined;
    for (let key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            value = dictionary[key];
            filters[key] = value;
        }
    }

    // Dictionary populated, construct query.
    let query =
        "SELECT reportID FROM reports LEFT JOIN mobileUsers ON reports.mobileID = mobileUsers.mobileID";
    if (Object.keys(filters).length != 0) {
        // If anything in dictionary
        query = query + " WHERE "; // Add an initial where clause
        let firstItem = true;
        for (let key in filters) {
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
                res.json({
                    message: "[Database] An Error has occurred"
                });
            }
        );
    } else {
        res.json({
            message: "[Database] Nothing found!"
        });
    }
});

/*
    Get all of the reportIDs in the database.
*/
router.post("/reportIDs", function(req, res) {
    const query =
        "SELECT reportID FROM reports ORDER BY initialOpenTS IS NULL DESC, initialOpenTS IS NOT NULL AND completeTS IS NULL DESC, completeTS IS NOT NULL DESC, reportTS DESC";
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
            res.json({ message: "An Error has Occurred." });
        }
    );
});

// Get Report by internal ID #, should return either 0 or 1 entry
router.post("/reportID", function(req, res) {
    const query =
        "SELECT * FROM reports, mobileUsers, buildings WHERE reports.mobileID = mobileUsers.mobileID AND reports.buildingKey = buildings.buildingKey AND reportID = " +
        req.body.id;
    connectionPool.handleAPI(
        req.body.id,
        null,
        1,
        1,
        query,
        val => {
            if (val.length > 0) {
                res.json(val);
            } else {
                res.json({
                    message: "No report with given reportID found"
                });
            }
        },
        () => {
            res.json({ message: "An Error has occurred" });
        }
    );
});

// Get Report By Incident ID #, may return 0+ entries
router.post("/incidentID", function(req, res) {
    const query =
        "SELECT * FROM reports WHERE incidentID = " +
        req.body.id +
        " OR reportID = " +
        req.body.id;
    connectionPool.handleAPI(
        req.body.id,
        null,
        1,
        1,
        query,
        val => {
            if (val.length > 0) {
                res.json(val);
            } else {
                res.json({
                    message: "No report with given incidentID found"
                });
            }
        },
        () => {
            res.json({ message: "An Error has occurred" });
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
    /*
        Set up primary constants and primary query to insert data. 
    */
    const attachment = req.file ? req.file.filename : null;
    const hasAttachment = attachment ? 1 : 0;
    const values = [
        [
            req.body.mobileID,
            connectionPool.sanitizeString(req.body.incidentDesc),
            connectionPool.sanitizeString(req.body.incidentLocationDesc),
            req.body.incidentCategory,
            req.body.incidentLatitude,
            req.body.incidentLongitude,
            req.body.incidentUnchangedLocation,
            hasAttachment,
            connectionPool.sanitizeString(attachment),
            connectionPool.sanitizeString(req.body.token)
        ]
    ];

    /*
        "INSERT INTO reports (mobileID, body, location, tag, latitude, longitude, unchangedLocation, attachments, filename, token, expireTS) VALUES ("
        + [values]
        + ", DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 DAY))"
    */
    const primaryQuery =
        "INSERT INTO reports (mobileID, body, location, tag, latitude, longitude, unchangedLocation, attachments, filename, token) VALUES (" +
        [values] +
        ")";
    connectionPool.handleAPI(
        [req.body.mobileID, req.body.incidentCategory],
        [
            req.body.incidentDesc,
            req.body.incidentLocationDesc,
            attachment,
            req.body.token
        ],
        2,
        6,
        primaryQuery,
        val => {
            connectionPool.handleAPI(
                null,
                null,
                0,
                0,
                "SELECT reportTS FROM reports WHERE reportID = " + val.insertId,
                row => {
                    const expireTS = row[0].reportTS;
                    expireTS.setDate(expireTS.getDate() + numDays);
                    expireTS.toMysqlFormat();
                    connectionPool.handleAPI(
                        null,
                        null,
                        0,
                        0,
                        "UPDATE reports SET incidentID = " +
                            val.insertId +
                            ", expireTS = " +
                            connectionPool.sanitizeString(expireTS) +
                            " WHERE reportID = " +
                            val.insertId,
                        () => {
                            // Given that every single building has coordinates, insert the x and y into the google maps API.

                            googleMapsClient.reverseGeocode(
                                {
                                    latlng: [
                                        req.body.incidentLatitude,
                                        req.body.incidentLongitude
                                    ]
                                },
                                function(err, response) {
                                    if (!err) {
                                        let googleResult =
                                            response.json.results;
                                        let buildingStreet =
                                            googleResult[0][
                                                "address_components"
                                            ][0]["long_name"] +
                                            " " +
                                            googleResult[0][
                                                "address_components"
                                            ][1]["long_name"];
                                        let buildingCity =
                                            googleResult[0][
                                                "address_components"
                                            ][2]["long_name"];
                                        //let buildingCounty = connectionPool.sanitizeString(googleResult["address_components"][3]["long_name"]);
                                        let buildingState =
                                            googleResult[0][
                                                "address_components"
                                            ][4]["short_name"];

                                        const buildingQuery =
                                            "SELECT buildingKey FROM buildings WHERE buildingStreet=" +
                                            connectionPool.sanitizeString(
                                                buildingStreet
                                            ) +
                                            " AND buildingCity = " +
                                            connectionPool.sanitizeString(
                                                buildingCity
                                            ) +
                                            " AND buildingState = " +
                                            connectionPool.sanitizeString(
                                                buildingState
                                            );

                                        // Given that address, check to see if there is a matching one in the database.
                                        connectionPool.handleAPI(
                                            // CHECK TO FIND BUILDING WITH MATCHING ADDRESS
                                            null,
                                            null,
                                            0,
                                            0,
                                            buildingQuery,
                                            valKey => {
                                                if (
                                                    valKey.length > 0 &&
                                                    valKey
                                                ) {
                                                    // if there is a building that matches, insert it into the report and return.
                                                    let buildingKey =
                                                        valKey[0][
                                                            "buildingKey"
                                                        ];
                                                    connectionPool.handleAPI(
                                                        // INSERT MATCHING BUILDING KEY INTO REPORTS
                                                        null,
                                                        null,
                                                        0,
                                                        0,
                                                        "UPDATE reports SET buildingKey = " +
                                                            buildingKey +
                                                            " WHERE reportID = " +
                                                            val.insertId,
                                                        () => {
                                                            // Done.
                                                            res.json({
                                                                incidentID:
                                                                    val.insertId
                                                            }); // Exit; all things went through fine, return incident ID.
                                                        },
                                                        () => {
                                                            res.json({
                                                                message:
                                                                    "An Error has Occurred. Error Code 02141 - Insert matching building key into reports failed."
                                                            });
                                                        }
                                                    );
                                                } else {
                                                    // Else if there isn't, sort the entire database and get the one with lat - x and long - y that is closest to 0.
                                                    let lat =
                                                        req.body
                                                            .incidentLatitude;
                                                    let lng =
                                                        req.body
                                                            .incidentLongitude;
                                                    let sf = 3.14159 / 180; // scaling factor
                                                    let er = 6350; // earth radius in miles, approximate
                                                    let mr = 100; // max radius
                                                    const findBuildingQuery =
                                                        "SELECT buildingKey FROM buildings WHERE " +
                                                        mr +
                                                        " >= " +
                                                        er +
                                                        " * ACOS(SIN(buildingLat*" +
                                                        sf +
                                                        ")*SIN(" +
                                                        lat +
                                                        "*" +
                                                        sf +
                                                        ") + COS(buildingLat*" +
                                                        sf +
                                                        ")*COS(" +
                                                        lat +
                                                        "*" +
                                                        sf +
                                                        ")*COS((buildingLng-" +
                                                        lng +
                                                        ")*" +
                                                        sf +
                                                        "))ORDER BY ACOS(SIN(buildingLat*" +
                                                        sf +
                                                        ")*SIN(" +
                                                        lat +
                                                        "*" +
                                                        sf +
                                                        ") + COS(buildingLat*" +
                                                        sf +
                                                        ")*COS(" +
                                                        lat +
                                                        "*" +
                                                        sf +
                                                        ")*COS((buildingLng-" +
                                                        lng +
                                                        ")*" +
                                                        sf +
                                                        "))";
                                                    //const findBuildingQuery =
                                                    //   "SELECT buildingKey FROM buildings ORDER BY ACOS(SIN(buildingLat*"+sf+")*SIN("+req.body.incidentLatitude+"*"+sf+") + COS(buildingLat*"+sf+")*COS("+req.body.incidentLatitude+"*"+sf+")*COS((buildingLng-"+req.body.incidentLongitude+")*"+sf+"))";
                                                    connectionPool.handleAPI(
                                                        // SORT BUILDINGS BY CLOSEST LAT AND LONG
                                                        [
                                                            req.body
                                                                .incidentLatitude,
                                                            req.body
                                                                .incidentLongitude
                                                        ],
                                                        null,
                                                        2,
                                                        2,
                                                        findBuildingQuery,
                                                        closestKey => {
                                                            let buildingKey =
                                                                // INSERT CLOSEST BUILDING KEY INTO REPORTS
                                                                closestKey[0][
                                                                    "buildingKey"
                                                                ];
                                                            connectionPool.handleAPI(
                                                                null,
                                                                null,
                                                                0,
                                                                0,
                                                                "UPDATE reports SET buildingKey = " +
                                                                    buildingKey +
                                                                    " WHERE reportID = " +
                                                                    val.insertId,
                                                                () => {
                                                                    // Done.
                                                                    res.json({
                                                                        incidentID:
                                                                            val.insertId
                                                                    }); // Exit; all things went through fine, return incident ID.
                                                                },
                                                                () => {
                                                                    res.json({
                                                                        message:
                                                                            "An Error has Occurred. Error Code 70924 - Insert closest building key into reports failed."
                                                                    });
                                                                }
                                                            );
                                                        },
                                                        () => {
                                                            res.json({
                                                                message:
                                                                    "An Error has Occurred. Error Code 81923 - Sort buildings by closest lat and long failed. Query = " +
                                                                    findBuildingQuery
                                                            });
                                                        }
                                                    );
                                                }
                                            },
                                            () => {
                                                res.json({
                                                    message:
                                                        "An Error has Occurred. Error Code 00623 - Checking to find buildings with matching addresses failed. Query = " +
                                                        buildingQuery
                                                });
                                            }
                                        );
                                    } else {
                                        res.json({
                                            message:
                                                "An Error has Occurred. Error Code 00624 - Converting API failed."
                                        });
                                    }
                                }
                            );
                        },
                        () => {
                            res.json({ message: "An Error has Occurred." });
                        }
                    );
                },
                () => {
                    res.json({ message: "An Error has Occurred." });
                }
            );
        },
        () => {
            res.json({ message: "An Error has Occurred." });
        }
    );
});

/*
 *  Function that grabs all reports made by given user
 */
router.post("/userReports", function(req, res) {
    const query =
        "SELECT * FROM reports WHERE mobileID = " +
        req.body.mobileID +
        " ORDER BY reportTS DESC";
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
            res.json({ message: "An Error has occurred" });
        }
    );
});

router.post("/latestReports", function(req, res) {
    const num_reports = 7;
    const query =
        "SELECT * FROM reports ORDER BY reportTS DESC LIMIT " + num_reports;
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

/*
    Insert a new work order number. 
*/
router.post("/newWorkOrder", function(req, res) {
    const query =
        "UPDATE reports SET orderNumber = " +
        req.body.orderNumber +
        " WHERE reportID = " +
        req.body.reportID;
    connectionPool.handleAPI(
        [req.body.orderNumber, req.body.reportID],
        null,
        2,
        2,
        query,
        val => {
            res.json(val);
        },
        () => {
            res.json({ message: "An Error has Occurred." });
        }
    );
});

/*** Report Notes ***/

// Get notes joined with webID given a reportID.
router.post("/notes", function(req, res) {
    const query =
        "SELECT * FROM reportNotes LEFT JOIN webUsers ON reportNotes.webID = webUsers.webID WHERE reportID = " +
        req.body.reportID;
    connectionPool.handleAPI(
        req.body.reportID,
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

/*
    Given a new note with reportID, webID, and content.
*/
router.post("/newNote", function(req, res) {
    const query =
        "INSERT INTO reportNotes (reportID, webID, content) VALUES (" +
        req.body.reportID +
        "," +
        req.body.webID +
        "," +
        connectionPool.sanitizeString(req.body.content) +
        ")";
    connectionPool.handleAPI(
        [req.body.reportID, req.body.webID],
        req.body.content,
        2,
        3,
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
    Given a tag, return all prewritten responses
*/
router.post("/prewrittenResponses", function(req, res) {
    const query =
        "SELECT * FROM prewrittenResponses WHERE tagID = " + req.body.tagID;
    connectionPool.handleAPI(
        req.body.tagID,
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

/*** Timestamp & Timestamp related APIs */

/*
 * Inserts current time as a timestamp to either intialOpenTS or complete TS.
 * initialOpenTS is either 1 or 0.
 * Takes in id as well.
 */
router.post("/timestamp", function(req, res) {
    let query = "";
    if (req.body.initialOpenTS == 1) {
        query =
            "UPDATE reports SET initialOpenTS = current_timestamp(), initialOpenWebID = " +
            req.body.webID +
            " WHERE reportID = " +
            req.body.reportID;
    } else {
        query =
            "UPDATE reports SET completeTS = current_timestamp(), completeWebID = " +
            req.body.webID +
            " WHERE reportID = " +
            req.body.reportID;
    }
    connectionPool.handleAPI(
        [req.body.webID, req.body.reportID],
        null,
        2,
        2,
        query,
        () => {
            res.json({ message: "Timestamp Update Successful" });
        },
        () => {
            res.json({ message: "An Error has Occurred." });
        }
    );
});

/*
    Grab the reportIDs and TSs of all reports.
*/
router.post("/allReportTS", function(req, res) {
    const query = "SELECT reportID, reportTS FROM reports";
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
            res.json({ message: "An Error has Occurred." });
        }
    );
});

/*
    Sets expire TS given reportDict. (ID:newExpireTS)
*/
router.post("/setExpire", function(req, res) {
    // Interpret passed JSON string to dictionary
    let reportsDict = {};
    let dictionary = JSON.parse(req.body.reportsDict);
    let value = undefined;
    for (let key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            value = dictionary[key];
            reportsDict[key] = value;
        }
    }
    //res.json({ message: "Dict = " + reportsDict });
    if (reportsDict != {}) {
        // Dictionary populated. Now construct the query.
        let query = "UPDATE reports SET expireTS = CASE ";
        let expireTS = undefined;
        for (key in reportsDict) {
            expireTS = reportsDict[key];
            query =
                query + "WHEN reportID = " + key + " THEN " + expireTS + " ";
        }
        query = query + "END WHERE reportID IN (";
        let firstValue = true;
        for (key in reportsDict) {
            if (firstValue) {
                query = query + key;
                firstValue = false;
            } else {
                query = query + "," + key;
            }
        }
        query = query + ")";
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
                res.json({ message: "An Error has Occurred." });
            }
        );
    }
});

/*
    Remove TS given reportID.
*/
router.post("/removeTimestamp", function(req, res) {
    const query =
        "UPDATE reports SET completeTS = NULL AND completeWebID = NULL WHERE reportID = " +
        req.body.reportID;
    connectionPool.handleAPI(
        req.body.reportID,
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

/*
    Grab latest TS in database.
*/
router.post("/latestTS", function(req, res) {
    const query = "SELECT MAX(reportTS) FROM reports";
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
            res.json({ message: "An Error has Occurred." });
        }
    );
});

/*
    Given a TS, return a report.
*/
router.post("/reportTS", function(req, res) {
    let query =
        "SELECT * FROM reports LEFT JOIN mobileUsers ON reports.mobileID = mobileUsers.mobileID WHERE reportTS = ";
    query = query + connectionPool.sanitizeString(req.body.reportTS);
    connectionPool.handleAPI(
        null,
        req.body.reportTS,
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

/*** Tokens ***/

router.post("/getToken", function(req, res) {
    const query = "SELECT * FROM reports WHERE reportID = " + req.body.reportID;
    connectionPool.handleAPI(
        req.body.reportID,
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

router.post("/updateToken", function(req, res) {
    const query =
        "UPDATE reports SET token = " +
        JSON.stringify(req.body.token) +
        " WHERE mobileID = " +
        req.body.mobileID;
    connectionPool.handleAPI(
        req.body.mobileID,
        JSON.stringify(req.body.token),
        1,
        2,
        query,
        val => {
            res.json(val);
        },
        () => {
            res.json({ message: "An Error has Occurred." });
        }
    );
});

router.post("/updateInc", function(req, res) {
    let reportID = req.body.reports;
    let inc_num = req.body.inc;
    let query = "UPDATE reports SET incidentID = " + inc_num + " Where";
    for (let i = 0; i < reportID.length - 1; i++) {
        query = query + " reportID = " + reportID[i] + " OR ";
    }
    query += " reportID = " + reportID[reportID.length - 1];
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
            res.json({ message: "An Error has Occurred." });
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
