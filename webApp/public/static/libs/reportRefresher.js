/*
    Code meant specifically for reports.html. Allows for the refreshing of the page on a timed basis. 
*/

/*
    Function that request the latest TS from database and does something with that information depending on pageID.
    Also takes in a firstRun; if not the first time running it, and we get somethign that's different, change.

    hiddenID - where the latestTS is being stored
    firstRun - 0 = no, 1 = yes.
*/
function getLatestTS(hiddenID, firstRun) {
    // TODO- whenever a report is CHANGED (i.e. complete vs incomplete, etc.), refresh.
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(request.response);
            var maxTS = response[0]["MAX(reportTS)"];
            var storedTS = document.getElementById(hiddenID);
            var previouslyStored = storedTS.value;
            storedTS.value = maxTS;
            if (!firstRun) {
                if (previouslyStored != maxTS) {
                    // Determined that there's a new report with a new maxTS.
                    getReportByTS(maxTS);
                    // Intake or Reports
                    if ((pageID == 1) | (pageID == 2)) {
                        determineListSetup();
                    }
                    // Homepage
                    else if (pageID == 0) {
                        renderReportsOverview(); // Refresh the map TODO - DO NOT REFRESH ENTIRE PAGE; ONLY REFRESH NECESSARY COMPONENTS
                        MainMap();
                    }
                }
            }
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/latestTS");
    request.send();
}

/*
    Function that requests a report based on timestamp.

    Once that has been gotten, does something with that reportID. (?)
    Plays a sound based on ID.
*/
function getReportByTS(reportTS) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            report = JSON.parse(request.response);
            // Gotten report. Now do something.
            // console.log("Fresh ReportID = " + report[0]["reportID"]);
            playSound(report[0]["tag"]);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/reportTS");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ reportTS: reportTS }));
}

/*
    calls setupListReports and applies filters if applicable.
*/
function determineListSetup() {
    const filterElements = [
        "filterTag",
        "filterIncidentID",
        "filterDate",
        "filterTime",
        "filterStatus",
        "filterBody",
        "filterLocation",
        "filterCoordinates",
        "filterUnchangedLocation",
        "filterAttachments",
        "filterMobileID",
        "filterFirstName",
        "filterLastName",
        "filterEmail",
        "filterPhone",
        "filterExpire"
    ];
    var filtersSet = false;
    for (var i = 0; i < filterElements.length; i++) {
        if (document.getElementById(filterElements[i]).value != (null | "")) {
            filtersSet = true;
            break;
        }
    }
    // Will prevent auto-refresh of list when user is attempting to search for something
    if (!filtersSet && currentTab == 0) {
        clearPages("reportList");
        setupListReports();
    }
}

/*
    Function that plays a sound given a tagID.
*/
function playSound(tag) {
    var audio = document.getElementById("incomingTag" + tag);
    console.log("Playing audio from " + audio.id);
    audio.play();
}
