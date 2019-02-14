/*
 * config.js
 * Database Configuration File
 * May need to change host in order for connection to work
 */

var mysql = require("mysql");
var myConsole = require("../utilities/customConsole");

const localTest = true; // Global variable for debugging purposes.

if (localTest) {
    var connection = mysql.createConnection({
        host: "35.236.9.152",
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
} else {
    // Meant for Google Cloud connection!

    var config = {
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS
    };

    if (process.env.DB_INSTANCE_NAME && process.env.NODE_ENV === "production") {
        config.socketPath = "/cloudsql/" + process.env.DB_INSTANCE_NAME;
    }

    var connection = mysql.createConnection(config);
}

module.exports = connection;
