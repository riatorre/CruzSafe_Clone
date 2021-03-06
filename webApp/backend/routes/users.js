/*
 * users.js
 * Routing for Users API
 */
const express = require("express");
const router = express.Router();
const connectionPool = require("../DB/config");

router.post("/getMyWebID", function(req, res) {
    try {
        res.json({ webID: req.session.webUserID });
    } catch {
        myConsole.error("[ERROR] Unable to retrieve WebID from Session");
        res.json({ webID: undefined, message: "An Error has Occurred" });
    }
});

router.post("/getMyMobileID", (req, res) => {
    try {
        res.json({ mobileID: req.session.mobileUserID });
    } catch {
        myConsole.error("[ERROR] Unable to retrieve MobileID from Session");
        res.json({ mobileID: undefined, message: "An Error has Occurred" });
    }
});

/*
 * Given a webID, returns the user privilege level.
 */
router.post("/", function(req, res) {
    const query =
        "SELECT * FROM webUsers LEFT JOIN facilities ON webUsers.facilityID = facilities.facilityID WHERE webUsers.webID = " +
        req.body.webID;
    connectionPool.handleAPI(
        req.body.webID,
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
 * Given a facilityID and webID, changes facilityID of a webID.
 */
router.post("/updateFacility", function(req, res) {
    const query =
        "UPDATE webUsers SET facilityID = " +
        req.body.facilityID +
        " WHERE webID = " +
        req.body.webID;
    connectionPool.handleAPI(
        [req.body.facilityID, req.body.webID],
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
 *
 * DEFUNCT; functionality moved into Passport Handler in app.js
 */
/*
router.post("/newID", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const query =
        "INSERT INTO mobileUsers (firstName, lastName, email) VALUES (" +
        connectionPool.sanitizeString(firstName) +
        ", " +
        connectionPool.sanitizeString(lastName) +
        ", " +
        connectionPool.sanitizeString(email) +
        ") ON DUPLICATE KEY UPDATE mobileID =LAST_INSERT_ID(mobileID), firstName = " +
        connectionPool.sanitizeString(firstName) +
        ", lastName = " +
        connectionPool.sanitizeString(lastName) +
        ", email = " +
        connectionPool.sanitizeString(email);
    connectionPool.handleAPI(
        null,
        [firstName, lastName, email],
        0,
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
*/

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

router.post("/getTutorialParams", function(req, res) {
    const query =
        "SELECT tutorialParams FROM mobileUsers WHERE mobileID = " +
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

router.post("/updateTutorialParams", function(req, res) {
    const query =
        "UPDATE mobileUsers SET tutorialParams = '" +
        JSON.stringify(req.body.tutorialParams) +
        "' WHERE mobileID = " +
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

/*
    Grab information about a single webID.
*/
router.post("/webUser", function(req, res) {
    const query =
        "SELECT * FROM webUsers LEFT JOIN facilities ON webUsers.facilityID = facilities.facilityID WHERE webUsers.webID = " +
        req.body.webID;
    connectionPool.handleAPI(
        req.body.webID,
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

/*
    Create a new user in the database.
*/
router.post("/newWebUser", function(req, res) {
    // Interpret passed JSON string to dictionary
    let values = {};
    let dictionary = JSON.parse(req.body.dict);
    let value = undefined;
    for (let key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            value = dictionary[key];
            values[key] = value;
        }
    }
    let query = "INSERT INTO webUsers(";
    let firstItem = true;
    for (key in values) {
        if (!firstItem) {
            query = query + ","; // If not first item, add a comma.
        }
        firstItem = false;
        query = query + key;
    }
    query = query + ") VALUES(";
    firstItem = true;
    for (key in values) {
        let value = "" + values[key];
        if (!firstItem) {
            query = query + ","; // If not first item, add a comma.
        }
        firstItem = false;
        query = query + value;
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
            res.json({
                message: "An Error has Occured. Query = " + query + "."
            });
        }
    );
});

/*
    Grab information about a single webID with notes.
*/
router.post("/webUserNotes", function(req, res) {
    const query =
        "SELECT * FROM webUsers, reportNotes, facilities, reports WHERE webUsers.webID = reportNotes.webID  AND webUsers.facilityID = facilities.facilityID AND reportNotes.reportID = reports.reportID AND webUsers.webID = " +
        req.body.webID +
        " ORDER BY reportNotes.ts DESC"; // Ordering clause;
    connectionPool.handleAPI(
        req.body.webID,
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

// Grab all facilities with all assignments and reports.
router.post("/allWebUsers", function(req, res) {
    const query =
        "SELECT webUsers.webID, webUsers.firstName, webUsers.lastName, webUsers.title, webUsers.facilityID, facilities.facilityName, webUsers.role FROM webUsers LEFT JOIN facilities ON webUsers.facilityID = facilities.facilityID";
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

// Gets all of the reports information + user information
router.post("/reportsUsers", function(req, res) {
    const query =
        "SELECT * FROM reports LEFT JOIN mobileUsers ON mobileUsers.mobileID = reports.mobileID";
    connectionPool.handleAPI(
        null,
        null,
        0,
        0,
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
                    message: "No reports found"
                });
            }
        },
        () => {
            res.json({ message: "An Error has occurred" });
        }
    );
});

router.post("/timeoutMobileUser", (req, res) => {
    const query = "UPDATE mobileUsers () VALUES () WHERE mobileID = ";
});
router.post("/timeoutWebUser", (req, res) => {
    const query = "UPDATE webUsers () VALUES () WHERE webID = ";
});
router.post("/banMobileUser", (req, res) => {
    const query = "UPDATE mobileUsers () VALUES () WHERE mobileID = ";
});
router.post("/banWebUser", (req, res) => {
    const query = "UPDATE webUsers () VALUES () WHERE webID = ";
});

router.post("/untimeoutMobileUser", (req, res) => {
    const query = "UPDATE mobileUsers () VALUES () WHERE mobileID = ";
});
router.post("/untimeoutWebUser", (req, res) => {
    const query = "UPDATE webUsers () VALUES () WHERE webID = ";
});
router.post("/unbanMobileUser", (req, res) => {
    const query = "UPDATE mobileUsers () VALUES () WHERE mobileID = ";
});
router.post("/unbanWebUser", (req, res) => {
    const query = "UPDATE webUsers () VALUES () WHERE webID = ";
});

router.post("/checkBannedMobileUser", (req, res) => {
    const query = "SELECT max() FROM mobileUsers WHERE mobileID = ";
});
router.post("/checkBannedWebUser", (req, res) => {
    const query = "SELECT max() FROM webUsers WHERE webID = ";
});

module.exports = router;
