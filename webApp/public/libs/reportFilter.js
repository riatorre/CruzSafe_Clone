/*
    Code to filter the reports List.
*/

/*
    filterReports; A modified version of setupListReports. Activated from reports.html when filter button is clicked.

    Grabs a dictionary of key:value = filterOption:value taken from filter fields. 
    Converts said dictionary into key:value = columnName:value (i.e. TagValue -> TagKey)
    Calls api/reports/specifyReportIDs with said dictionary. Gets an array of reportIDs matching the
    dictionary. Then removes all buttons in the reportList and leaves it fresh.
    Then calls generateMultipleReports with that array of reportIDs.

    filterReports gets tags.
    filterReportsHelper does the rest.
*/
function filterReports(filterDict) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            tags = JSON.parse(request.response);
            // Gotten array of IDs.
            tagDict = {};
            reverseTagDict = {};
            Array.from(tags).forEach(function(tag) {
                tagDict[tag["tagID"]] = tag["tagName"];
                reverseTagDict[tag["tagName"].toLowerCase()] = tag["tagID"];
            });
            tagColors = [];
            Array.from(tags).forEach(function(tag) {
                tagColors[tag["tagName"]] = tag["color"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            filterReportsHelper(filterDict, tagDict, reverseTagDict, tagColors);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
function filterReportsHelper(filterDict, tags, reverseTags) {
    var apiDict = {};
    for (key in filterDict) {
        if (filterDict[key] != null) {
            var value = filterDict[key];
            // Special cases wherin something must be done.
            switch (key) {
                case "filterTag": {
                    columnTitle = "tag";
                    value = reverseTags[value.toLowerCase()]; // Given the value, find the key. Use reversed dictionary.
                    break;
                }
                case "filterDate": {
                    var date = value.split("/");
                    columnTitle = "MONTH (reportTS)"; // Expect XX/XX/XXXX
                    value = date[0]; // Month
                    apiDict[columnTitle] = value; // Log this straight away
                    columnTitle = "DAY (reportTS)"; // Expect XX/XX/XXXX
                    value = date[1]; // Day
                    apiDict[columnTitle] = value; // Log this straight away
                    columnTitle = "YEAR(reportTS)"; // Expect XX/XX/XXXX
                    value = date[2]; // Year
                    break;
                }
                case "filterTime": {
                    var time = value.split(":");
                    columnTitle = "HOUR(reportTS)"; // Expect XX:XX
                    value = time[0];
                    /*console.log(
                        "columnTitle = " + columnTitle + ", value = " + value
                    );*/
                    apiDict[columnTitle] = value; // Log this straight away
                    columnTitle = "MINUTE(reportTS)";
                    value = time[1];
                    break;
                }
                case "filterStatus": {
                    if (value === "Complete") {
                        columnTitle = "completeTS";
                        value = "IS NOT NULL"; // If it exists.
                    } else if (value === "Incomplete") {
                        // Requires two conditions
                        columnTitle = "initialOpenTS";
                        value = "IS NOT NULL"; /// If it exists.
                        apiDict[columnTitle] = value; // Log this straight away
                        columnTitle = "completeTS";
                        value = "IS NULL";
                    } else {
                        columnTitle = "initialOpenTS";
                        value = "IS NULL"; // If it DOESN'T exist.
                    }
                    break;
                }
                case "filterBody": {
                    columnTitle = "body";
                    value = "LIKE '%{$" + value + "}%'";
                    break;
                }
                case "filterUnchangedLocation": {
                    columnTitle = "unchangedLocation";
                    if (value === "device reported") {
                        value = 1;
                    } else {
                        value = 0;
                    }
                    break;
                }
                case "filterAttachments": {
                    columnTitle = "attachments";
                    if (value === "yes") {
                        value = 1;
                    } else {
                        value = 0;
                    }
                    break;
                }
                case "filterMobileID": {
                    columnTitle = "reports.mobileID";
                    break;
                }
                // Cases of integers; no add quotes
                case "filterIncidentID": {
                    columnTitle = key.replace("filter", "");
                    columnTitle =
                        columnTitle.charAt(0).toLowerCase() +
                        columnTitle.slice(1);
                    break;
                }
                default: {
                    // Else simply remove filter prefix and change first letter to lowercase; this should be the column title.
                    columnTitle = key.replace("filter", "");
                    columnTitle =
                        columnTitle.charAt(0).toLowerCase() +
                        columnTitle.slice(1);
                    value = addQuotes(value); // Furthermore, assume the value is a VARCHAR in the database.
                    break;
                }
            }
            //console.log("columnTitle = " + columnTitle + ", value = " + value);
            apiDict[columnTitle] = value;
        }
    }

    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reportIDsArray = JSON.parse(request.response);
            // Gotten array of IDs.
            reportIDs = [];
            if (reportIDsArray != null) {
                Array.from(reportIDsArray).forEach(function(reportID) {
                    reportIDs.push(reportID["reportID"]);
                });
            }
            // gotten list of all IDs. Calls generateMultipleReports with gotten reportIDs.
            clearPages();
            // If intake page
            if (pageID == 1) {
                excludeFilterResults(reportIDs, tags);
            } else {
                generateMultipleReports(reportIDs, tags);
            }
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/specifyReportIDs"
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ dict: JSON.stringify(apiDict) }));
}

/*
    Function that, given a list of reportIDs, returns only the reportIDS that have been assigned to a webID. 
*/
function excludeFilterResults(reportIDs, tags) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reportIDsArray = JSON.parse(request.response);
            // Gotten array of IDs.
            reportIDs = [];
            if (reportIDsArray != null) {
                Array.from(reportIDsArray).forEach(function(reportID) {
                    reportIDs.push(reportID["reportID"]);
                });
            }
            // gotten list of all IDs. Calls generateMultipleReports with gotten reportIDs.
            generateMultipleReports(reportIDs, tags);
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/isolateAssignments"
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
        JSON.stringify({ id: JSON.stringify(reportIDs), webID: webID })
    );
}

/*
 * Helper function that wraps a string in '' symbols for a SQL query.
 */
function addQuotes(string) {
    return (string = '"' + string + '"');
}
