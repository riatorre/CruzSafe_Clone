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

connectionPool.connectionQuery = (query, callback) => {
    myConsole.log("[Database] Attempting to Execute Query: '" + query + "'");
    connectionPool.getConnection(function(err, connection) {
        if (err) {
            myConsole.error(
                "[Database] An error has occured retrieving a Connection"
            );
            myConsole.error(err);
            callback({ message: "An Error has Occurred." });
        } else {
            connection.query(query, function(err, rows, fields) {
                if (err) {
                    myConsole.error(
                        "[Database] An error has occured Executing Query: '" +
                            query +
                            "'"
                    );
                    myConsole.error(err);
                    callback({ message: "An Error has occured" });
                } else {
                    myConsole.log(
                        "[Database] Executed Query: '" +
                            query +
                            "' Successfully"
                    );
                    callback(rows);
                }
            });
            connection.release();
        }
    });
};

connectionPool.verifyInt = val => {
    return val != null && !isNaN(parseInt(val));
};

connectionPool.verifyIntArray = val => {
    if (connectionPool.isArray(val)) {
        for (i = 0; i < val.length; i++) {
            if (!connectionPool.verifyInt(val[i])) {
                return false;
            }
        }
        return true;
    } else {
        return connectionPool.verifyInt(val);
    }
};

connectionPool.isArray = array => {
    return !!array && array.constructor === Array;
};

connectionPool.invalidValues = (vals, numValsExpected, callback) => {
    if (numValsExpected === -1) {
        myConsole.error(
            '[Database] Invalid value(s) "' + vals + '" encountered.'
        );
    } else {
        if (
            vals === null ||
            (connectionPool.isArray(vals) && vals.length < numValsExpected)
        ) {
            myConsole.error("[Database] Missing required value(s)");
        } else if (
            connectionPool.isArray(vals) &&
            vals.length > numValsExpected
        ) {
            myConsole.error("[Database] Number of Values exceeds expected");
        } else {
            myConsole.error(
                '[Database] Invalid value(s) "' + vals + '" encountered.'
            );
        }
    }
    callback();
};

connectionPool.sanitizeString = str => {
    return mysql.escape(str);
};

module.exports = connectionPool;
