/*
    Standardized code across reports.html and homepage.html (and potentially more.)
    Is paired stand-alone with the Report Modal portion in both html and css files. 
*/

// Array of dictionary entries + tag ids.
const reportFields = [
    "reportID",
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
    "body",
    "expireTS"
];
const aPIKey = "AIzaSyDi4bKzq04VojQXEGXec4wDsdRVZhht5vY";
// WebID (In the future, will be replaced by actual webID from Shibboleth!)
const webID = 1;
const imageTypes = ["png", "jpg", "jpeg", "gif"];

const defaultOption = document.createElement("option");
defaultOption.setAttribute("value", "");
defaultOption.innerHTML = "---Select Option---";

// Function used to create a Modal ready to display Single Report Data
function createReportModal() {
    var div = document.createElement("DIV");
    div.setAttribute("class", "column");

    var metadataRow = document.createElement("DIV");
    metadataRow.setAttribute("class", "row quarter");

    var metadataFirstHalf = document.createElement("DIV");
    metadataFirstHalf.setAttribute("class", "column twoFifths leaf");
    metadataFirstHalf.innerHTML =
        "<div class = 'name'><div><b>Name:</b> <span id='fullName' placeholder='FullName'></span> - #<span id='mobileID'></span></div></div>";
    metadataFirstHalf.innerHTML +=
        "<div class = 'phone'><div><b>Phone:</b> <span id='phone'></span></div></div>";
    metadataFirstHalf.innerHTML +=
        "<div class = 'email'><div><b>Email:</b> <span id='email'></span></div></div>";
    metadataRow.appendChild(metadataFirstHalf);

    var metadataSecondHalf = document.createElement("DIV");
    metadataSecondHalf.setAttribute(
        "class",
        "column threeFifths borderedLeft leaf"
    );
    metadataSecondHalf.innerHTML =
        "<div><b>Report:</b> #<span id = 'reportID'></span>, <b>Incident:</b> #<span id = 'incidentID'></span> <b id='resolvedUnresolved'></b></div>\n";
    metadataSecondHalf.innerHTML +=
        "<div><b>Date:</b> <span id='reportTS'></span></div>\n";
    metadataSecondHalf.innerHTML +=
        "<div><b>Time:</b> <span id='reportTS2'></span></div>\n";
    metadataSecondHalf.innerHTML +=
        "<div><b>Location:</b> <span id='location'></span> <span id='actualPinned'></span></div>\n";
    metadataSecondHalf.innerHTML +=
        "<div><b>Tag:</b> <span id='tag'></span></div>\n";
    metadataRow.appendChild(metadataSecondHalf);

    div.appendChild(metadataRow);

    var dataRow = document.createElement("DIV");
    dataRow.setAttribute("class", "row threeQuarters");

    var columnOne = document.createElement("DIV");
    columnOne.setAttribute("class", "column twoFifths");

    var row = document.createElement("DIV");
    row.setAttribute("class", "row");

    row.innerHTML =
        "<iframe id='reportMap' class='column half leaf leftAlign'></iframe>";
    row.innerHTML +=
        "<div class='column half leaf'><img id='reportPhoto' class='imgcontainer' alt='report photo' />";
    row.innerHTML +=
        "<video width = '320' height = '240' controls = 'controls' id='reportVideo' alt='report video' type = 'video/mp4'> </video></div>";
    columnOne.appendChild(row);
    dataRow.appendChild(columnOne);

    var columnTwo = document.createElement("DIV");
    columnTwo.setAttribute("class", "column threeFifths borderedLeft");

    var reportBody = document.createElement("DIV");
    reportBody.setAttribute("class", "row fifth leaf leftAlign");
    reportBody.innerHTML = "<b>Report Body:</b>";
    reportBody.innerHTML += "<br /><br />";
    reportBody.innerHTML += "<div id = 'body'></div>";
    columnTwo.appendChild(reportBody);

    var reportNotes = document.createElement("DIV");
    reportNotes.setAttribute("class", "row leaf leftAlign");
    reportNotes.setAttribute("style", "height:42.5%");
    reportNotes.innerHTML = "<b>Notes:</b>";
    reportNotes.innerHTML +=
        "<div id = 'reportNotes' class='reportNotes'></div>";
    reportNotes.innerHTML +=
        "<div style=''><input id = 'reportNoteInput' placeholder = 'Add Notes...'></input><a id = 'submitNote' class='btn small rounded navy Respondbtn'>Submit</a></div>";
    columnTwo.appendChild(reportNotes);

    var optionBtns = document.createElement("DIV");
    optionBtns.setAttribute("class", "row quarter leaf leftAlign");
    optionBtns.innerHTML =
        "<span class='dropdown'><select id='messageDropdown' autocomplete='off'></select><a id='respondBtn' class='btn rounded navy'>Respond</a></span>";
    optionBtns.innerHTML +=
        "<span class='dropdown'><select id='forwardDropdown' autocomplete='off'><option value='forwardTaps'>Assign report to designated TAPS Supervisor</option><option value='forwardTaps'>Assign report to designated ITS Supervisor</option><option value='forwardTaps'>Assign report to designated CHAS Supervisor</option></select><a class='btn rounded navy'>Assign Report</a></span>";
    optionBtns.innerHTML +=
        "<a class='btn rounded green' id='reportResolve'></a>";
    columnTwo.appendChild(optionBtns);

    var expirationDiv = document.createElement("DIV");
    expirationDiv.setAttribute("class", "row eighth leaf leftAlign");
    expirationDiv.innerHTML =
        "<div><b>Expiration Date:</b> <span id='expireTS'></span></div>";
    expirationDiv.innerHTML +=
        "<span class='dropdown'><select id='whitelistDropdown' autocomplete = 'off'><option value='1'>Expire in 1(?) days from submission date</option><option value='3'>Expire in 3(?) days from submission date</option><option value='90'>Expire in 90 days from submission date</option><option value='180'>Expire in 180 days from submission date</option><option value='730'>Expire in 2 years from submission date</option></select><a id = 'whitelistBtn' class='btn rounded navy'>Whitelist Report (Supervisor/Admin Only!)</a></span>";
    columnTwo.appendChild(expirationDiv);

    dataRow.appendChild(columnTwo);
    div.append(dataRow);

    return div;
}

