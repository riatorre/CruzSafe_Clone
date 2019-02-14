/*
    Standardized code to display all details of a given report number and 
    of the mobile user who sent it in.
*/

const local = true; // DEBUGGING VARIABLE: Local vs cloud
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
    Grabs data from both reports and mobileUsers tables from the database. 
    Formats all data appropriately and returns shippable string array.
    Takes in a reportID as well as the document itself
    NOTICE: Assumes document has a modal structured in standard manner.
    
    Returns an array indexed as follows:
    {
        0 incidentID, 
        1 resolved/unresolved, 
        2 reportTS, 
        3 location, 
        4 actual/pinned, 
        5 tag, 
        6 fullName, 
        7 mobileID, 
        8 phone, 
        9 email, 
        10 body
    }
*/
function generateSingleReport(reportID, document) {
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
            productInfo["tag"] = reportInfo["tag"];
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
    /*{
        incidentID: "1913198", // incidentID
        resolvedUnresolved: "[Unresolved]", // resolved/unresolved
        reportTS: "20:23:12 - 2/7/19", // reportTS
        location: "McHenry Library", // location
        actualPinned: "(Actual)", // actual/pinned
        tag: "Broken Infrastructure", // tag
        fullName: "Arthurlot Li", // fullName
        mobileID: "013405", // mobileID
        phone: "858 231 3906", //phone
        email: "ali64@ucsc.edu", // email
        body:
            "I was on my way back home when I heard a funny sound coming from around the corner near McHenry. When I went to investigate, I found a pipe on the outside of hte concrete wall on the ground floor that was leaking quite rapidly. I didn't have anything on me at the moment to plug the leak, and it was late so there was nobody around, so make sure you guys send someone over there to patch it ASAP! This is my first time using this app, so I hope it gets through to you all. Fingers crossed!" // body
    };*/
}

/*
    Input: array of reportIDs and indexes to go from and document. 
    Once data has been retrieved, generates list of buttons to populate the div in document. 
*/
function generateMultipleReports(reportIDs, start, end, document) {
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
                    var resolvedUnresolved = "[Resolved]"; // Not null
                } else {
                    var resolvedUnresolved = "[Unresolved]"; // Null
                }
                productInfo["resolvedUnresolved"] = resolvedUnresolved;
                // reportTS
                productInfo["reportTS"] = report["reportTS"];
                // location
                productInfo["location"] = report["location"];
                // actual/pinned
                if (report["unchangedLocation"]) {
                    var actualPinned = "(Actual)";
                } else {
                    var actualPinned = "(Pinned)";
                }
                productInfo["actualPinned"] = actualPinned;
                // tag
                productInfo["tag"] = report["tag"];
                // fullName
                fullName = report["lastName"] + " " + report["firstName"];
                productInfo["fullName"] = fullName;
                // mobileID
                productInfo["mobileID"] = report["mobileID"];
                // phone
                productInfo["phone"] = report["phone"];
                // email
                productInfo["email"] = report["email"];
                // body
                productInfo["body"] = report["body"];

                // All data has now been added into reportData
                allInfo.push(productInfo);
            });

            console.log(allInfo);
            // All info for all reports have been read and formatted. Create buttons.
            allInfo.forEach(function(report) {
                var button = document.createElement("BUTTON");
                button.setAttribute("id", "launchReport");
                button.setAttribute(
                    "onclick",
                    "displayReport(" + report["reportID"] + ")"
                );
                var buttonText = document.createTextNode(
                    report["incidentID"] +
                        " | " +
                        report["TS"] +
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

/*
    Returns an array of ALL reportIDs in the database.
*/
function getReportIDs(document) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reportIDsArray = JSON.parse(request.response);
            // Gotten array of IDs.
            reportIDs = [];
            for (reportID in reportIDsArray) {
                reportIDs.push(reportID["reportID"]);
            }
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            generateMultipleReports(reportIDs, 0, 0, document);
        }
    };
    request.open("GET", "https://cruzsafe.appspot.com/api/reports/reportIDs");
    request.send();
}
