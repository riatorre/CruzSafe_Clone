/*
 * config.js
 * Database Configuration File
 * May need to change host in order for connection to work
 */

var mysql = require("mysql");
var myConsole = require("../utilities/customConsole");

var connection = mysql.createConnection({
    host: "35.236.9.152",
    port: 3306,
    user: "riatorre",
    password: "SiD1475357",
    database: "cruzsafe_main"
});

/* Attempts to connect to Database with arguments presented above.
 * If unable to, should log the error into the console and close the program.
 * Otherwise, It reports its success & continues.
 */
connection.connect(err => {
    if (err) {
        myConsole.error(err);
        myConsole.log("Closing Program");
        //process.exit(1); // This should be uncommented when ready for full testing or release
    } else {
        myConsole.log("Database Connection Established");
    }
});

module.exports = connection;
