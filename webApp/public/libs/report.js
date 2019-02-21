/*
    Standardized code to display all details of a given report number and 
    of the mobile user who sent it in.
    
    Two primary functions: 
        generateSingleReport(reportID, document)
        setupReports(document)
*/

// Array of dictionary entries + tag ids.
reportFields = [
    "incidentID",
    "resolvedUnresolved",
    "reportTS",
    "location",
    "actualPinned",
    "tag",
    "fullName",
    "mobileID",
    "phone",
    "email",
    "body"
];

/*
    generateSingleReport: takes in a specific reportID and the document itself. 
    Assuming the report modal is in the document, makes two requests to the APIs. 

    First request is for tags. Passes it to helper function.
    Helper function requests for all information and adds to modal, then makes modal visible.
*/
function generateSingleReport(reportID, document) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            tags = JSON.parse(request.response);
            // Gotten array of IDs.
            tagDict = {};
            Array.from(tags).forEach(function(tag) {
                tagDict[tag["tagID"]] = tag["tagName"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            generateSingleReportHelper(reportID, document, tagDict);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
function generateSingleReportHelper(reportID, document, tags) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var productInfo = [];
            reportInfo = JSON.parse(request.response)[0]; // Returns an array containing a single row as an object

            // incidentID
            productInfo["incidentID"] = reportInfo["incidentID"];
            // resolved/unresolved
            if (!!reportInfo["completeTS"]) {
                var resolvedUnresolved = "[Complete]"; // Completed; not null
            } else if (!!reportInfo["initialOpenTS"]) {
                var resolvedUnresolved = "[Incomplete]"; // no complete TS but a inital open TS
            } else {
                var resolvedUnresolved = "[New]"; // Null
            }
            productInfo["resolvedUnresolved"] = resolvedUnresolved;
            // reportTS
            productInfo["reportTS"] = reportInfo["reportTS"];
            // location
            productInfo["location"] = reportInfo["location"];
            // actual/pinned
            if (reportInfo["unchangedLocation"]) {
                var actualPinned = "(Actual)";
            } else {
                var actualPinned = "(Pinned)";
            }
            productInfo["actualPinned"] = actualPinned;
            // tag
            tagValue = reportInfo["tag"];
            productInfo["tag"] = tags[tagValue];
            // fullName
            fullName = reportInfo["lastName"] + " " + reportInfo["firstName"];
            productInfo["fullName"] = fullName;
            // mobileID
            productInfo["mobileID"] = reportInfo["mobileID"];
            // phone
            productInfo["phone"] = reportInfo["phone"];
            // email
            productInfo["email"] = reportInfo["email"];
            // body
            productInfo["body"] = reportInfo["body"];

            // All data has now been added into reportData
            const modal = document.getElementById("report");
            if (productInfo["resolvedUnresolved"].includes("New")) {
                // For resolvedUnresolved, gets status. If resolved, green. else, red.
                document.getElementById("resolvedUnresolved").style.color =
                    "red";
            } else if (
                productInfo["resolvedUnresolved"].includes("Incomplete")
            ) {
                document.getElementById("resolvedUnresolved").style.color =
                    "orange";
            } else {
                document.getElementById("resolvedUnresolved").style.color =
                    "yellowgreen";
            }

            for (i = 0; i < reportFields.length; i++) {
                // For all entries in reportFields
                const field = reportFields[i];
                const targetTag = document.getElementById(field);
                targetTag.innerHTML = productInfo[field];
            }
            modal.style.display = "block"; // Display the modal
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/reportID");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ id: reportID }));
}

/*
    setupReports; has two helper functions. 
    Meant to set up the Reports page by first getting all tags from database,
    then calls gatherReportPage to get all of the reportIDs and to section off some IDs for a page.
    Then calls generateMultipleReports to get information for that page and populate the list with buttons. 
*/
function setupReports(document) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            tags = JSON.parse(request.response);
            // Gotten array of IDs.
            tagDict = {};
            Array.from(tags).forEach(function(tag) {
                tagDict[tag["tagID"]] = tag["tagName"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            gatherReportPage(document, tagDict);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
// TODO: Implement page segregation with this helper function.
function gatherReportPage(document, tags) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reportIDsArray = JSON.parse(request.response);
            // Gotten array of IDs.
            reportIDs = [];
            Array.from(reportIDsArray).forEach(function(reportID) {
                reportIDs.push(reportID["reportID"]);
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            generateMultipleReports(reportIDs, document, tags);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/reportIDs");
    request.send();
}
/*
    Populates the list of reports

    Given document, tags. Also given reportIDs; an array of reportIDs to display! 
    This array is JSONified and  passed to the API using POST. 
    API returns array of dictionaries for each report etc. 
*/
function generateMultipleReports(reportIDs, document, tags) {
    // TODO: Implement a single-query implementation so you don't query the database for ALL reports.
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reportInfo = JSON.parse(request.response); // Returns an array
            var allInfo = [];

            reportList = document.getElementById("reportList"); // Remove all items in list if any
            while (reportList.firstChild) {
                reportList.removeChild(reportList.firstChild);
            }
            if (reportInfo != null) {
                Array.from(reportInfo).forEach(function(report) {
                    var productInfo = [];
                    productInfo["reportID"] = report["reportID"];
                    // incidentID
                    productInfo["incidentID"] = report["incidentID"];
                    // resolved/unresolved
                    if (!!report["completeTS"]) {
                        var resolvedUnresolved = "[Complete]"; // Completed; not null
                    } else if (!!report["initialOpenTS"]) {
                        var resolvedUnresolved = "[Incomplete]"; // no complete TS but a inital open TS
                    } else {
                        var resolvedUnresolved = "[New]"; // Null
                    }
                    productInfo["resolvedUnresolved"] = resolvedUnresolved;
                    // reportTS
                    productInfo["reportTS"] = report["reportTS"];
                    // location
                    productInfo["location"] = report["location"];
                    // tag
                    tagValue = report["tag"];
                    productInfo["tag"] = tags[tagValue];
                    // fullName
                    fullName = report["lastName"] + " " + report["firstName"];
                    productInfo["fullName"] = fullName;
                    // mobileID
                    productInfo["body"] = report["body"];

                    // All data has now been added into reportData
                    allInfo.push(productInfo);
                });
                // All info for all reports have been read and formatted. Create buttons.
                Array.from(allInfo).forEach(function(report) {
                    var button = document.createElement("BUTTON");
                    button.setAttribute("id", "launchReport");
                    button.setAttribute(
                        "onclick",
                        "displayReport(" + report["reportID"] + ")"
                    );
                    const resolvedUnresolved = report["resolvedUnresolved"];
                    var resolvedUnresolvedText = document.createElement("b");
                    if (resolvedUnresolved.includes("New")) {
                        // For resolvedUnresolved, gets status. If resolved, green. else, red.
                        resolvedUnresolvedText.setAttribute(
                            "style",
                            "color:red"
                        );
                    } else if (resolvedUnresolved.includes("Incomplete")) {
                        resolvedUnresolvedText.setAttribute(
                            "style",
                            "color:orange"
                        );
                    } else {
                        resolvedUnresolvedText.setAttribute(
                            "style",
                            "color:green"
                        );
                    }
                    resolvedUnresolvedText.appendChild(
                        document.createTextNode(resolvedUnresolved)
                    );
                    button.appendChild(resolvedUnresolvedText);
                    var buttonText = document.createTextNode(
                        " | " +
                            report["incidentID"] +
                            " | " +
                            report["reportTS"] +
                            " | " +
                            report["tag"] +
                            " | " +
                            report["location"] +
                            " | " +
                            report["fullName"] +
                            " | " +
                            "Insert Body Here."
                    );
                    button.appendChild(buttonText);
                    reportList.appendChild(button);
                });
            }
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ id: JSON.stringify(reportIDs) }));
}

/*
    filterReports; A modified version of setupReports. Activated from reports.html when filter button is clicked.

    Grabs a dictionary of key:value = filterOption:value taken from filter fields. 
    Converts said dictionary into key:value = columnName:value (i.e. TagValue -> TagKey)
    Calls api/reports/specifyReportIDs with said dictionary. Gets an array of reportIDs matching the
    dictionary. Then removes all buttons in the reportList and leaves it fresh.
    Then calls generateMultipleReports with that array of reportIDs.

    filterReports gets tags.
    filterReportsHelper does the rest.
*/
function filterReports(filterDict, document) {
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
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            filterReportsHelper(filterDict, document, tagDict, reverseTagDict);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
function filterReportsHelper(filterDict, document, tags, reverseTags) {
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
                    columnTitle = "reportTS"; // Expect XX-XX-XX
                    var date = new Date().toMysqlFormat(); // Get current date.
                    // TODO: Worry about this crap
                    break;
                }
                case "filterTime": {
                    columnTitle = "reportTS"; // Expect XX-XX-XX
                    var date = new Date().toMysqlFormat(); // Get current date.
                    // TODO: Worry about this crap
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
                    value = "LIKE '%{$\" + value + \"}%'";
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
            console.log("columnTitle = " + columnTitle + ", value = " + value);
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
            generateMultipleReports(reportIDs, document, tags);
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
 * Helper function that wraps a string in '' symbols for a SQL query.
 */
function addQuotes(string) {
    return (string = '"' + string + '"');
}

/*
    The following is imported code to convert JS date to MySQL TS.
*/
/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return (
        this.getUTCFullYear() +
        "-" +
        twoDigits(1 + this.getUTCMonth()) +
        "-" +
        twoDigits(this.getUTCDate()) +
        " " +
        twoDigits(this.getUTCHours()) +
        ":" +
        twoDigits(this.getUTCMinutes()) +
        ":" +
        twoDigits(this.getUTCSeconds())
    );
};
