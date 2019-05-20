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
    // "phone",
    "email",
    "body",
    "expireTS",
    "buildingName",
    "buildingFDX",
    "buildingKey",
    "buildingLocation",
    "buildingRegion",
    "buildingStreet",
    "buildingCity",
    "buildingState",
    "buildingZip",
    "buildingCategory",
    "buildingPrimaryUse"
];
const imageTypes = ["png", "jpg", "jpeg", "gif"];
const defaultOptionText = "---Select Option---";
var period = 6;
var reportAssigned = {};

const aPIKey = "AIzaSyDi4bKzq04VojQXEGXec4wDsdRVZhht5vY";

setPeriod();

function setPeriod() {
    setInterval(digestEmail, 1000 * 60);
}

function digestEmail() {
    console.log(reportAssigned);
    if (reportAssigned !== {}) {
        Object.keys(reportAssigned).forEach(function(k) {
            sendEmail(k, reportAssigned[k]);
        });
    }
    reportAssigned = {};
}

// Function used to create a Modal ready to display Single Report Data
function createReportModal() {
    const report = document.createElement("DIV");
    report.setAttribute("class", "reportModalGrid");

    const civilianInfo = document.createElement("DIV");
    civilianInfo.setAttribute("class", "reportContact");
    civilianInfo.innerHTML =
        "<div class = 'name'><div><b>Name:</b> <span id='fullName' placeholder='FullName'></span> - #<span id='mobileID'></span></div></div>";
    //civilianInfo.innerHTML +=
    //  "<div class = 'phone'><div><b>Phone:</b> <span id='phone'></span></div></div>";
    civilianInfo.innerHTML +=
        "<div class = 'email'><div><b>Email:</b> <span id='email'></span></div></div>";

    const reportMetadata = document.createElement("DIV");
    reportMetadata.setAttribute("class", "reportMetaDetails");
    reportMetadata.innerHTML =
        "<div><b>Report:</b> #<span id = 'reportID'></span></div><div><b>Incident:</b> #<span id = 'incidentID'></span> <b id='resolvedUnresolved'></b></div>\n";
    reportMetadata.innerHTML +=
        "<div><b>Date:</b> <span id='reportTS'></span></div>\n";
    reportMetadata.innerHTML +=
        "<div><b>Time:</b> <span id='reportTS2'></span></div>\n";
    reportMetadata.innerHTML +=
        "<div><b>Tag:</b> <span id='tag'></span></div>\n";

    const locationInfo = document.createElement("DIV");
    locationInfo.setAttribute("class", "reportLocAndTag");
    locationInfo.innerHTML = "<div><b>Reported Location:</b>";
    locationInfo.innerHTML += "<span id='location'></span></div>\n";

    const locationData = document.createElement("DIV");
    locationData.setAttribute("class", "reportLocData");
    locationData.innerHTML =
        "<div><b>Location Data:</b> <span id='actualPinned'></span></div>\n";

    const buildingInfo = document.createElement("DIV");
    buildingInfo.setAttribute("class", "reportBuilding");
    buildingInfo.innerHTML +=
        "<div><b>Closest Building:</b> <span id='buildingName'></span> (<span id='buildingFDX'></span>) - #<span id='buildingKey'></span></div>\n";
    buildingInfo.innerHTML +=
        "<div><b>Region:</b> <span id='buildingLocation'></span>, <span id='buildingRegion'></span></div>\n";
    buildingInfo.innerHTML +=
        "<div><b>Address: </b> <span id='buildingStreet'></span>, <span id='buildingCity'></span>, <span id='buildingState'></span> <span id='buildingZip'></span></div>\n";
    buildingInfo.innerHTML +=
        "<div><b>Category/Use:</b> <span id='buildingCategory'></span> | <span id='buildingPrimaryUse'></span></div>\n";

    const media = document.createElement("DIV");
    media.setAttribute("class", "reportVisuals");
    media.innerHTML = "<iframe id='reportMap'></iframe>";
    media.innerHTML +=
        "<div id='media'><img id='reportPhoto' class='imgcontainer' alt='report photo' />";
    media.innerHTML +=
        "<video width = '320' height = '240' controls = 'controls' id='reportVideo' alt='report video' type = 'video/mp4'> </video></div>";

    const expiration = document.createElement("DIV");
    expiration.setAttribute("class", "reportExpiry");
    expiration.innerHTML =
        "<div><b>Expiration Date:</b> <span id='expireTS'></span></div>";
    expiration.innerHTML +=
        "<span class='dropdown'><select id='whitelistDropdown' autocomplete = 'off'><option value = ''>" +
        defaultOptionText +
        "</option><option value='1'>Expire in 1(?) days from submission date</option><option value='3'>Expire in 3(?) days from submission date</option><option value='90'>Expire in 90 days from submission date</option><option value='180'>Expire in 180 days from submission date</option><option value='730'>Expire in 2 years from submission date</option></select><a id = 'whitelistBtn' class='btn rounded navy'>Whitelist Report</a></span>";

    // Description of the Incident
    const reportDesc = document.createElement("DIV");
    reportDesc.setAttribute("class", "reportBody");
    reportDesc.innerHTML = "<b>Report Body:</b>";
    reportDesc.innerHTML += "<div id = 'body'></div>";

    // Notes regarding the specific report
    const notesDiv = document.createElement("DIV");
    notesDiv.setAttribute("class", "reportNotesField");
    notesDiv.innerHTML = "<b>Activity Log:</b>";
    notesDiv.innerHTML += "<div id = 'reportNotes' class='reportNotes'></div>";
    notesDiv.innerHTML +=
        "<div class='notesInput'><input id = 'reportNoteInput' placeholder = 'Add Notes...'/><a id = 'submitNote' class='btn small rounded navy Respondbtn'>Submit</a></div>";

    // All options that do not fit elsewhere
    const optionBtns = document.createElement("DIV");
    optionBtns.setAttribute("class", "reportAux");

    optionBtns.innerHTML =
        "<span><input id='workOrderNum' placeholder='Assign a workorder #'/><a id='workOrderBtn' class='btn rounded navy'>Assign Workorder #</a></span>";
    optionBtns.innerHTML +=
        "<span class='dropdown'><select id='messageDropdown' autocomplete='off' onchange='checkCustom()'></select><input id='customResponse' style='display:none' placeholder='Enter a Custom Response'/><a id='respondBtn' class='btn rounded navy'>Respond</a></span>";
    optionBtns.innerHTML +=
        "<span class='dropdown'><select id='forwardDropdown' autocomplete='off'></select><a id='forwardBtn' class='btn rounded navy'>Assign Report</a></span>";
    optionBtns.innerHTML +=
        "<a class='btn rounded green' id='reportResolve'></a>";

    report.appendChild(civilianInfo);
    report.appendChild(reportMetadata);
    report.appendChild(locationInfo);
    report.appendChild(locationData);
    report.appendChild(buildingInfo);
    report.appendChild(media);
    report.appendChild(expiration);
    report.appendChild(reportDesc);
    report.appendChild(notesDiv);
    report.appendChild(optionBtns);
    return report;
}

