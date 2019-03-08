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
    "body"
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
            if (!!reportInfo["completeTS"]) {
                var resolvedUnresolved = "[Complete]"; // Completed; not null
                document
                    .getElementById("closeReport")
                    .setAttribute("onclick", "hideReport(0)");
            } else if (!!reportInfo["initialOpenTS"]) {
                var resolvedUnresolved = "[Incomplete]"; // no complete TS but a inital open TS
                document
                    .getElementById("closeReport")
                    .setAttribute("onclick", "hideReport(0)");
            } else {
                // If it is a new, then it is now incomplete! Set the data in the database. Apply web ID.
                insertTS(1, reportID, webID);
                var resolvedUnresolved = "[Incomplete]"; // Null
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
            document
                .getElementById("reportResolve")
                .setAttribute("onclick", "markComplete(" + reportID + ")"); // Add onclick function to button
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

function markComplete(reportID) {
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
