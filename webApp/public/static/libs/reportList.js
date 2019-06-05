/*
    reportList.js
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
    if (location.pathname === "/admin.html") {
        var button = document.createElement("BUTTON");
        const table = document.createElement("table");
        const tableRow = document.createElement("tr");
        button.setAttribute(
            "onclick",
            "displayReport(" + report["reportID"] + ")"
        );

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
    } else {
        const whole = document.createElement("div");
        whole.setAttribute("class", "whole");

        const checkbox = document.createElement("div");

        const label = document.createElement("label");
        label.setAttribute("class", "container");

        const check = document.createElement("input");
        check.setAttribute("type", "checkbox");
        check.setAttribute("class", "check");
        check.setAttribute("id", report["reportID"]);
        check.setAttribute("onclick", "selectReports()");

        const span = document.createElement("span");
        span.setAttribute("class", "checkmark");

        label.appendChild(check);
        label.appendChild(span);
        checkbox.appendChild(label);
        whole.appendChild(checkbox);

        var button = document.createElement("BUTTON");
        const table = document.createElement("table");
        const tableRow = document.createElement("tr");
        button.setAttribute(
            "onclick",
            "displayReport(" + report["reportID"] + ")"
        );

        const resolvedUnresolved = report["resolvedUnresolved"];
        const resolvedUnresolvedFinalText = document.createElement("td");
        var resolvedUnresolvedText = document.createElement("b");
        resolvedUnresolvedFinalText.setAttribute(
            "class",
            "buttonResolvedUnresolved"
        );
        if (resolvedUnresolved.includes("N")) {
            // For resolvedUnresolved, gets status. If resolved, green. else, red.
            resolvedUnresolvedText.setAttribute(
                "style",
                "color:red;margin-left:30px"
            );
        } else if (resolvedUnresolved.includes("I")) {
            resolvedUnresolvedText.setAttribute(
                "style",
                "color:orange;margin-left:30px"
            );
        } else {
            resolvedUnresolvedText.setAttribute(
                "style",
                "color:green;margin-left:30px"
            );
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
        whole.appendChild(button);
        return whole;
    }
}

var reports = [];
var selected = [];

// Select multiple reports
function selectReports() {
    if (reports.length == 0) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                reportIDsArray = JSON.parse(request.response);
                // Gotten array of IDs.
                Array.from(reportIDsArray).forEach(function(reportID) {
                    reports.push(reportID["reportID"]);
                    if (All.checked == true) {
                        document.getElementById(
                            reportID["reportID"]
                        ).checked = true;
                        selected.push(reportID["reportID"]);
                    } else {
                        if (
                            document.getElementById(reportID["reportID"])
                                .checked == true
                        ) {
                            selected.push(reportID["reportID"]);
                        }
                    }
                });
            }
        };
        request.open(
            "POST",
            "https://cruzsafe.appspot.com/api/reports/reportIDs"
        );
        request.send();
    } else {
        Array.from(reports).forEach(function(report) {
            if (document.getElementById(report).checked == true) {
                if (selected.indexOf(report) == -1) {
                    selected.push(report);
                }
            }
        });
    }
    if (selected.length > 0) {
        Array.from(selected).forEach(function(report) {
            if (document.getElementById(report).checked == false) {
                var index = selected.indexOf(report);
                selected.splice(index, 1);
            }
        });
    }
    if (inc.style.display !== "block" && selected.length == 0) {
        inc.style.display = "block";
        sub.style.display = "block";
        inc_t.style.display = "none";
        date_t.style.display = "none";
    } else if (
        inc.style.display !== "none" &&
        selected.length == 0 &&
        All.checked != true
    ) {
        inc_t.style.display = "block";
        date_t.style.display = "block";
        sub.style.display = "none";
        inc.style.display = "none";
    } else {
        sub.style.display = "block";
        inc.style.display = "block";
        inc_t.style.display = "none";
        date_t.style.display = "none";
    }
}

// Select all reports
function selectAll() {
    if (All.checked == true) {
        inc.style.display = "block";
        sub.style.display = "block";
        inc_t.style.display = "none";
        date_t.style.display = "none";
        if (reports.length == 0) {
            selectReports();
        } else {
            Array.from(reports).forEach(function(report) {
                document.getElementById(report).checked = true;
                selected.push(report);
            });
        }
    } else {
        inc_t.style.display = "block";
        date_t.style.display = "block";
        sub.style.display = "none";
        inc.style.display = "none";
        if (reports.length !== 0) {
            Array.from(reports).forEach(function(report) {
                document.getElementById(report).checked = false;
                selected = [];
            });
        }
    }
}

//
function incChange() {
    inc_t.style.display = "block";
    date_t.style.display = "block";
    sub.style.display = "none";
    inc.style.display = "none";
    Array.from(selected).forEach(function(report) {
        document.getElementById(report).checked = false;
    });
    All.checked = false;
    var new_inc = inc.value;
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/updateInc");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ reports: selected, inc: new_inc }));
    selected = [];
    setupListReports();
}