function checkCustom() {
    const messageDropdown = document.getElementById("messageDropdown");
    const customResponse = document.getElementById("customResponse");
    if (messageDropdown.value === "custom") {
        customResponse.setAttribute("style", "display:block;");
    } else {
        customResponse.setAttribute("style", "display:none;");
    }
}

/*
    generateSingleReport: takes in a specific reportID and the document itself. 
    Assuming the report modal is in the document, makes two requests to the APIs. 

    First request is for tags. Passes it to helper function.
*/
function generateSingleReport(reportID) {
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
            generateSingleReportHelper(reportID, tagDict, tagColors);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}
/*
    Helper function that grabs all the information from the report.
*/
function generateSingleReportHelper(reportID, tags, tagColors) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reportInfo = JSON.parse(request.response)[0]; // Returns an array containing a single row as an object
            populateReport(reportID, tags, tagColors, reportInfo); // Call populateReport
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
function populateReport(reportID, tags, tagColors, reportInfo) {
    var productInfo = generateProductInfo(reportInfo, tags); // Generate ProductInfo
    // Fills in the modal with productInfo
    for (i = 0; i < reportFields.length; i++) {
        // For all entries in reportFields
        const field = reportFields[i];
        const targetTag = document.getElementById(field);
        targetTag.innerHTML = productInfo[field];
    }

    // Edit the color of the tag
    const tag = document.getElementById("tag");
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
        // Has a completed TS.
        setClose(0);
        // INCOMPLETE button
        resolvedButton.setAttribute(
            "onclick",
            "markIncomplete(" + reportID + ", " + webID + ")"
        );
        resolvedButton.innerHTML = "Mark Incomplete";
        resolvedButton.setAttribute(
            "class",
            "btn rounded red reportCompletebtn"
        );
    } else {
        // Incomplete Report Actions:

        // COMPLETE button
        resolvedButton.setAttribute(
            "onclick",
            "markComplete(" + reportID + "," + webID + ")"
        );
        resolvedButton.innerHTML = "Mark Complete";
        resolvedButton.setAttribute(
            "class",
            "btn rounded green reportCompletebtn"
        );

        if (!!reportInfo["initialOpenTS"]) {
            // Was opened before.
            insertNote(reportID, webID, "{Viewed report}"); // Note: viewing of report
            setClose(0);
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
    const media = document.getElementById("media");
    if (reportInfo["attachments"]) {
        media.setAttribute("style", "");
        map.setAttribute("style", "");
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
        media.setAttribute("style", "display:none");
        map.setAttribute("style", "width:100%;");
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
    // Edit the workorder button and field
    document.getElementById("workOrderNum").value = productInfo["orderNumber"];
    document
        .getElementById("workOrderBtn")
        .setAttribute("onClick", "assignWorkOrder(" + reportID + ")");
    // Edit the whitelist options + button
    document
        .getElementById("whitelistBtn")
        .setAttribute("onClick", "initializeWhitelist(" + reportID + ")");
    // Edit the notes
    displayNotes(reportID);
    const submitNote = document.getElementById("submitNote");
    submitNote.setAttribute("onclick", "submitNote(" + reportID + ")");
    // Edit the forward ptions + button
    displayFacilities();
    document
        .getElementById("forwardBtn")
        .setAttribute(
            "onClick",
            "initializeForward(" +
                reportID +
                "," +
                webID +
                ",'" +
                productInfo["resolvedUnresolved"] +
                "')"
        );

    openModal("reportModal");
}

/*
    Small helper function that applies hideReport with either 0 or 1 to refresh the page or not. 
*/
function setClose(changes) {
    document
        .getElementById("close")
        .setAttribute("onclick", "hideReport(" + changes + ")");
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
    // Work order
    productInfo["orderNumber"] = reportInfo["orderNumber"];
    // actual/pinned
    if (reportInfo["unchangedLocation"]) {
        var actualPinned = "Actual device location - Possibly inaccurate!";
    } else {
        var actualPinned = "User pinned location - Usually accurate!";
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
    //productInfo["phone"] = reportInfo["phone"];
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
    productInfo["buildingName"] = reportInfo["buildingName"];
    productInfo["buildingFDX"] = reportInfo["buildingFDX"];
    productInfo["buildingKey"] = reportInfo["buildingKey"];
    productInfo["buildingLocation"] = reportInfo["buildingLocation"];
    productInfo["buildingRegion"] = reportInfo["buildingRegion"];
    productInfo["buildingStreet"] = reportInfo["buildingStreet"];
    productInfo["buildingCity"] = reportInfo["buildingCity"];
    productInfo["buildingState"] = reportInfo["buildingState"];
    productInfo["buildingZip"] = reportInfo["buildingZip"];
    productInfo["buildingCategory"] = reportInfo["buildingCategory"];
    productInfo["buildingPrimaryUse"] = reportInfo["buildingPrimaryUse"];
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
    const messageDropdownObj = document.getElementById("messageDropdown");
    var message =
        messageDropdownObj.options[messageDropdownObj.selectedIndex].value;
    if (message === "custom") {
        message = document.getElementById("customResponse").value;
    }
    if (message != "") {
        insertNote(
            reportID,
            webID,
            "{Sent pre-written response: " + message + "}"
        ); // Adds note that a response has been sent.
        sendMessage(reportID, webID, message);
        document.getElementById("customResponse").value = "";
    }
}

/*
    Starts Forward Report; the button has been pressed. 
*/
function initializeForward(reportID, webID, resolvedUnresolved) {
    if (resolvedUnresolved == "[Incomplete]") {
        var forwardDropdownObj = document.getElementById("forwardDropdown");
        const facilityID =
            forwardDropdownObj.options[forwardDropdownObj.selectedIndex].value;
        const facilityName = getLastWord(
            forwardDropdownObj.options[forwardDropdownObj.selectedIndex].text
        );
        if (facilityID != "") {
            // First check if the forwarding circumstances is valid.
            // If the task has been completed, reject.
            // Query the database for the responses.
            const request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    response = JSON.parse(request.response)[0];
                    if (response == null) {
                        forwardReport(reportID, webID, facilityID);
                        insertNote(
                            reportID,
                            webID,
                            "{Report has been successfully forwarded to " +
                                facilityName +
                                "}"
                        );
                        alert(
                            "Report successfully forwarded to " +
                                facilityName +
                                "."
                        );
                    } else {
                        alert(
                            "ERROR - This report has already been forwarded to " +
                                facilityName +
                                " and has not been read yet!"
                        );
                    }
                }
            };
            request.open(
                "POST",
                "https://cruzsafe.appspot.com/api/assignments/check"
            );
            request.setRequestHeader(
                "Content-Type",
                "application/json;charset=UTF-8"
            );
            request.send(
                JSON.stringify({
                    reportID: reportID,
                    facilityID: facilityID
                })
            );
        } else {
            alert("ERROR - No report selected!");
        }
    } else {
        alert("ERROR - Cannot forward a completed report!");
    }
}

/*
 * Calls an API that inserts a timestamp into either comletedTS or initialOpenTS
 * Whenever the timestamp is modified, add an event in notes.
 */
function insertTS(initialOpenTS, reportID, webID) {
    // Code that adds a note for initial Open.
    setClose(1);
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
    setClose(1);
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
    const defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "");
    defaultOption.innerHTML = defaultOptionText;
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
            const customResponse = document.createElement("option");
            customResponse.setAttribute("value", "custom");
            customResponse.innerHTML = "---Enter Custom Response---";
            messageDropdown.appendChild(customResponse);
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
    Function that populates the forwardDropdown from the database.
*/
var facilityEmails = {};
function displayFacilities() {
    var forwardDropdown = document.getElementById("forwardDropdown");
    while (forwardDropdown.firstChild) {
        forwardDropdown.removeChild(forwardDropdown.firstChild);
    }
    const defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", "");
    defaultOption.innerHTML = defaultOptionText;
    forwardDropdown.appendChild(defaultOption);

    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            facilities = JSON.parse(request.response);
            Array.from(facilities).forEach(function(facility) {
                var newFacility = document.createElement("option");
                const facilityID = facility["facilityID"];
                const facilityName = facility["facilityName"];
                const facilityEmail = facility["facilityEmail"];
                if (Object.keys(facilityEmails).length < facilities.length) {
                    facilityEmails[facilityID] = facilityEmail;
                }
                var text = document.createTextNode(
                    "Forward to " + facilityName
                );
                newFacility.appendChild(text);
                newFacility.setAttribute("value", facilityID);
                forwardDropdown.appendChild(newFacility);
            });
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/facilities");
    request.send();
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
    Creates an assignment given reportID, webID, and facilityID.
*/
function forwardReport(reportID, webID, facilityID) {
    // Query the database for the responses.
    console.log("fwd");
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (reportAssigned[facilityID] == null) {
                reportAssigned[facilityID] = [reportID];
            } else {
                reportAssigned[facilityID].push(reportID);
            }
            sendEmail(facilityID, [reportID]);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/assignments/assign");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
        JSON.stringify({
            reportID: reportID,
            webID: webID,
            facilityID: facilityID
        })
    );
}

function sendEmail(facilityID, reportID) {
    console.log("email: " + facilityID + " " + reportID);
    const reportinfo = new XMLHttpRequest();
    reportinfo.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var emailBody = "";
            Array.from(JSON.parse(reportinfo.response)).forEach(function(
                reportInfo
            ) {
                emailBody =
                    emailBody +
                    "Incident ID: " +
                    reportInfo["incidentID"] +
                    "\n" +
                    "Report ID: " +
                    reportInfo["reportID"] +
                    "\n" +
                    "Tag: " +
                    reportInfo["tag"] +
                    "\n" +
                    "Report Body: " +
                    reportInfo["body"] +
                    "\n" +
                    "Location: " +
                    reportInfo["location"] +
                    "\n" +
                    "First Name: " +
                    reportInfo["firstName"] +
                    "\n" +
                    "Last Name: " +
                    reportInfo["lastName"] +
                    "\n" +
                    "Email: " +
                    reportInfo["email"] +
                    "\n" +
                    //"Phone: " +
                    //reportInfo["phone"] +
                    //"\n" +
                    "Latitude: " +
                    reportInfo["latitude"] +
                    "\n" +
                    "Longitude: " +
                    reportInfo["longitude"] +
                    "\n" +
                    "Attachment: " +
                    reportInfo["attachments"] +
                    "\n" +
                    "--------------------------------------------" +
                    "\n";
            });
            const email = new XMLHttpRequest();
            email.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("success");
                }
            };
            email.open(
                "POST",
                "https://cruzsafe.appspot.com/api/facilities/emailNotification"
            );
            email.setRequestHeader(
                "Content-Type",
                "application/json;charset=UTF-8"
            );
            console.log(
                "What's wrong? " +
                    JSON.stringify({
                        email: facilityEmails[facilityID],
                        emailBody: emailBody
                    })
            );
            email.send(
                JSON.stringify({
                    email: facilityEmails[facilityID],
                    emailBody: emailBody
                })
            );
        }
    };
    reportinfo.open("POST", "https://cruzsafe.appspot.com/api/reports/");
    reportinfo.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
    );
    reportinfo.send(JSON.stringify({ id: JSON.stringify(reportID) }));
}

