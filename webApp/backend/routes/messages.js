const express = require("express");
const router = express.Router();
const connectionPool = require("../DB/config");

// Default request for message with a specific ID, should return 0-1 messages
router.post("/", function(req, res) {
    if (connectionPool.verifyInt(req.body.messageID)) {
        const query =
            "SELECT * FROM messages WHERE messageID = " + req.body.messageID;
        connectionPool.connectionQuery(query, val => {
            res.json(val);
        });
    } else {
        connectionPool.invalidValues(req.body.messageID, 1, () => {
            res.json({ message: "An Error has occurred" });
        });
    }
});

// get all messages for a specific report, should return 0+ messages
router.post("/getMessages", function(req, res) {
    if (connectionPool.verifyIntArray(req.body.reportID)) {
        var query = "SELECT * FROM messages WHERE reportID = ";
        for (i = 0; i < req.body.reportID.length; i++) {
            if (i == 0) {
                query = query + req.body.reportID[i];
            } else {
                query = query + " OR reportID = " + req.body.reportID[i];
            }
        }
        connectionPool.connectionQuery(query, val => {
            res.json(val);
        });
    } else {
        connectionPool.invalidValues(req.body.reportID, -1, () => {
            res.json({ message: "An Error has occurred" });
        });
    }
});

// Get all messages made by webID, should return 0+ messages
router.post("/getMessagesByUser", function(req, res) {
    if (connectionPool.verifyInt(req.body.webID)) {
        const query = "SELECT * FROM messages WHERE webID = " + req.body.webID;
        connectionPool.connectionQuery(query, val => {
            res.json(val);
        });
    } else {
        connectionPool.invalidValues(req.body.webID, 1, () => {
            res.json({ message: "An Error has occurred" });
        });
    }
});

// Create a new message for specific report and owner, returns the messageID of new message.
router.post("/submitMessage", function(req, res) {
    if (connectionPool.verifyIntArray([req.body.reportID, req.body.webID])) {
        const query =
            "INSERT INTO messages (reportID, webID, messageText) VALUES (" +
            req.body.reportID +
            "," +
            req.body.webID +
            "," +
            connectionPool.sanitizeString(req.body.messageText) +
            ")";
        connectionPool.connectionQuery(query, val => {
            res.json({ messageID: val.insertId });
        });
    } else {
        connectionPool.invalidValues(
            [req.body.webID, req.body.reportID, req.body.messageText],
            3,
            () => {
                res.json({ message: "An Error has occurred" });
            }
        );
    }
});

module.exports = router;