/*
    generateSingleReport: takes in a specific reportID and the document itself. 
    Assuming the report modal is in the document, makes two requests to the APIs. 

    First request is for tags. Passes it to helper function.
*/
function generateSingleReport(reportID, isIntake) {
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
                tagColors[tag["tagName"]] = tag["color"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            generateSingleReportHelper(reportID, tagDict, tagColors, isIntake);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
/*
    Helper function that grabs all the information from the report.
*/
function generateSingleReportHelper(reportID, tags, tagColors, isIntake) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reportInfo = JSON.parse(request.response)[0]; // Returns an array containing a single row as an object
            populateReport(reportID, tags, tagColors, reportInfo, isIntake); // Call populateReport
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/reportID");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ id: reportID }));
}

/*
    Populates the report modal. Takes in reportID, list of tags, list of tag colors, and
    reportInfo; the dictionary that contains all of the report's information. 
*/
function populateReport(reportID, tags, tagColors, reportInfo, isIntake) {
    var productInfo = generateProductInfo(reportInfo, tags); // Generate ProductInfo
    // Fills in the modal with productInfo
    for (i = 0; i < reportFields.length; i++) {
        // For all entries in reportFields
        const field = reportFields[i];
        //console.log(field);
        const targetTag = document.getElementById(field);
        targetTag.innerHTML = productInfo[field];
    }

    // Edit the color of the tag
    tag.setAttribute("style", "color:" + tagColors[productInfo["tag"]]);

    // Edit the color of resolvedUnresolved
    if (productInfo["resolvedUnresolved"].includes("New")) {
        // For resolvedUnresolved, gets status. If resolved, green. else, red.
        document.getElementById("resolvedUnresolved").style.color = "red";
    } else if (productInfo["resolvedUnresolved"].includes("Incomplete")) {
        document.getElementById("resolvedUnresolved").style.color = "orange";
    } else {
        document.getElementById("resolvedUnresolved").style.color =
            "yellowgreen";
    }

    // Edit the complete/incomplete button + close buttons
    var resolvedButton = document.getElementById("reportResolve");
    if (!!reportInfo["completeTS"]) {
        // Completed Report Actions:
        document
            .getElementById("close")
            .setAttribute("onclick", "hideReport(0)"); // Modify close button - standard
        // INCOMPLETE button
        resolvedButton.setAttribute(
            "onclick",
            "markIncomplete(" + reportID + ", " + webID + ")"
        );
        resolvedButton.innerHTML = "Mark Incomplete";
    } else {
        // Incomplete Report Actions:

        // COMPLETE button
        resolvedButton.setAttribute(
            "onclick",
            "markComplete(" + reportID + "," + webID + "," + isIntake +")"
        );
        resolvedButton.innerHTML = "Mark Complete";

        if (!!reportInfo["initialOpenTS"]) {
            // Was opened before.
            insertNote(reportID, webID, "{Viewed report}"); // Note: viewing of report
            document
                .getElementById("close")
                .setAttribute("onclick", "hideReport(0)"); // Modify close button - standard
        } else {
            // If it is a new, then it is now incomplete! Set the data in the database. Apply web ID.
            insertTS(1, reportID, webID);
        }
    }
    // Edit Location
    const map = document.getElementById("reportMap");
    map.setAttribute(
        "src",
        "https://www.google.com/maps/embed/v1/place?q=" +
            reportInfo["latitude"] +
            "," +
            reportInfo["longitude"] +
            "&key=" +
            aPIKey
    );
    // Edit photo/video
    const photo = document.getElementById("reportPhoto");
    const video = document.getElementById("reportVideo");
    if (reportInfo["attachments"]) {
        const filename = reportInfo["filename"];
        const extension = filename.split(".").pop(); // Split by dots.
        if (imageTypes.includes(extension)) {
            video.removeAttribute("src");
            video.style.display = "none";
            photo.setAttribute(
                "src",
                "https://storage.googleapis.com/cruzsafe.appspot.com/" +
                    reportInfo["filename"]
            );
            photo.style.display = "block";
        } else {
            photo.removeAttribute("src");
            photo.style.display = "none";
            video.setAttribute(
                "src",
                "https://storage.googleapis.com/cruzsafe.appspot.com/" +
                    reportInfo["filename"]
            );
            video.style.display = "block";
        }
    } else {
        video.style.display = "none";
        photo.style.display = "none";
    }
    // Edit the prewritten responses + button
    displayPrewrittenResponses(reportInfo["tag"]);
    document
        .getElementById("respondBtn")
        .setAttribute(
            "onClick",
            "initializeMessage(" + reportID + "," + webID + ")"
        );
    // Edit the whitelist options + button
    document
        .getElementById("whitelistBtn")
        .setAttribute("onClick", "initializeWhitelist(" + reportID + ")");
    displayNotes(reportID);
    // Edit submit note button
    const submitNote = document.getElementById("submitNote");
    submitNote.setAttribute("onclick", "submitNote(" + reportID + ")");

    openModal();
}

/*
    Generates productInfo from given reportInfo
*/
function generateProductInfo(reportInfo, tags) {
    var productInfo = [];
    productInfo["reportID"] = reportInfo["reportID"];
    // incidentID
    productInfo["incidentID"] = reportInfo["incidentID"];
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
    productInfo["tag"] = tags[reportInfo["tag"]];
    // fullName
    fullName = reportInfo["lastName"] + ", " + reportInfo["firstName"];
    productInfo["fullName"] = fullName;
    // mobileID
    productInfo["mobileID"] = reportInfo["mobileID"];
    // phone
    productInfo["phone"] = reportInfo["phone"];
    // email
    productInfo["email"] = reportInfo["email"];
    // body
    productInfo["body"] = reportInfo["body"];
    // expireTS
    productInfo["expireTS"] = formatDate(reportInfo["expireTS"], {
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false
    });
    // resolved/unresolved
    if (!!reportInfo["completeTS"]) {
        var resolvedUnresolved = "[Complete]"; // Completed; not null
    } else {
        var resolvedUnresolved = "[Incomplete]"; // no complete TS but a inital open TS
    }
    productInfo["resolvedUnresolved"] = resolvedUnresolved;

    return productInfo;
}

/*
    Starts modifyExpireSingle after grabbing whitelist Option.
    whiteList button has been pressed.
*/
function initializeWhitelist(reportID) {
    var whitelistDropdownObj = document.getElementById("whitelistDropdown");
    const whitelistDays =
        whitelistDropdownObj.options[whitelistDropdownObj.selectedIndex].value;
    insertNote(
        reportID,
        webID,
        "{[ADMIN] - Expiration date changed to " +
            whitelistDays +
            " days after submission}"
    );
    modifyExpireSingle(whitelistDays, reportID);
}

/*
    Starts sendMessage after grabbing messageList Option.
    Send message has been pressed.
*/
function initializeMessage(reportID, webID) {
    var messageDropdownObj = document.getElementById("messageDropdown");
    const message =
        messageDropdownObj.options[messageDropdownObj.selectedIndex].value;
    insertNote(reportID, webID, "{Sent pre-written response: " + message + "}"); // Adds note that a response has been sent.
    sendMessage(reportID, webID, message);
}

/*
 * Calls an API that inserts a timestamp into either comletedTS or initialOpenTS
 * Whenever the timestamp is modified, add an event in notes.
 */
function insertTS(initialOpenTS, reportID, webID) {
    // Code that adds a note for initial Open.
    if (initialOpenTS) {
        insertNote(reportID, webID, "{Report initially opened}");
    } else {
        insertNote(reportID, webID, "{Report marked as complete}"); // Code that adds a note for Complete.
        const request_token = new XMLHttpRequest();
        request_token.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var token = JSON.parse(request_token.response)[0].token;
                const request_ntf = new XMLHttpRequest("no-cors");
                request_ntf.open(
                    "POST",
                    "https://exp.host/--/api/v2/push/send"
                );
                request_ntf.setRequestHeader(
                    "Content-Type",
                    "application/json"
                );
                request_ntf.send(
                    JSON.stringify({
                        to: token,
                        title: "You have a new message",
                        body: "Your report is completed",
                        sound: "default",
                        priority: "high"
                    })
                );
            }
        };
        request_token.open(
            "POST",
            "https://cruzsafe.appspot.com/api/reports/getToken"
        );
        request_token.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
        );
        request_token.send(
            JSON.stringify({
                reportID: reportID
            })
        );
    }
    const request = new XMLHttpRequest();
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/timestamp");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
        JSON.stringify({
            initialOpenTS: initialOpenTS,
            reportID: reportID,
            webID: webID
        })
    );
    const closeReport = document.getElementById("close");
    closeReport.setAttribute("onclick", "hideReport(1)");
}

