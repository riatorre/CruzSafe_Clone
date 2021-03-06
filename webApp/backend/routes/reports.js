/*
 * reports.js
 * Routing for Reports API
 */

const express = require("express");
const path = require("path");
const router = express.Router();
const connectionPool = require("../DB/config");
const connectionPool_1 = require("../DB/config");
const connectionPool_2 = require("../DB/config");
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
            for (i = 0; i < val.length; i++) {
                if (val[i].incidentID == null)
                    val[i].incidentID = val[i].reportID;
            }
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
            for (i = 0; i < val.length; i++) {
                if (val[i].incidentID == null)
                    val[i].incidentID = val[i].reportID;
            }
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
            for (i = 0; i < val.length; i++) {
                if (val[i].incidentID == null)
                    val[i].incidentID = val[i].reportID;
            }
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
            for (i = 0; i < val.length; i++) {
                if (val[i].incidentID == null)
                    val[i].incidentID = val[i].reportID;
            }
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
            for (i = 0; i < val.length; i++) {
                if (val[i].incidentID == null)
                    val[i].incidentID = val[i].reportID;
            }
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
                for (i = 0; i < val.length; i++) {
                    if (val[i].incidentID == null)
                        val[i].incidentID = val[i].reportID;
                }
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
        "SELECT * FROM reports WHERE (reportID = " +
        req.body.id +
        " AND incidentID IS NULL) OR incidentID = " +
        req.body.id;
    connectionPool.handleAPI(
        req.body.id,
        null,
        1,
        1,
        query,
        val => {
            if (val.length > 0) {
                for (i = 0; i < val.length; i++) {
                    if (val[i].incidentID == null)
                        val[i].incidentID = val[i].reportID;
                }
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
    Given a lat and lng, find the building associated with the report and find the facilityID.
    Once you have the facilityID, return all of the tags associated with said facility 
    ID And tags that have the universalTag value set instead of null. 

    Return all tags associalted with building and also buildingKey. 
*/
router.post("/selectTagsByBuilding", function(req, res) {
    // We want to get the facilityID to send to.
    let f_id;

    googleMapsClient.reverseGeocode(
        {
            latlng: [req.body.incidentLatitude, req.body.incidentLongitude]
        },
        function(err, response) {
            if (!err) {
                let googleResult = response.json.results;
                let buildingStreet =
                    googleResult[0]["address_components"][0]["long_name"] +
                    " " +
                    googleResult[0]["address_components"][1]["long_name"];
                let buildingCity =
                    googleResult[0]["address_components"][2]["long_name"];
                let buildingState =
                    googleResult[0]["address_components"][4]["short_name"];

                const buildingWhereClause1 =
                    "buildingStreet=" +
                    connectionPool.sanitizeString(buildingStreet) +
                    " AND buildingCity = " +
                    connectionPool.sanitizeString(buildingCity) +
                    " AND buildingState = " +
                    connectionPool.sanitizeString(buildingState);

                let lat = req.body.incidentLatitude;
                let lng = req.body.incidentLongitude;
                let sf = 3.14159 / 180; // scaling factor
                let er = 6350; // earth radius in miles, approximate
                let mr = 100; // max radius
                const buildingWhereClause2 =
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
                // SELECT buildingCategory, buildingOperations FROM buildings LEFT JOIN reports ON buildings.buldingKey = reports.buildingKey WHERE reports.reportID = ___
                const query =
                    "SELECT buildingCategory, buildingOperations FROM buildings WHERE buildingKey = (SELECT buildingKey FROM buildings WHERE " +
                    buildingWhereClause1 +
                    " OR " +
                    buildingWhereClause2 +
                    " LIMIT 1)";

                connectionPool.handleAPI(
                    val1.insertId,
                    null,
                    1,
                    1,
                    query,
                    valBuilding => {
                        if (f_id == null) {
                            // Check buildingCategory as residential (if so, then CHES)
                            if (
                                valBuilding[0].buildingCategory ==
                                "R - Residential"
                            ) {
                                f_id = 1; // SET TO CHES
                            } else {
                                // Check buildingOperations as state (if so, then PPC)
                                if (
                                    valBuilding[0].buildingOperations ==
                                    "S - State Supported"
                                ) {
                                    f_id = 2; // SET TO PPC
                                } else {
                                    f_id = 1; // SET TO CHES
                                }
                            }
                        }
                        //--------------------------------------------------------------------------------
                        // Now we finally have the facilityID. Return the tags.
                    },
                    () => {
                        res.json({
                            message: "An Error has Occurred."
                        });
                    }
                );
            } else {
                res.json({ message: "An Error has Occurred" });
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
    // TODO: insert into will also require building key to be added via values.

    // TODO: Remove geoocode code.
    googleMapsClient.reverseGeocode(
        {
            latlng: [req.body.incidentLatitude, req.body.incidentLongitude]
        },
        function(err, response) {
            if (!err) {
                let googleResult = response.json.results;
                let buildingStreet =
                    googleResult[0]["address_components"][0]["long_name"] +
                    " " +
                    googleResult[0]["address_components"][1]["long_name"];
                let buildingCity =
                    googleResult[0]["address_components"][2]["long_name"];
                let buildingState =
                    googleResult[0]["address_components"][4]["short_name"];

                const buildingWhereClause1 =
                    "buildingStreet=" +
                    connectionPool.sanitizeString(buildingStreet) +
                    " AND buildingCity = " +
                    connectionPool.sanitizeString(buildingCity) +
                    " AND buildingState = " +
                    connectionPool.sanitizeString(buildingState);

                let lat = req.body.incidentLatitude;
                let lng = req.body.incidentLongitude;
                let sf = 3.14159 / 180; // scaling factor
                let er = 6350; // earth radius in miles, approximate
                let mr = 100; // max radius
                const buildingWhereClause2 =
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

                // Start here with the building key.
                const primaryQuery =
                    "INSERT INTO reports (mobileID, body, location, tag, latitude, longitude, unchangedLocation, attachments, filename, token, expireTS, buildingKey) VALUES (" +
                    [values] +
                    ", DATE_ADD(CURRENT_TIMESTAMP, INTERVAL " +
                    numDays +
                    " DAY), (SELECT buildingKey FROM buildings WHERE " +
                    buildingWhereClause1 +
                    " OR " +
                    buildingWhereClause2 +
                    " LIMIT 1))";
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
                    val1 => {
                        //--------------------------------------------------------------------------------
                        // Assignment of report to a facility

                        // We want to get the facilityID to send to.
                        let f_id;

                        // Query: check whether the report category has an automatic facility ID.
                        // SELECT facilityID FROM tags LEFT JOIN reports ON tags.tagID reports.tagID WHERE reports.reportID = ___
                        const query =
                            "SELECT mainFacilityID FROM tags LEFT JOIN reports ON tags.tagID = reports.tag WHERE reports.reportID = " +
                            val1.insertId;
                        connectionPool.handleAPI(
                            val1.insertId,
                            null,
                            1,
                            1,
                            query,
                            valTagFacility => {
                                // If facilityID is null, get data from building.
                                if (valTagFacility[0].mainFacilityID != null) {
                                    f_id = valTagFacility[0].mainFacilityID;
                                }
                                // SELECT buildingCategory, buildingOperations FROM buildings LEFT JOIN reports ON buildings.buldingKey = reports.buildingKey WHERE reports.reportID = ___
                                const query =
                                    "SELECT buildingCategory, buildingOperations FROM buildings LEFT JOIN reports ON buildings.buildingKey = reports.buildingKey WHERE reports.reportID = " +
                                    val1.insertId;

                                connectionPool.handleAPI(
                                    val1.insertId,
                                    null,
                                    1,
                                    1,
                                    query,
                                    valBuilding => {
                                        if (f_id == null) {
                                            // Check buildingCategory as residential (if so, then CHES)
                                            if (
                                                valBuilding[0]
                                                    .buildingCategory ==
                                                "R - Residential"
                                            ) {
                                                f_id = 1; // SET TO CHES
                                            } else {
                                                // Check buildingOperations as state (if so, then PPC)
                                                if (
                                                    valBuilding[0]
                                                        .buildingOperations ==
                                                    "S - State Supported"
                                                ) {
                                                    f_id = 2; // SET TO PPC
                                                } else {
                                                    f_id = 1; // SET TO CHES
                                                }
                                            }
                                        }
                                        //--------------------------------------------------------------------------------
                                        // Now we finally have the facilityID.

                                        /*
                                            const query1 =
                                            "INSERT INTO assignments (reportID, senderWebID, recieverFacilityID) VALUES (" +
                                            val1.insertId +
                                            "," +
                                            4 +
                                            "," +
                                            (SELECT facilityID FROM tags LEFT JOIN reports ON tags.tagID = reports.tag WHERE reports.reportID = "+val1.insertId+") +
                                            ")";
                                        */
                                        const query1 =
                                            "INSERT INTO assignments (reportID, senderWebID, recieverFacilityID) VALUES (" +
                                            val1.insertId +
                                            "," +
                                            4 +
                                            "," +
                                            f_id +
                                            ")";
                                        connectionPool_1.handleAPI(
                                            [val1.insertId, 4, f_id],
                                            null,
                                            3,
                                            3,
                                            query1,
                                            val2 => {
                                                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                                                // Get emails
                                                const query2 =
                                                    "SELECT * FROM facilities WHERE facilityID = " +
                                                    f_id;
                                                /*const query2 =
                                                    "SELECT facilityEmail FROM facilities WHERE facilitiesID = " +
                                                    f_id;*/
                                                connectionPool_2.handleAPI(
                                                    null,
                                                    null,
                                                    0,
                                                    0,
                                                    query2,
                                                    val3 => {
                                                        //******************************************************************
                                                        var maillist = [];
                                                        for (
                                                            var m = 0;
                                                            m < val3.length;
                                                            m++
                                                        ) {
                                                            maillist.push(
                                                                val3[m]
                                                                    .facilityEmail
                                                            );
                                                        }
                                                        // Send email
                                                        sendReportEmail(
                                                            maillist,
                                                            val1.insertId,
                                                            f_id
                                                        );
                                                        //**************************************************************************
                                                        //res.json(val3);
                                                    },
                                                    () => {
                                                        res.json({
                                                            message:
                                                                "An Error has occurred"
                                                        });
                                                    }
                                                );
                                                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                                                //res.json(val2);
                                            },
                                            () => {
                                                res.json({
                                                    message:
                                                        "An Error has Occurred."
                                                });
                                            }
                                        ); // Exit; all things went through fine, return incident ID.},
                                    },
                                    () => {
                                        res.json({
                                            message: "An Error has Occurred."
                                        });
                                    }
                                );
                            },
                            () => {
                                res.json({ message: "An Error has Occurred." });
                            }
                        );
                        res.json({
                            incidentID: val1.insertId
                        });
                    },
                    () => {
                        res.json({ message: "An Error has Occurred." });
                    }
                );
            } else {
                res.json({ message: "An Error has Occurred" });
            }
        }
    );
});

/*
    Grabs all of the information required in the actual email.
*/
function sendReportEmail(maillist, insertId, f_id) {
    const query =
        "SELECT * FROM reports, mobileUsers, buildings, tags, facilities WHERE reports.mobileID = mobileUsers.mobileID AND reports.buildingKey = buildings.buildingKey AND reports.tag = tags.tagID AND facilities.facilityID = " +
        f_id +
        " AND reportID = " +
        insertId;
    connectionPool.handleAPI(
        null,
        null,
        0,
        0,
        query,
        val => {
            sendReportEmailHelper(maillist, val[0]);
        },
        () => {
            res.json({ message: "An Error has occurred" });
        }
    );
}

/*
    Function that, given a mailing list and report values,
    writes all the necessary information needed to send the email,
    including formulating the HTML. 
*/
const logoAddress =
    "https://memeworld.funnyjunk.com/pictures/Tales_dc5bfc_6260051.jpg";
function sendReportEmailHelper(maillist, values) {
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
        to: maillist,
        subject:
            "[CruzSafe] " +
            values["buildingAbbrev"] +
            " #" +
            values["buildingCAAN"] +
            " - " +
            values["tagName"],
        /*text:
            "This is an automated email forwarding a submitted report that our system" +
            "has determined to be applicable to your facility. If this is not the case," +
            "please click here to route the request instead to the other facility.\n\n" +
            "REPORT CONTENTS:\n\n" +
            "Name: CruzSafe Report\nEmail: ucsc.cruzsafe@gmail.com\nPhone Number: 555-555-5555\n\n" +
            "Information:" +
            JSON.stringify(values),*/
        html:
            "<!--HTML template of email; encode and decode the string before working on it, please!-->" +
            "" +
            "<head>" +
            '    <meta charset="utf-8">' +
            "    <!--Import Stylesheet-->" +
            "    <!--" +
            "    <link" +
            '        href="./email REMOVE ME.css"' +
            '        type="text/css"' +
            '        rel="stylesheet"' +
            "    />" +
            "    -->" +
            "    <style>" +
            "        /*" +
            "            email.css" +
            "            Styling for the email" +
            "            Copy and paste this code from the test email css thing" +
            "        */" +
            "        /*" +
            "            NOTE: primary color: #145d99" +
            "                  secondary color:  #eaeaea" +
            "        */" +
            "" +
            "        body {" +
            "            overflow: auto;" +
            "            background-color: #eaeaea;" +
            "            padding-top: 1.1em;" +
            "            padding-bottom: 1.1em;" +
            "            padding-left: 1.1em;" +
            "            padding-right: 1.1em;" +
            "        }" +
            "        h1 {" +
            "            color: #145d99;" +
            "        }" +
            "        .header {" +
            "            align-content: center;" +
            "            justify-content: center;" +
            "        }" +
            "        .logoImage {" +
            "            height: 200px;" +
            "            width: auto;" +
            "        }" +
            "        .initialText {" +
            "            width: 100%;" +
            "            border-radius: 0.7em;" +
            "            grid-area: reportWrapper;" +
            "            background-color: #145d99;" +
            "            /*padding-left: 1.8em;" +
            "            padding-right: 1.8em;*/" +
            "            overflow: hidden;" +
            "            color: #eaeaea;" +
            "            padding: 0.7em;" +
            "            margin-top: 0.7em;" +
            "            margin-bottom: 0.7em;" +
            "        }" +
            "        .reportContents {" +
            "            width: 100%;" +
            "            border-radius: 0.7em;" +
            "            grid-area: reportWrapper;" +
            "            background-color: #145d99;" +
            "            /*padding-left: 1.8em;" +
            "            padding-right: 1.8em;*/" +
            "            overflow: hidden;" +
            "            color: #eaeaea;" +
            "            padding: 0.7em;" +
            "            margin-top: 0.7em;" +
            "            margin-bottom: 0.7em;" +
            "        }" +
            "        .title {" +
            "            font-size: 30px;" +
            "            color: #145d99;" +
            "            font-weight: bold;" +
            "            padding-left: 0.3em;" +
            "        }" +
            "        .header {" +
            "            font-size: 30px;" +
            "            color: #eaeaea;" +
            "            font-weight: bold;" +
            "        }" +
            "    </style>" +
            "</head>" +
            '<body style="overflow: auto;background-color: #eaeaea;padding-top: 1.1em;padding-bottom: 1.1em;padding-left: 1.1em;padding-right: 1.1em;">' +
            '    <div class="header" style="align-content: center;justify-content: center;font-size: 30px;color: #eaeaea;font-weight: bold;">' +
            '        <img class="logoImage" src="https://storage.googleapis.com/cruzsafe.appspot.com/CruzSafeMain.png" style="height: 75px;width: auto;"><span class="title top" style="font-size: 30px;color: #145d99;font-weight: bold;padding-left: 0.3em;">New ' +
            values["facilityName"] +
            " Report</span>" +
            "    </div>" +
            '    <div class="initialText" style="font-size: 15px;width: auto;border-radius: 0.7em;grid-area: reportWrapper;background-color: #145d99;overflow: hidden;color: #eaeaea;padding: 0.7em;margin-top: 0.7em;margin-bottom: 0.7em;">' +
            "        <p>" +
            "            This is an automated email forwarding a summitted report that our" +
            "            system has determined to be applicable to your facility. If this is" +
            "            not the case, please click here to route the request instead to the" +
            "            other facility." +
            "        </p>" +
            "    </div>" +
            '    <div class="reportContents" style="font-size: 15px;width: auto;border-radius: 0.7em;grid-area: reportWrapper;background-color: #145d99;overflow: hidden;color: #eaeaea;padding: 1.3em;margin-top: 0.7em;margin-bottom: 0.7em;">' +
            '        <div><span class="header" style="align-content: center;justify-content: center;font-size: 30px;color: #eaeaea;font-weight: bold;">Report Contents:</span></div>' +
            "        <br>" +
            "        <div><b>Name:</b><span> CruzSafe Report</span></div>" +
            "        <div><b>Email: </b><span style='background-color: #eaeaea !important;'>ucsc.cruzsafe@gmail.com</span></div>" +
            "        <div><b>Phone Number:</b><span> 555-555-5555</span></div>" +
            "        <br>" +
            "        <div><b>Contact's Name:</b><span> " +
            values["firstName"] +
            " " +
            values["lastName"] +
            "</span></div>" +
            "        <div><b>Contact's Email: </b><span style='background-color: #eaeaea !important;'>" +
            values["email"] +
            "</span></div>" +
            "        <div><b>Contact's Phone Number:</b><span> " +
            values["phone"] +
            "</span></div>" +
            "        <br>" +
            "        <div><b>Interior vs Exterior:</b><span> " +
            values["phone"] +
            "</span></div>" +
            "        <div><b>Building: </b><span id='buildingName'>" +
            values["buildingName"] +
            "</span> (<span id='buildingFDX'>" +
            values["buildingFDX"] +
            "</span>) - #<span id='buildingKey'>" +
            values["buildingKey"] +
            "</span></div>\n" +
            "<div style='padding-left: 20px;'>" +
            "<div><span id='buildingLocation'>" +
            values["buildingLocation"] +
            "</span>, <span id='buildingRegion'>" +
            values["buildingRegion"] +
            "</span></div>\n" +
            "<div><span id='buildingStreet'>" +
            values["buildingStreet"] +
            "</span>, <span id='buildingCity'>" +
            values["buildingCity"] +
            "</span>, <span id='buildingState'>" +
            values["buildingState"] +
            "</span> <span id='buildingZip'>" +
            values["buildingZip"] +
            "</span></div>\n" +
            "<div><span id='buildingCategory'>" +
            values["buildingCategory"] +
            "</span> | <span id='buildingPrimaryUse'>" +
            values["buildingPrimaryUse"] +
            "</span></div>\n" +
            "<div><span id='buildingOperations'>" +
            values["buildingOperations"] +
            "</span></div>\n" +
            "</div>" +
            "        <div><b>Special Entry Requirements:</b><span> " +
            values["phone"] +
            "</span></div>" +
            "        <br>" +
            "        <div><b>Location Details:</b><span> " +
            values["location"] +
            "</span></div>" +
            "        <br>" +
            "        <div><b>Request Type:</b><span> " +
            values["tagName"] +
            "</span></div>" +
            "        <div><b>Description of Work Requested:</b><span> " +
            values["body"] +
            "</span></div>" +
            "</div>" +
            '<div class="reportContents" style="font-size: 15px;width: auto;border-radius: 0.7em;grid-area: reportWrapper;background-color: #145d99;overflow: hidden;color: #eaeaea;padding: 1.3em;margin-top: 0.7em;margin-bottom: 0.7em;">' +
            '        <div><span class="header" style="align-content: center;justify-content: center;font-size: 30px;color: #eaeaea;font-weight: bold;">System Data:</span></div>' +
            "        <br>" +
            "        <div><b>Report Time Stamp:</b><span> " +
            values["reportTS"] +
            "</span></div>" +
            "        <br>" +
            "        <div><span>Additional details and user statistics can be found in the CruzSafe web application: https://cruzsafe.appspot.com/reports.html. If you do not have access to the application, please request access here. If you have any questions regarding this email, please contact us.</span></div>" +
            "       </div>" +
            "        <div>" +
            "           <b>Full System Data: </b>" +
            "            <span>" +
            JSON.stringify(values) +
            "            </span>" +
            "        </div>" +
            "</body>"
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

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
            for (i = 0; i < val.length; i++) {
                if (val[i].incidentID == null)
                    val[i].incidentID = val[i].reportID;
            }
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
            for (i = 0; i < val.length; i++) {
                if (val[i].incidentID == null)
                    val[i].incidentID = val[i].reportID;
            }
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
    let complete = false;
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
        complete = true;
    }
    connectionPool.handleAPI(
        [req.body.webID, req.body.reportID],
        null,
        2,
        2,
        query,
        () => {
            if (complete) {
                query =
                    "DELETE FROM assignments WHERE reportID = " +
                    req.body.reportID +
                    " AND assignmentID > -1";
                connectionPool.handleAPI(
                    req.body.reportID,
                    null,
                    1,
                    1,
                    query,
                    val => {
                        res.json({
                            message:
                                "Timestamp Update + Delete Assignments Successful"
                        });
                    },
                    () => {
                        res.json({ message: "An Error has Occurred." });
                    }
                );
            } else {
                res.json({ message: "Timestamp Update Successful" });
            }
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
            for (i = 0; i < val.length; i++) {
                if (val[i].incidentID == null)
                    val[i].incidentID = val[i].reportID;
            }
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
            for (i = 0; i < val.length; i++) {
                if (val[i].incidentID == null)
                    val[i].incidentID = val[i].reportID;
            }
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

router.post("/submitFeedback", (req, res) => {
    let query = "";
    if (req.body.mobileID != null) {
        query =
            "INSERT INTO feedback (mobileID, feedbackEntry) VALUES (" +
            req.body.mobileID +
            ", " +
            connectionPool.santitizeString(req.body.feedback) +
            ")";
    } else if (req.body.webID != null) {
        query =
            "INSERT INTO feedback (webID, feedbackEntry) VALUES (" +
            req.body.webID +
            ", " +
            connectionPool.santitizeString(req.body.feedback) +
            ")";
    } else {
        res.json({ message: "An Error has Occurred." });
    }
    connectionPool.handleAPI(
        null,
        req.body.feedback,
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

module.exports = router;
