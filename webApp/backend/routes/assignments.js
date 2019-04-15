/*
    assignemnts.js - used to add assignments/gather information about assignments
*/

const express = require("express");
const router = express.Router();
const connectionPool = require("../DB/config");

/*
    Given a recieverWebID, grabs all of the reportIDs.
*/
router.post("/", function(req, res) {
    const query =
        "SELECT assignments.reportID FROM assignments, webUsers, reports WHERE assignments.recieverFacilityID = webUsers.facilityID AND webUsers.webID = " +
        req.body.webID +
        " ORDER BY initialOpenTS IS NULL DESC, initialOpenTS IS NOT NULL AND completeTS IS NULL DESC, completeTS IS NOT NULL DESC, reportTS DESC";
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
    Given a list of reportIDS, returns only a list of reportIDS that have been assigned to a given webID.
*/
router.post("/isolateAssignments", function(req, res) {
    var reportIDs = JSON.parse(req.body.id);
    var query =
        "SELECT assignments.reportID FROM assignments, webUsers, reports WHERE assignments.recieverFacilityID = webUsers.facilityID AND webUsers.webID = " +
        req.body.webID +
        " AND assignments.reportID = ";
    for (i = 0; i < reportIDs.length; i++) {
        if (i == 0) {
            query = query + reportIDs[i];
        } else {
            query = query + " OR assignments.reportID = " + reportIDs[i];
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

/*
    Given a reportID, senderWebID, and recieverFacilityID, creates a new assignment entry
*/
router.post("/assign", function(req, res) {
    const query =
        "INSERT INTO assignments (reportID, senderWebID, recieverFacilityID) VALUES (" +
        req.body.reportID +
        "," +
        req.body.webID +
        "," +
        req.body.facilityID +
        ")";
    connectionPool.handleAPI(
        [req.body.reportID, req.body.webID, req.body.facilityID],
        null,
        3,
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

module.exports = router;

/*
    given a reportID and a recieverFacilityID, returns an assignmentID if there are any matches in assignments.
*/
router.post("/check", function(req, res) {
    const query =
        "SELECT assignmentID FROM assignments WHERE reportID = " +
        req.body.reportID +
        " AND recieverFacilityID = " +
        req.body.facilityID;
    connectionPool.handleAPI(
        [req.body.reportID, req.body.facilityID],
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

// Grab all facilities with all assignments and reports.
router.post("/facilityAssignments", function(req, res) {
    const query =
        "SELECT facilities.facilityID, facilities.facilityName, assignments.reportID, reports.completeTS, reports.initialOpenTS, facilities.color FROM assignments, reports, facilities WHERE assignments.recieverFacilityID = facilities.facilityID AND assignments.reportID = reports.reportID";
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
