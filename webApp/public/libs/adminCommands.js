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
                newExpireTS = newExpireTS.addDays(numDays); // Calculate initialTS + numDays.
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
            console.log("VALID: " + validReportIDS); // Call function to change expiretS of valid reports.
            setExpireDate(validReportIDS);
            console.log("INVALID: " + invalidReportIDS); // Call function to remove information of invalid reports.
            // TODO: currently not doing anything to invalid reports.
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/allReportTS"
    );
    request.send();
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
    Copied code to add days to a JS date.
*/
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