/*
    Removes a TS and WebID from completedTS.
*/
function removeTS(reportID, webID) {
    insertNote(reportID, webID, "{Report revised as incomplete}");

    const request = new XMLHttpRequest();
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/removeTimestamp"
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
        JSON.stringify({
            reportID: reportID
        })
    );
    const closeReport = document.getElementById("close");
    closeReport.setAttribute("onclick", "hideReport(1)");
}

/*
 * Function that takes in a tagID and populates the message dropdown div.
 */
function displayPrewrittenResponses(tagID) {
    // Clear the message dropdown.
    var messageDropdown = document.getElementById("messageDropdown");
    while (messageDropdown.firstChild) {
        messageDropdown.removeChild(messageDropdown.firstChild);
    }
    messageDropdown.appendChild(defaultOption);

    // Query the database for the responses.
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            prewrittenResponses = JSON.parse(request.response);
            Array.from(prewrittenResponses).forEach(function(response) {
                var newOption = document.createElement("option"); // For each response, add to message dropdown.
                const responseContent = response["content"];
                var text = document.createTextNode(responseContent);
                newOption.appendChild(text);
                newOption.setAttribute("value", responseContent); // For each message, add sendMessage with given text.
                messageDropdown.appendChild(newOption);
            });
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/prewrittenResponses"
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ tagID: tagID }));
}

