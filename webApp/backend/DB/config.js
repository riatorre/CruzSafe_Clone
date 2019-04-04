/*
 * config.js
 * Database Configuration File
 * May need to change host in order for connection to work
 *
 * Now utilizes a Connection Pool; should improve Turnaround time for multiple
 * Queries from separate sources
 */

const mysql = require("mysql");
const myConsole = require("../utilities/customConsole");

const numConnections = 64;
const localTest = false; // Global variable for debugging purposes.

if (localTest) {
    var connectionPool = mysql.createPool({
        connectionLimit: numConnections,
        host: "104.196.241.235",
        user: "lizhiyue",
        password: "lychee123",
        database: "cruzsafe_main"
    });
} else {
    var config = {
        connectionLimit: numConnections,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS
    };

    if (process.env.DB_INSTANCE_NAME && process.env.NODE_ENV === "production") {
        config.socketPath = "/cloudsql/" + process.env.DB_INSTANCE_NAME;
    }

    var connectionPool = mysql.createPool(config);
}

connectionPool.getConnection(function(err, connection) {
    if (err) {
        myConsole.error(err);
        myConsole.log("Closing Program");
        process.exit(1);
    } else {
        myConsole.log("Database Connection Established");
    }
    connection.release();
});

module.exports = connectionPool;
