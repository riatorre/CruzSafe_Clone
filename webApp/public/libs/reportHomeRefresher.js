/*
    Code meant specifically for homepage.html. Allows for the refreshing of the page on a timed basis. 
    Modified version of reportListRefresher.js
*/

/*
    Function that request the latest TS from database and sets that as latestTS hidden input in page.
    Also takes in a firstRun; if 1, create a listener. else, don't.
*/
function getTS(document, hiddenID, firstRun) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            response = JSON.parse(request.response);
            //console.log("getTS responded: " + JSON.stringify(response));
            var maxTS = response[0]["MAX(reportTS)"];
            //console.log("getTS got maxTS of: " + maxTS);
            var storedTS = document.getElementById(hiddenID);
            var previouslyStored = storedTS.value;
            storedTS.value = maxTS;
            if (!firstRun) {
                if (previouslyStored != maxTS) {
                    getReportByTS(document, maxTS, 1);
                }
            } else {
                getReportByTS(document, maxTS, 0);
            }
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/latestTS");
    request.send();
}

/*
    Function that requests a report based on timestamp. 
*/
function getReportByTS(document, reportTS, sound, isIntake) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            report = JSON.parse(request.response);
            // Gotten report. Now do something.
            //console.log("Fresh ReportID = " + report[0]["reportID"]);
            if (sound) {
                playSound(document, report[0]["tag"]);
            }
            displayID(document, report[0]["reportID"], isIntake);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/reportTS");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ reportTS: reportTS }));
}
/*
    Function that plays a sound given a tagID.
*/
function playSound(document, tag) {
    var audio = document.getElementById("incomingTag" + tag);
    //console.log("Playing audio from " + audio.id);
    audio.play();
}

/*
    Function that does something given an ID
*/
function displayID(document, reportID, isIntake) {
    document
        .getElementById("latestReport")
        .setAttribute(
            "onClick",
            "displayReport(" + reportID + "," + isIntake + ")"
        );
}