/*
 * Sends a message via the API.
 */
function sendMessage(reportID, webID, message) {
    if (message != "") {
        const request = new XMLHttpRequest();
        request.open(
            "POST",
            "https://cruzsafe.appspot.com/api/messages/submitMessage"
        );
        request.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
        );
        request.send(
            JSON.stringify({
                reportID: reportID,
                webID: webID,
                messageText: message
            })
        );
        const request_token = new XMLHttpRequest();
        request_token.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var token = JSON.parse(request_token.response)[0].token;
                const request_ntf = new XMLHttpRequest("no-cors");
                request_ntf.open(
                    "POST",
                    "https://exp.host/--/api/v2/push/send"
                );
                request_ntf.setRequestHeader(
                    "Content-Type",
                    "application/json"
                );
                request_ntf.send(
                    JSON.stringify({
                        to: token,
                        title: "You have a new message",
                        body: message,
                        sound: "default",
                        priority: "high"
                    })
                );
            }
        };
        request_token.open(
            "POST",
            "https://cruzsafe.appspot.com/api/reports/getToken"
        );
        request_token.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
        );
        request_token.send(
            JSON.stringify({
                reportID: reportID
            })
        );
    }
}

/*
 * Clears and initializes notes. Displays them, if the modal is being shown.
 */
