const express = require("express");
const router = express.Router();
const connectionPool = require("../DB/config");
const myConsole = require("../utilities/customConsole");

// Default request for message with a specific ID, should return 0-1 messages
router.post("/", function(req, res) {
    myConsole.log(
        "[Database] Attempting to retrieve message with messageID = " +
            req.body.messageID
    );
    connectionPool.getConnection(function(err, connection) {
        if (err) {
            myConsole.error(
                "[Database] An error has occured retrieving a Connection"
            );
            myConsole.error(err);
            res.json({ message: "An Error has Occurred." });
        } else {
            connection.query(
                "SELECT * FROM messages WHERE messageID = ?",
                req.body.messageID,
                function(err, rows, fields) {
                    if (err) {
                        myConsole.error(
                            "[Database] An error has occured during the Query"
                        );
                        myConsole.log(err);
                        res.json({ message: "An Error has Occurred." });
                    } else {
                        myConsole.log(
                            "[Database] Successfully retrieved message with messageID = " +
                                req.body.messageID
                        );
                        res.json(rows);
                    }
                }
            );
            connection.release();
        }
    });
});

// get all messages for a specific report, should return 0+ messages
router.post("/getMessages", function(req, res) {
    myConsole.log(
        "[Database] Attempting to retrieve all messages for reportID = " +
            req.body.reportID
    );
    connectionPool.getConnection(function(err, connection) {
        if (err) {
            myConsole.error(
                "[Database] An error has occured retrieving a Connection"
            );
            myConsole.error(err);
            res.json({ message: "An Error has Occurred." });
        } else {
            var query = "SELECT * FROM messages WHERE reportID = ";
            for (i = 0; i < req.body.reportID.length; i++) {
                if (i == 0) {
                    query = query + req.body.reportID[i];
                } else {
                    query = query + " OR reportID = " + req.body.reportID[i];
                }
            }
            connection.query(query, function(err, rows, fields) {
                if (err) {
                    myConsole.error(
                        "[Database] An error has occured during the Query"
                    );
                    myConsole.log(err);
                    res.json({ message: "An Error has Occured." });
                } else {
                    myConsole.log(
                        "[Database] Successfully retrieved all messages for reportID = " +
                            req.body.reportID
                    );
                    res.json(rows);
                }
            });
            connection.release();
        }
    });
});

// Get all messages made by webID, should return 0+ messages
router.post("/getMessagesByUser", function(req, res) {
    myConsole.log(
        "[Database] Attempting to retrieve all messages by webID = " +
            req.body.webID
    );
    connectionPool.getConnection(function(err, connection) {
        if (err) {
            myConsole.error(
                "[Database] An error has occured retrieving a Connection"
            );
            myConsole.error(err);
            res.json({ message: "An Error has Occurred." });
        } else {
            connection.query(
                "SELECT * FROM messages WHERE webID = ?",
                req.body.webID,
                function(err, rows, fields) {
                    if (err) {
                        myConsole.error(
                            "[Database] An error has occured during the Query"
                        );
                        myConsole.log(err);
                        res.json({ message: "An Error has Occured." });
                    } else {
                        myConsole.log(
                            "[Database] Successfully retrieved all messages by webID = " +
                                req.body.webID
                        );
                        res.json(rows);
                    }
                }
            );
            connection.release();
        }
    });
});

// Create a new message for specific report and owner, returns the messageID of new message.
router.post("/submitMessage", function(req, res) {
    myConsole.log(
        "[Database] Attempting to store a new message for reportID = " +
            req.body.reportID +
            " and webID = " +
            req.body.webID
    );
    connectionPool.getConnection(function(err, connection) {
        if (err) {
            myConsole.error(
                "[Database] An error has occured retrieving a Connection"
            );
            myConsole.error(err);
            res.json({ message: "An Error has Occurred." });
        } else {
            const values = [
                [req.body.reportID, req.body.webID, req.body.messageText]
            ];
            connection.query(
                "INSERT INTO messages (reportID, webID, messageText) VALUES ?",
                [values],
                function(err, result) {
                    if (err) {
                        myConsole.error(
                            "[Database] An error has occured during the Query"
                        );
                        myConsole.log(err);
                        res.json({ message: "An Error has Occured." });
                    } else {
                        myConsole.log(
                            "[Database] Successfully stored a new message for reportID = " +
                                req.body.reportID +
                                " and webID = " +
                                req.body.webID
                        );
                        res.json({ messageID: result.insertId });
                    }
                }
            );
            connection.release();
        }
    });
});

module.exports = router;
