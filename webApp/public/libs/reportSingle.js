/*
    Standardized code across reports.html and homepage.html (and potentially more.)
    Is paired stand-alone with the Report Modal portion in both html and css files. 
*/

// Array of dictionary entries + tag ids.
const reportFields = [
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
            Array.from(tags).forEach(function(tag) {
                tagDict[tag["tagID"]] = tag["tagName"];
            });
            tagColors = {};
            Array.from(tags).forEach(function(tag) {
                tagColors[tag["tagName"]] = tag["color"];
            });
            // gotten list of all IDs. Calls generateMultipleReports for given index.
            generateSingleReportHelper(reportID, document, tagDict, tagColors);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
function generateSingleReportHelper(reportID, document, tags, tagColors) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var productInfo = [];
            reportInfo = JSON.parse(request.response)[0]; // Returns an array containing a single row as an object

            // incidentID
            productInfo["incidentID"] = reportInfo["incidentID"];
            // resolved/unresolved
            var resolvedButton = document.getElementById("reportResolve");
            if (!!reportInfo["completeTS"]) {
                var resolvedUnresolved = "[Complete]"; // Completed; not null
                document
                    .getElementById("closeReport")
                    .setAttribute("onclick", "hideReport(0)");
                // If it's completed, provide the option to re-open.
                resolvedButton.setAttribute(
                    "onclick",
                    "markIncomplete(" + reportID + ", " + webID + ")"
                ); // Add onclick function to button
                resolvedButton.innerHTML = "Mark Incomplete";
            } else {
                resolvedButton.setAttribute(
                    "onclick",
                    "markComplete(" + reportID + "," + webID + ")"
                ); // Add onclick function to button
                resolvedButton.innerHTML = "Mark Complete";
                if (!!reportInfo["initialOpenTS"]) {
                    var resolvedUnresolved = "[Incomplete]"; // no complete TS but a inital open TS
                    document
                        .getElementById("closeReport")
                        .setAttribute("onclick", "hideReport(0)");
                } else {
                    // If it is a new, then it is now incomplete! Set the data in the database. Apply web ID.
                    insertTS(1, reportID, webID);
                    var resolvedUnresolved = "[Incomplete]"; // Null
                }
            }
            productInfo["resolvedUnresolved"] = resolvedUnresolved;
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
            tagValue = reportInfo["tag"];
            productInfo["tag"] = tags[tagValue];
            displayPrewrittenResponses(reportID, webID, tagValue);
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
            // expireTS
            productInfo["expireTS"] = formatDate(reportInfo["expireTS"], {
                hour: "numeric",
                minute: "numeric",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour12: false
            });

            // All data has now been added into reportData
            const modal = document.getElementById("report");

            if (productInfo["resolvedUnresolved"].includes("New")) {
                // For resolvedUnresolved, gets status. If resolved, green. else, red.
                document.getElementById("resolvedUnresolved").style.color =
                    "red";
            } else if (
                productInfo["resolvedUnresolved"].includes("Incomplete")
            ) {
                document.getElementById("resolvedUnresolved").style.color =
                    "orange";
            } else {
                document.getElementById("resolvedUnresolved").style.color =
                    "yellowgreen";
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

            // Edit photo
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

            displayNotes(reportID);

            // Update add new note input
            const submitNote = document.getElementById("submitNote");
            submitNote.setAttribute("onclick", "submitNote(" + reportID + ")");

            for (i = 0; i < reportFields.length; i++) {
                // For all entries in reportFields
                const field = reportFields[i];
                const targetTag = document.getElementById(field);
                targetTag.innerHTML = productInfo[field];
            }
            tag.setAttribute("style", "color:" + tagColors[productInfo["tag"]]);
            modal.style.display = "block"; // Display the modal
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/reportID");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ id: reportID }));
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
    const closeReport = document.getElementById("closeReport");
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
    const closeReport = document.getElementById("closeReport");
    closeReport.setAttribute("onclick", "hideReport(1)");
}

/*
 * Function that takes in a tagID and populates the message dropdown div.
 */
function displayPrewrittenResponses(reportID, webID, tagID) {
    // Clear the message dropdown.
    var messageDropdown = document.getElementById("messageDropdown");
    while (messageDropdown.firstChild) {
        messageDropdown.removeChild(messageDropdown.firstChild);
    }

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
                newOption.setAttribute(
                    "onclick",
                    "sendMessage(" +
                        reportID +
                        ", " +
                        webID +
                        ", '" +
                        responseContent +
                        "')"
                ); // For each message, add sendMessage with given text.
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
    /*
    const request_token = new XMLHttpRequest();
    request_token.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var token = JSON.parse(request_token.response)[0].token;
            console.log(token);
            const request_ntf = new XMLHttpRequest("no-cors");
            request_ntf.open("POST", "https://exp.host/--/api/v2/push/send");
            request_ntf.setRequestHeader("Content-Type", "application/json");
            request_ntf.send(
                JSON.stringify({
                    to: token,
                    title: "NOTIFICATION",
                    body: "BODY",
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
    */
    const request = new XMLHttpRequest();
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/messages/submitMessage"
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
        JSON.stringify({
            reportID: reportID,
            webID: webID,
            messageText: message
        })
    );
    insertNote(reportID, webID, message); // Adds note that a response has been sent.
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
                var newNote = document.createTextNode(notesArray[i]);
                notesDiv.appendChild(newNote);
                notesDiv.appendChild(document.createElement("br"));
            }
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
    const request_token = new XMLHttpRequest();
    request_token.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var token = JSON.parse(request_token.response)[0].token;
            const request_ntf = new XMLHttpRequest("no-cors");
            request_ntf.open("POST", "https://exp.host/--/api/v2/push/send");
            request_ntf.setRequestHeader("Content-Type", "application/json");
            request_ntf.send(
                JSON.stringify({
                    to: token,
                    title: "You have a new message",
                    body: content,
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

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function showMessageDropdown() {
    document.getElementById("messageDropdown").classList.toggle("show");
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function showForwardDropdown() {
    document.getElementById("forwardDropdown").classList.toggle("show");
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function showWhitelistDropdown() {
    document.getElementById("whitelistDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    const dropdowns = [
        "selectMessage-content",
        "forwardButton-content",
        "whitelistButton-content"
    ];
    if (!event.target.matches(".Respondbtn")) {
        for (i = 0; i < dropdowns.length; i++) {
            var dropdownElement = document.getElementsByClassName(dropdowns[i]);
            var j;
            for (j = 0; j < dropdownElement.length; j++) {
                var openDropdown = dropdownElement[j];
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
            }
        }
    }
};

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

function markComplete(reportID, webID) {
    insertTS(0, reportID, webID);
    hideReport(1); // Close the modal
}

// A report has been selected!
function displayReport(id) {
    generateSingleReport(id, document); // Intializes report display
}

// Hides the report and refreshes the page if necessary (changes = 1 vs 0)
function hideReport(changes) {
    document.getElementById("report").style.display = "none";
    reportNoteInput.value = ""; // Clear the input of notes.
    if (changes) {
        clearPages();
        setupReports(document);
    }
}