function displayNotes(reportID) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            notes = JSON.parse(request.response);
            var notesArray = [];
            Array.from(notes).forEach(function(note) {
                noteString = "";
                formattedNoteDate = formatDate(note["ts"], {
                    hour: "numeric",
                    minute: "numeric",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour12: false
                });
                noteString =
                    noteString +
                    "[" +
                    formattedNoteDate +
                    "] " +
                    note["firstName"] +
                    " " +
                    note["lastName"] +
                    " - " +
                    note["content"];
                notesArray.push(noteString);
            });
            // Edit notes
            var notesDiv = document.getElementById("reportNotes");
            // Remove notes
            while (notesDiv.firstChild) {
                notesDiv.removeChild(notesDiv.firstChild);
            }
            //Add new notes
            for (i = 0; i < notesArray.length; i++) {
                var noteDiv = document.createElement("DIV");
                var newNote = document.createElement("SPAN");
                newNote.innerHTML = notesArray[i] + "<br>";
                noteDiv.appendChild(newNote);
                notesDiv.appendChild(noteDiv);
            }
            notesDiv.scrollTop = notesDiv.scrollHeight;
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/notes");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ reportID: reportID }));
}

/*
 * Inserts note gotten from reportNoteInput.value into database and re-initializes notes.
 */
function submitNote(reportID) {
    // Submit notes into database
    var reportNoteInput = document.getElementById("reportNoteInput");
    // Insert note into database
    insertNote(reportID, webID, reportNoteInput.value);
    reportNoteInput.value = ""; // Clear the input.
}

/*
 * Calls an API that inserts a new note given a reportID, webID, and content. 
 Once done, refreshes the notes page by regathering displayNotes and displaying them.
 */
function insertNote(reportID, webID, content) {
    if (content != "") {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            displayNotes(reportID);
        };
        request.open(
            "POST",
            "https://cruzsafe.appspot.com/api/reports/newNote"
        );
        request.setRequestHeader(
            "Content-Type",
            "application/json;charset=UTF-8"
        );
        request.send(
            JSON.stringify({
                content: content,
                reportID: reportID,
                webID: webID
            })
        );
    }
}

/*
    Helper function that converts a JS date into readable format (styling).
    Options are set to include hours,
    Returns a string.
*/
function formatDate(mySQLDate, options) {
    var jsDate = toDateFormat(mySQLDate);
    return jsDate.toLocaleString("en-US", options);
}

/*
    The following is imported code to convert MySQL TS to JS date.
*/
function toDateFormat(mySQLDate) {
    return convertUTCDateToLocalDate(
        new Date(mySQLDate.substr(0, 10) + "T" + mySQLDate.substr(11, 8))
    );
}

function convertUTCDateToLocalDate(date) {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )
    );
}

function markIncomplete(reportID, webID) {
    removeTS(reportID, webID);
    const resolvedUnresolved = document.getElementById("resolvedUnresolved");
    resolvedUnresolved.innerHTML = "[Incomplete]";
    resolvedUnresolved.style.color = "orange";
    var resolvedButton = document.getElementById("reportResolve");
    resolvedButton.setAttribute(
        "onclick",
        "markComplete(" + reportID + "," + webID + ")"
    ); // Add onclick function to button
    resolvedButton.innerHTML = "Mark Complete";
}

function markComplete(isIntake, reportID, webID) {
    insertTS(0, reportID, webID);
    hideReport(1,isIntake); // Close the modal
}

// A report has been selected!
function displayReport(id, isIntake) {
    generateSingleReport(id,isIntake); // Intializes report display
}

// Hides the report and refreshes the page if necessary (changes = 1 vs 0)
function hideReport(changes,isIntake) {
    closeModal();
    reportNoteInput.value = ""; // Clear the input of notes.
    if (changes) {
        clearPages();
        setupReports(isIntake);
    }
}
