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

// Handles all possible queries; takes in a query as a string and a callback function to be executed on success
connectionPool.connectionQuery = (query, callback) => {
    myConsole.log('[Database] Attempting to Execute Query: "' + query + '"');
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
                        '[Database] An Error has occured Executing Query: "' +
                            query +
                            '"'
                    );
                    myConsole.error(err);
                    callback({ message: "An Error has occured" });
                } else {
                    myConsole.log(
                        '[Database] Successfully Executed Query: "' +
                            query +
                            '"'
                    );
                    callback(rows);
                }
            });
            connection.release();
        }
    });
};

// Helper function
connectionPool.verifyInt = val => {
    return val != null && !isNaN(parseInt(val));
};

// Verifies ALL contents of parameter is an Int
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

// Sanitizes a string for use by MySQL; Needed in order to avoid SQL Injection
connectionPool.sanitizeString = str => {
    return mysql.escape(str);
};

// Determines if parameter is an Array
connectionPool.isArray = array => {
    return !!array && array.constructor === Array;
};

// Error reporting for invalid Values
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

/* Handles API by checking id all int values are truly ints
 * Takes in ints and other values, number of expected ints and number of total expected values,
 * query string itself, callback to be executed on success and an error CallBack to be called on failure
 */
connectionPool.handleAPI = (
    ints,
    otherVals,
    expectedNumInts,
    expectedNumVals,
    query,
    callback,
    errorCB
) => {
    if (expectedNumInts === 0 || connectionPool.verifyIntArray(ints)) {
        connectionPool.connectionQuery(query, callback);
    } else {
        var valArray = [];
        if (ints && otherVals) {
            const intsArray = connectionPool.isArray(ints) ? ints : [ints];
            const otherValsArray = connectionPool.isArray(otherVals)
                ? otherVals
                : [otherVals];
            valArray = intsArray.concat(otherValsArray);
        } else if (ints) {
            valArray = connectionPool.isArray(ints) ? ints : [ints];
        } else if (otherVals) {
            valArray = connectionPool.isArray(otherVals)
                ? otherVals
                : [otherVals];
        }
        connectionPool.invalidValues(valArray, expectedNumVals, errorCB);
    }
};

module.exports = connectionPool;
