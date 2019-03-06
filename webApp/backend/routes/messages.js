const express = require("express");
const router = express.Router();
const connection = require("../DB/config");
const myConsole = require("../utilities/customConsole");

// Default request for message with a specific ID, should return 0-1 messages
router.post("/", function(req, res) {
  myConsole.log(
    "[Database] Attempting to retrieve message with messageID = " +
      req.body.messageID
  );
  connection.query(
    "SELECT * FROM messages WHERE messageID = ?",
    req.body.messageID,
    function(err, rows, fields) {
      if (err) {
        myConsole.log(err);
        res.json({ message: "An Error has Occured." });
      } else {
        myConsole.log(
          "[Database] Successfully retrieved message with messageID = " +
            req.body.messageID
        );
        res.json(rows);
      }
    }
  );
});

// get all messages for a specific report, should return 0+ messages
router.post("/getMessages", function(req, res) {
  myConsole.log(
    "[Database] Attempting to retrieve all messages for reportID = " +
      req.body.reportID
  );
  connection.query(
    "SELECT * FROM messages WHERE reportID = ?",
    req.body.reportID,
    function(err, rows, fields) {
      if (err) {
        myConsole.log(err);
        res.json({ message: "An Error has Occured." });
      } else {
        myConsole.log(
          "[Database] Successfully retrieved all messages for reportID = " +
            req.body.reportID
        );
        res.json(rows);
      }
    }
  );
});

// Get all messages made by webID, should return 0+ messages
router.post("/getMessagesByUser", function(req, res) {
  myConsole.log(
    "[Database] Attempting to retrieve all messages by webID = " +
      req.body.webID
  );
  connection.query(
    "SELECT * FROM messages WHERE webID = ?",
    req.body.webID,
    function(err, rows, fields) {
      if (err) {
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
});

// Create a new message for specific report and owner, returns the messageID of new message.
router.post("/submitMessage", function(req, res) {
  myConsole.log(
    "[Database] Attempting to store a new message for reportID = " +
      req.body.reportID +
      " and webID = " +
      req.body.webID
  );
  const values = [[req.body.reportID, req.body.webID, req.body.messageText]];
  connection.query(
    "INSERT INTO messages (reportID, webID, messageText) VALUES ?",
    [values],
    function(err, result) {
      if (err) {
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
});

module.exports = router;
