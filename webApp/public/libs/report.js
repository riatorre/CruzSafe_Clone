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
    "reportTS2",
    "location",
    "actualPinned",
    "tag",
    "fullName",
    "mobileID",
    "phone",
    "email",
    "body"
];

// WebID (In the future, will be replaced by actual webID from Shibboleth!)
const webID = 1;

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
            tagColors = {};
            Array.from(tags).forEach(function(tag) {
                tagDict[tag["tagName"]] = tag["color"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            generateSingleReportHelper(reportID, document, tagDict, tagColors);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
function generateSingleReportHelper(reportID, document, tags, tagColors) {
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
                // If it is a new, then it is now incomplete! Set the data in the database. Apply web ID.
                //insertTS(1, reportID, webID);
                var resolvedUnresolved = "[Incomplete]"; // Null
            }
            productInfo["resolvedUnresolved"] = resolvedUnresolved;
            // reportTS
            productInfo["reportTS"] = formatDate(reportInfo["reportTS"], {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
                hour12: false
            });
            productInfo["reportTS2"] = formatDate(reportInfo["reportTS"], {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false
            });
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
            tag.setAttribute("style", "color:" + tagColors[productInfo["tag"]]);
            document
                .getElementById("reportResolve")
                .setAttribute("onclick", "markComplete(" + reportID + ")"); // Add onclick function to button
            modal.style.display = "block"; // Display the modal
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/reportID");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ id: reportID }));
}

/*
 * Calls an API that inserts a timestamp into either comletedTS or initialOpenTS
 */
function insertTS(initialOpenTS, reportID, webID) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Updated TS.");
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/timestamp");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
        JSON.stringify({
            initialOpenTS: initialOpenTS,
            reportID: reportID,
            webID: webID
        })
    );
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
            tagColors = {};
            Array.from(tags).forEach(function(tag) {
                tagDict[tag["tagName"]] = tag["color"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            gatherReportPage(document, tagDict, tagColors);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
// TODO: Implement page segregation with this helper function.
function gatherReportPage(document, tags, tagColors) {
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
            generateMultipleReports(reportIDs, document, tags, tagColors);
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
function generateMultipleReports(reportIDs, document, tags, tagColors) {
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
                    productInfo["reportTS"] = formatDate(report["reportTS"], {
                        hour: "numeric",
                        minute: "numeric",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour12: false
                    });
                    // location
                    productInfo["location"] = report["location"];
                    // tag
                    tagValue = report["tag"];
                    productInfo["tag"] = tags[tagValue];
                    // fullName
                    fullName = report["lastName"] + ", " + report["firstName"];
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
                    const incidentIDText = addSpan(
                        "buttonIncidentIDText",
                        "#" + report["incidentID"],
                        document
                    );
                    const reportTSText = addSpan(
                        "buttonReportTSText",
                        report["reportTS"],
                        document
                    );
                    const tagText = addSpan(
                        "buttonTagText",
                        report["tag"],
                        document
                    );
                    const locationText = addSpan(
                        "buttonLocationText",
                        report["location"],
                        document
                    );
                    const fullNameText = addSpan(
                        "buttonFullNameText",
                        report["fullName"],
                        document
                    );
                    const bodyText = addSpan(
                        "buttonBodyText",
                        trimString(report["body"], 70),
                        document
                    );
                    tagText.setAttribute(
                        "style",
                        "color:" + tagColors[report["tag"]]
                    );

                    button.appendChild(resolvedUnresolvedText);
                    addSpace(button);
                    button.appendChild(incidentIDText);
                    addSpace(button);
                    button.appendChild(reportTSText);
                    addSpace(button);
                    button.appendChild(tagText);
                    addSpace(button);
                    button.appendChild(locationText);
                    addSpace(button);
                    button.appendChild(fullNameText);
                    addSpace(button);
                    button.appendChild(bodyText);
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
            tagColors = {};
            Array.from(tags).forEach(function(tag) {
                tagDict[tag["tagName"]] = tag["color"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            filterReportsHelper(
                filterDict,
                document,
                tagDict,
                reverseTagDict,
                tagColors
            );
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
function filterReportsHelper(
    filterDict,
    document,
    tags,
    reverseTags,
    tagColors
) {
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
                    columnTitle = "MONTH (reportTS)"; // Expect XX-XX-XXXX
                    value = date[0]; // Month
                    apiDict[columnTitle] = value; // Log this straight away
                    columnTitle = "DAY (reportTS)"; // Expect XX-XX-XXXX
                    value = date[1]; // Day
                    apiDict[columnTitle] = value; // Log this straight away
                    columnTitle = "YEAR(reportTS)"; // Expect XX-XX-XXXX
                    value = date[2]; // Year
                    break;
                }
                case "filterTime": {
                    var time = value.split(":");
                    columnTitle = "HOUR (reportTS)"; // Expect XX:XX
                    value = time[0];
                    apiDict[columnTitle] = value; // Log this straight away
                    columnTitle = "MINUTE (reportTS)";
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
 * Helper function to add spacing divs to button
 */
function addSpace(button) {
    button.appendChild(addSpan("buttonSplitText", "  |  ", document));
}

/*
 * Helper function to append divs to button
 */
function addSpan(id, text, document) {
    var span = document.createElement("span");
    span.setAttribute("id", id);
    span.appendChild(document.createTextNode(text));
    return span;
}

/*
 * Helper function that trims a length of a string and adds ... if longer.
 */
function trimString(string, length) {
    return string.length > length
        ? string.substring(0, length - 3).trim() + "..."
        : string;
}

/*
 * Helper function that wraps a string in '' symbols for a SQL query.
 */
function addQuotes(string) {
    return (string = '"' + string + '"');
}

/*
    Helper function that converts a JS date into readable format (styling).
    Options are set to include hours,
    Returns a string.
*/
function formatDate(mySQLDate, options) {
    console.log("mySQLDate = " + mySQLDate);
    var jsDate = toDateFormat(mySQLDate);
    jsDate.setHours(jsDate.getHours() - 8);
    console.log(jsDate);
    return jsDate.toLocaleString("en-US", options);
}

/*
    The following is imported code to convert MySQL TS to JS date.
*/
function toDateFormat(mySQLDate) {
    return new Date(mySQLDate.substr(0, 10) + "T" + mySQLDate.substr(11, 8));
}

// A report has been selected!
function displayReport(id) {
    generateSingleReport(id, document); // Intializes report display
}
function hideReport() {
    document.getElementById("report").style.display = "none";
}

function markComplete(reportID) {
    insertTS(0, reportID, webID);
}