/*
    Edits the workorder column.
*/
function assignWorkOrder(reportID) {
    var orderNumber = document.getElementById("workOrderNum").value; // Grab the value of the input
    // Input into database.
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Work order sent
            alert("Work order of " + orderNumber + " sent!");
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/newWorkOrder"
    );
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(
        JSON.stringify({
            reportID: reportID,
            orderNumber: orderNumber
        })
    );
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
    hideReport(1); // Close the modal.
}

function markComplete(reportID, webID) {
    insertTS(0, reportID, webID);
    hideReport(1); // Close the modal
}

// A report has been selected! (External linking function)
function displayReport(reportID) {
    generateSingleReport(reportID); // Intializes report display
}

// Hides the report and refreshes the page if necessary (changes = 1 vs 0)
function hideReport(changes) {
    console.log("hideReport called!");
    closeModal("reportModal");
    reportNoteInput.value = ""; // Clear the input of notes.
    const customResponse = document.getElementById("customResponse");
    customResponse.setAttribute("style", "display: none");
    customResponse.value = "";

    // When changes have been made
    if (changes) {
        if ((pageID == 1) | (pageID == 2)) {
            clearPages("reportList");
            setupListReports();
        }
    }
}

function getLastWord(string) {
    var seperated = string.split(" ");
    return seperated[seperated.length - 1];
}
