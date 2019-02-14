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
            tags.forEach(function(tag) {
                tagDict[tag["tagID"]] = tag["tagName"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            generateSingleReportHelper(reportID, document, tagDict);
        }
    };
    request.open("GET", "https://cruzsafe.appspot.com/api/reports/tags");
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
                var resolvedUnresolved = "[Resolved]"; // Not null
            } else {
                var resolvedUnresolved = "[Unresolved]"; // Null
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
            if (productInfo["resolvedUnresolved"].includes("Unresolved")) {
                // For resolvedUnresolved, gets status. If resolved, green. else, red.
                document.getElementById("resolvedUnresolved").style.color =
                    "red";
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
    request.open(
        "GET",
        "https://cruzsafe.appspot.com/api/reports/reportID=" + reportID
    );
    request.send();
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
            tags.forEach(function(tag) {
                tagDict[tag["tagID"]] = tag["tagName"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            gatherReportPage(document, tagDict);
        }
    };
    request.open("GET", "https://cruzsafe.appspot.com/api/reports/tags");
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
            reportIDsArray.forEach(function(reportID) {
                reportIDs.push(reportID["reportID"]);
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            generateMultipleReports(reportIDs, 0, 0, document, tags);
        }
    };
    request.open("GET", "https://cruzsafe.appspot.com/api/reports/reportIDs");
    request.send();
}
function generateMultipleReports(reportIDs, start, end, document, tags) {
    // TODO: Implement a single-query implementation so you don't query the database for ALL reports.
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reportInfo = JSON.parse(request.response); // Returns an array
            var allInfo = [];

            reportInfo.forEach(function(report) {
                var productInfo = [];
                productInfo["reportID"] = report["reportID"];
                // incidentID
                productInfo["incidentID"] = report["incidentID"];
                // resolved/unresolved
                if (!!report["completeTS"]) {
                    var resolvedUnresolved = "[R]"; // Not null
                } else {
                    var resolvedUnresolved = "[UR]"; // Null
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
            allInfo.forEach(function(report) {
                var button = document.createElement("BUTTON");
                button.setAttribute("id", "launchReport");
                button.setAttribute(
                    "onclick",
                    "displayReport(" + report["reportID"] + ")"
                );
                var buttonText = document.createTextNode(
                    report["resolvedUnresolved"] +
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
                document.getElementById("reportList").appendChild(button);
            });
        }
    };
    request.open("GET", "https://cruzsafe.appspot.com/api/reports/");
    request.send();
}
