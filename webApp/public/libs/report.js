/*
    Standardized code to display all details of a given report number and 
    of the mobile user who sent it in.
*/

/*
    Grabs data from both reports and mobileUsers tables from the database. 
    Formats all data appropriately and returns shippable string array.
    Takes in a reportID and returns an array indexed as follows:
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
function generateSingleReport(reportID) {
    return {
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
    };
}

/*
    Input: array of reportIDs and indexes to go from. 
    Output: an array of dictionaries of all specified reports. 
*/
function generateMultipleReports(reportIDs, start, end) {
    var outputReports = [];

    // Query the database for all info needed for all reports.

    var query =
        "SELECT * " +
        "FROM reports LEFT JOIN mobileUsers ON reports.mobileID = mobileUsers.mobileID" +
        "WHERE reportID = ";
    for (i = start; i <= end; i++) {
        var reportID = reportIDs[i]; // reportID variable.
        if (i == start) {
            // Beginning of loop; given 'reportID = ' prefix.
            query.push(reportID);
        } else {
            query.push(" OR reportID = " + reportID);
        }
    }
    return outputReports;
}

/*
    Returns an array of ALL reportIDs in the database.
*/
function getReportIDs() {
    reportIDs = [];
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reportIDs = request.responseText;
        }
    };
    console.log(reportIDs);
    request.open("GET", "https://cruzsafe.appspot.com/api/reports/reportIDs");
    request.send();
}
