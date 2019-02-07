/*
 * config.js
 * Database Configuration File
 * May need to change host in order for connection to work
 */

var mysql = require("mysql");
var myConsole = require("./customConsole");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "Compatibility_riatorre",
    password: "SiD1475357",
    database: "cruzsafe"
});

connection.connect(err => {
    if (err) {
        myConsole.error(err);
        myConsole.log("Closing Program");
        //process.exit(1);
    } else {
        myConsole.log("Database Connection Established");
    }
});

module.exports = connection;
