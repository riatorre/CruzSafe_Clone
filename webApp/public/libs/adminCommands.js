/*
 * Administrative commands.
 */

/*
 * modifyExpire takes in a count of how many DAYS are to be alotted until deletion of a report.
 * These are going to be set parameters as input by button presses; legal issues; like 90 days, or 730 days (2 years)
 */
function modifyExpire(numDays) {
    currentDate = new Date(); // Get current date.
    calculateValid(numDays, currentDate); // Runs calculateValid.
}

/*
    Calculate Valid grabs all TS's and reportIDS of all reports. 
    Once that has been gotten, seperate reportIDS based on whether its initial TS + numDays < or > currentDate. 
 */
function calculateValid(numDays, currentDate) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var allReports = JSON.parse(request.response);
            var validReportIDS = {}; // DIct with ID and newExpireTS's.
            var invalidReportIDS = [];
            Array.from(allReports).forEach(function(report) {
                // For each report,
                var newExpireTS = toDateFormat(report["reportTS"]); // Convert initialTS into JS date.
                newExpireTS = newExpireTS.addDays(parseInt(numDays)); // Calculate initialTS + numDays.
                if (newExpireTS > currentDate) {
                    // Check if initialTS + numDays > currentDate.
                    validReportIDS[report["reportID"]] =
                        "'" +
                        newExpireTS
                            .toISOString()
                            .slice(0, 19)
                            .replace("T", " ") +
                        "'"; // If so, this report is still valid. Add to list of valid reports.
                } else {
                    invalidReportIDS.push(report["reportID"]); // Else, this report is no longer valid. Add to list of invalid reports.
                }
            });
            modifyReports(validReportIDS, invalidReportIDS);
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/allReportTS"
    );
    request.send();
}

/*
    Given a dictionary ID: newExpireTSs
    and an array of IDs

    Does something to modify the reports. Currently placeholders.
*/
function modifyReports(validReportIDS, invalidReportIDS) {
    console.log("VALID: " + validReportIDS); // Call function to change expiretS of valid reports.
    setExpireDate(validReportIDS);
    console.log("INVALID: " + invalidReportIDS); // Call function to remove information of invalid reports.
    // TODO: currently not doing anything to invalid reports.
}

/*
 * Sets new reportTS's. Takes in a dict with ID:TS with TS in MYSQL form.
 */
function setExpireDate(reportsDict) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(request.response));
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/setExpire");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ reportsDict: JSON.stringify(reportsDict) }));
}

/*
 * similar to modifyExpire but takes in numDays and a reportID.
    numDays is expected to be a string.
 */
function modifyExpireSingle(numDays, reportID) {
    currentDate = new Date();
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Got a report matching reportID.
            var validReportIDS = {}; // DIct with ID and newExpireTS's. (Only one for this iteration)
            var invalidReportIDS = []; // DIct with invalid ID (Only one for this itration)
            reportInfo = JSON.parse(request.response)[0]; // Returns an array containing a single row as an object
            var newExpireTS = toDateFormat(reportInfo["reportTS"]); // Got original date.
            newExpireTS = newExpireTS.addDays(parseInt(numDays));
            if (newExpireTS > currentDate) {
                // Check if initialTS + numDays > currentDate.
                validReportIDS[reportID] =
                    "'" +
                    newExpireTS
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " ") +
                    "'"; // If so, this report is still valid. Add to list of valid reports.
            } else {
                invalidReportIDS.push(reportID); // Else, this report is no longer valid. Add to list of invalid reports.
            }
            modifyReports(validReportIDS, invalidReportIDS);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/reportID");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ id: reportID }));
}

/*
    Copied code to add days to a JS date.
*/
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

/*
    Helper function that converts a JS date into readable format (styling).
    Options are set to include hours,
    Returns a string.
*/
function formatDate(mySQLDate, options) {
    var jsDate = toDateFormat(mySQLDate);
    return jsDate.toLocaleString("en-US", options);
}

/*
    The following is imported code to convert MySQL TS to JS date.
*/
function toDateFormat(mySQLDate) {
    return convertUTCDateToLocalDate(
        new Date(mySQLDate.substr(0, 10) + "T" + mySQLDate.substr(11, 8))
    );
}

function convertUTCDateToLocalDate(date) {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )
    );
}
