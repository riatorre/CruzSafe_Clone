var express = require("express");
var router = express.Router();
var connection = require("../DB/config");
var myConsole = require("../utilities/customConsole");

router.get("/", function(req, res) {
    myConsole.log("Attempting to select all users");
    connection.query("SELECT id,username FROM users", function(
        err,
        rows,
        fields
    ) {
        if (err) {
            myConsole.err(err);
            res.json({ message: "An Error has occured" });
        } else {
            myConsole.log("SELECT Query Successful");
            res.json(rows);
        }
    });
});

router.get("/:id([0-9]+)", function(req, res) {
    myConsole.log("Attempting to select user with ID=" + req.params.id);
    connection.query(
        "SELECT id,username FROM users WHERE id = ?",
        req.params.id,
        function(err, rows, fields) {
            if (err) {
                myConsole.err(err);
                res.json({ message: "An Error has occured" });
            } else {
                myConsole.log("SELECT BY ID Query Successful");
                if (rows.length > 0) {
                    res.json(rows);
                } else {
                    res.json({ message: "No user with given ID found" });
                }
            }
        }
    );
});

module.exports = router;
