/*
 * Administrative commands used only by admin.html.
 */

/*
 * modifyExpire takes in a count of how many DAYS are to be alotted until deletion of a report.
 */
function modifyExpire(numDays) {
    newExpireTS = new Date();
    newExpireTS.setDate(expireTS + numDays);
}

/*
 * Function that gets a list of reportIDS whose ts is GREATER than given.
 */
function generateSingleReportHelperNotes(newExpireTS) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            notes = JSON.parse(request.response);
            // Once they ahve been found, delete only the important bits.
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/notes");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ reportID: reportID }));
}

/*
 * Function that gets a list of reportIDS whose ts is LESS that given.
 */
function generateSingleReportHelperNotes(newExpireTS) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            notes = JSON.parse(request.response);
            // Once they ahve been found, set their TSs as the newExpireTS.
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/notes");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ reportID: reportID }));
}
