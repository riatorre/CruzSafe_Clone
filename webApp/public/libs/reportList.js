/*
    Code meant specifically for reports.html. Allows for the fetching of pages of reports as well as filtering of reports.
*/

var numButtons = 20;

/*
 *  Function to create a report button from template;
 *  this is passed into createPages() from pagination.js
 *  To help create all the pages.
 */
function createReportButton(report) {
    var button = document.createElement("BUTTON");
    const table = document.createElement("table");
    const tableRow = document.createElement("tr");
    button.setAttribute("onclick", "displayReport(" + report["reportID"] + ")");

    const resolvedUnresolved = report["resolvedUnresolved"];
    const resolvedUnresolvedFinalText = document.createElement("td");
    var resolvedUnresolvedText = document.createElement("b");
    resolvedUnresolvedFinalText.setAttribute(
        "class",
        "buttonResolvedUnresolved"
    );
    if (resolvedUnresolved.includes("N")) {
        // For resolvedUnresolved, gets status. If resolved, green. else, red.
        resolvedUnresolvedText.setAttribute("style", "color:red");
    } else if (resolvedUnresolved.includes("I")) {
        resolvedUnresolvedText.setAttribute("style", "color:orange");
    } else {
        resolvedUnresolvedText.setAttribute("style", "color:green");
    }
    resolvedUnresolvedText.appendChild(
        document.createTextNode(resolvedUnresolved)
    );
    resolvedUnresolvedFinalText.appendChild(resolvedUnresolvedText);

    const reportIDText = document.createElement("td");
    reportIDText.setAttribute("class", "buttonReportIDText");
    reportIDText.innerHTML = "#" + report["reportID"];

    const incidentIDText = document.createElement("td");
    incidentIDText.setAttribute("class", "buttonIncidentIDText");
    incidentIDText.innerHTML = "#" + report["incidentID"];

    const reportTSText = document.createElement("td");
    reportTSText.setAttribute("class", "buttonReportTSText");
    reportTSText.innerHTML = report["reportTS"];

    const tagText = document.createElement("td");
    tagText.setAttribute("class", "buttonTagText");
    tagText.innerHTML = report["tag"];

    const locationText = document.createElement("td");
    locationText.setAttribute("class", "buttonLocationText");
    locationText.innerHTML = report["location"];

    const fullNameText = document.createElement("td");
    fullNameText.setAttribute("class", "buttonFullNameText");
    fullNameText.innerHTML = report["fullName"];

    const bodyText = document.createElement("td");
    bodyText.setAttribute("class", "buttonBodyText");
    bodyText.innerHTML = report["body"];
    /*const reportIDText = addSpan(
        "buttonReportIDText",
        "#" + report["reportID"],
        document
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
    const tagText = addSpan("buttonTagText", report["tag"], document);
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
    const bodyText = addSpan("buttonBodyText", report["body"], document);*/

    tableRow.appendChild(resolvedUnresolvedFinalText);
    tableRow.appendChild(reportIDText);
    tableRow.appendChild(incidentIDText);
    tableRow.appendChild(reportTSText);
    tableRow.appendChild(tagText);
    tableRow.appendChild(locationText);
    tableRow.appendChild(fullNameText);
    tableRow.appendChild(bodyText);
    table.appendChild(tableRow);
    button.appendChild(table);
    button.setAttribute("class", "report btn " + tagColors[report["tag"]]);
    return button;
}

/*
    setupReports; has two helper functions. 
    Meant to set up the Reports page by first getting all tags from database,
    then calls gatherReportPage to get all of the reportIDs and to section off some IDs for a page.
    Then calls generateMultipleReports to get information for that page and populate the list with buttons. 

    Takes in isIntake - a boolean that says whether or not to sort reports by webID.
*/
function setupReports(isIntake) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            tags = JSON.parse(request.response);
            // Gotten array of IDs.
            tagDict = {};
            Array.from(tags).forEach(function(tag) {
                tagDict[tag["tagID"]] = tag["tagName"];
            });
            tagColors = [];
            Array.from(tags).forEach(function(tag) {
                tagColors[tag["tagName"]] = tag["color"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            gatherReportPage(isIntake, tagDict, tagColors);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
// TODO: Implement page segregation with this helper function.
function gatherReportPage(isIntake, tags, tagColors) {
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
    // If intake, grab all assigned reports to webUser
    if (isIntake) {
        request.open(
            "POST",
            "https://cruzsafe.appspot.com/api/reports/assignments"
        );
        request.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
        );
        request.send(JSON.stringify({ webID: webID }));
    }
    // Otherwise grab all reports.
    else {
        request.open(
            "POST",
            "https://cruzsafe.appspot.com/api/reports/reportIDs"
        );
        request.send();
    }
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
                        var resolvedUnresolved = "[C]"; // Completed; not null
                    } else if (!!report["initialOpenTS"]) {
                        var resolvedUnresolved = "[I]"; // no complete TS but a inital open TS
                    } else {
                        var resolvedUnresolved = "[N]"; // Null
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
                createPages(
                    "reportList",
                    numButtons,
                    allInfo,
                    createReportButton
                );
                currentTab = 0;
                showTab(0);
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
            tagColors = [];
            tagColors["Water Leak"] = "blue";
            tagColors["Broken Light"] = "lime";
            tagColors["Broken Window"] = "navy";
            tagColors["Lighting Deficiency"] = "aqua";
            tagColors["Excess Trash"] = "olive";
            tagColors["undefined"] = "black";
            /*Array.from(tags).forEach(function(tag) {
                tagColors[tag["tagName"]] = tag["color"];
            });*/
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
            generateMultipleReports(reportIDs, document, tags, tagColors);
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
 * Helper function to append divs to button
 */
function addSpan(id, text, document) {
    var span = document.createElement("span");
    span.setAttribute("class", id);
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
