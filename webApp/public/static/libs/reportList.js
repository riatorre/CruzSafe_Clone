/*
    Code meant specifically for reports.html. Allows for the fetching of pages of reports as well as filtering of reports.
*/

var numButtons = 20;

/*
    setupListReports; lists all of the reports. Has two helper functions. 
    Meant to set up the Reports/Intake page by first getting all tags from database,
    then calls gatherReportPage to get all of the reportIDs and to section off some IDs for a page.
    Then calls generateMultipleReports to get information for that page and populate the list with buttons. 
*/
function setupListReports() {
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
            gatherReportPage(tagDict);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
// Get a list of reportIDs to generate reports from.
function gatherReportPage(tags) {
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
            generateMultipleReports(reportIDs, tags);
        }
    };
    // If intake, grab all assigned reports to webUser
    if (pageID == 1) {
        request.open("POST", "https://cruzsafe.appspot.com/api/assignments");
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
function generateMultipleReports(reportIDs, tags) {
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
                    "reportList",
                    numButtons,
                    allInfo,
                    createReportButton
                );
                currentTabs["reportList"] = 0;
                showTab("reportList", 0);
            }
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ id: JSON.stringify(reportIDs) }));
}

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

    const box = document.createElement("td");
    box.setAttribute("class", "checkbox");

    const label = document.createElement("label");
    label.setAttribute("class", "container");

    const check = document.createElement("input");
    check.setAttribute("type", "checkbox");

    const span = document.createElement("span");
    span.setAttribute("class", "checkmark");

    label.appendChild(check);
    label.appendChild(span);
    box.appendChild(label);

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
    tableRow.appendChild(box);
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
