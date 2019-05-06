/*
 * messages.js
 * Routing for Messages API
 */
const express = require("express");
const router = express.Router();
const connectionPool = require("../DB/config");

// Default request for message with a specific ID, should return 0-1 messages
router.post("/", function(req, res) {
    const query =
        "SELECT * FROM messages WHERE messageID = " + req.body.messageID;
    connectionPool.handleAPI(
        req.body.messageID,
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

// get all messages for a specific report, should return 0+ messages
router.post("/getMessages", function(req, res) {
    let query = "SELECT * FROM messages WHERE reportID = ";
    for (i = 0; i < req.body.reportID.length; i++) {
        if (i == 0) {
            query = query + req.body.reportID[i];
        } else {
            query = query + " OR reportID = " + req.body.reportID[i];
        }
    }
    connectionPool.handleAPI(
        req.body.reportID,
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

// Get all messages made by webID, should return 0+ messages
router.post("/getMessagesByUser", function(req, res) {
    const query = "SELECT * FROM messages WHERE webID = " + req.body.webID;
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
            res.json({ message: "An Error has occurred" });
        }
    );
});

// Create a new message for specific report and owner, returns the messageID of new message.
router.post("/submitMessage", function(req, res) {
    const query =
        "INSERT INTO messages (reportID, webID, messageText) VALUES (" +
        req.body.reportID +
        ", " +
        req.body.webID +
        ", " +
        connectionPool.sanitizeString(req.body.messageText) +
        ")";
    connectionPool.handleAPI(
        [req.body.reportID, req.body.webID],
        connectionPool.sanitizeString(req.body.messageText),
        2,
        3,
        query,
        val => {
            res.json({ message: val.insertId });
        },
        () => {
            res.json({ message: "An Error has occurred" });
        }
    );
});

module.exports = router;
