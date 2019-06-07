/*
    adminList.js
    Administrative page setup
 */

// Standard options for graphs.
var standardOptions = {
    legend: {
        labels: {
            fontSize: 15,
            fontColor: "white"
        }
    },
    labels: {
        color: "white"
    },
    scales: {
        yAxes: [
            {
                display: true,
                gridLines: {
                    display: false,
                    color: "white"
                },
                ticks: {
                    fontColor: "white",
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: "# Reports",
                    fontColor: "white"
                }
            }
        ],
        xAxes: [
            {
                display: true,
                ticks: {
                    fontColor: "white"
                },
                gridLines: {
                    display: false,
                    color: "white"
                }
            }
        ]
    }
};

/*
// Function used to create a Modal ready to display Single Report Data
function createUserModal() {
    const user = document.createElement("DIV");
    user.setAttribute("class", "row");

    const column1 = document.createElement("DIV");
    column1.setAttribute("class", "column half reportColumn");

    // User information
    const userInfo = document.createElement("DIV");
    userInfo.setAttribute("class", "row eigths leaf leftAlign");
    userInfo.innerHTML =
        "<div class = 'name'><div><b>Name:</b> <span id='userFullName' placeholder='FullName'></span> - #<span id='webID'></span></div></div>";
    userInfo.innerHTML +=
        "<div class = 'phone'><div><b>Title:</b> <span id='userTitle'></span></div></div>";
    userInfo.innerHTML +=
        "<div class = 'email'><div><b>Role:</b> <span id='userRole'></span></div></div>";
    userInfo.innerHTML +=
        "<div class = 'email'><div><b>Facility:</b> <span id='userFacility'></span></div></div>";

    // User History list.
    const userHistory = document.createElement("DIV");
    userHistory.setAttribute("class", "row sixEights leaf leftAlign");
    userHistory.setAttribute("id", "userHistory");

    column1.appendChild(userInfo);
    column1.appendChild(userHistory);

    const column2 = document.createElement("DIV");
    column2.setAttribute("class", "column half reportColumn");

    // Graphs for statistics.
    const userGraph1Div = document.createElement("DIV");
    userGraph1Div.setAttribute("class", "row leaf leftAlign");
    userGraph1Div.setAttribute("id", "userGraph1Div");

    column2.appendChild(userGraph1Div);
    //column2.appendChild(userGraph2Div);
    //column2.appendChild(userGraph3Div);
    //column2.appendChild(userGraph4Div);

    user.appendChild(column1);
    user.appendChild(column2);
    return user;
}*/

/*
    Grabs a list of all users and populates userList div in admin page. 
 */
function setupUsersList() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            users = JSON.parse(request.response);

            userList = document.getElementsByClassName("usersList")[0]; // Remove all items in list if any
            while (userList.firstChild) {
                userList.removeChild(userList.firstChild);
            }

            // Inject all user information into an array
            // Each user contains firstName, lastName, title, facilityID, facilityName, role
            Array.from(users).forEach(function(user) {
                createUserButton(userList, user);
            });
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/users/allWebUsers");
    request.send();
}

function createUserButton(userList, user) {
    var button = document.createElement("BUTTON");

    const table = document.createElement("table");
    const tableRow = document.createElement("tr");
    button.setAttribute("onclick", "displayUser(" + user["webID"] + ")");
    button.setAttribute("id", "userButton");

    const firstNameText = document.createElement("td");
    firstNameText.setAttribute("class", "buttonFirstNameText");
    firstNameText.innerHTML = user["firstName"];

    const lastNameText = document.createElement("td");
    lastNameText.setAttribute("class", "buttonLastNameText");
    lastNameText.innerHTML = user["lastName"];

    const titleText = document.createElement("td");
    titleText.setAttribute("class", "buttonTitleText");
    titleText.innerHTML = user["title"];

    const facilityNameText = document.createElement("td");
    facilityNameText.setAttribute("class", "buttonFacilityNameText");
    facilityNameText.innerHTML = user["facilityName"];

    const roleText = document.createElement("td");
    roleText.setAttribute("class", "buttonRoleText");
    roleText.innerHTML = user["role"];

    tableRow.appendChild(firstNameText);
    tableRow.appendChild(lastNameText);
    tableRow.appendChild(titleText);
    tableRow.appendChild(facilityNameText);
    tableRow.appendChild(roleText);
    table.appendChild(tableRow);
    button.appendChild(table);
    userList.appendChild(button);
}

/*
    Function that populates the forwardDropdown from the database.
*/
/*
function displayFacilitiesAdmin() {
    var forwardDropdown = document.getElementById("forwardDropdownAdmin");
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
                var text = document.createTextNode(
                    "Display " + facilityName + " assignments"
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
*/
function getLastWord(string) {
    var seperated = string.split(" ");
    return seperated[seperated.length - 1];
}

/*
function refreshPage() {
    var forwardDropdownObj = document.getElementById("forwardDropdownAdmin");
    const facilityID =
        forwardDropdownObj.options[forwardDropdownObj.selectedIndex].value;
    // Got facultyID.
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var webIDs = JSON.parse(request.response);
            webID = webIDs[0]["webID"];
            setupListReports();
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/facilities/webIDs");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ facilityID: facilityID }));
}
*/

function displayUser(webID) {
    // Gather information on user.
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            user = JSON.parse(request.response)[0];

            /*
                Clear all pre-existing elements. 
            */
            document.getElementById("userFullName").innerHTML = "";
            document.getElementById("userEmail").innerhTML = "";
            document.getElementById("webID").innerHTML = "";
            document.getElementById("userTitle").innerHTML = "";
            document.getElementById("userRole").innerHTML = "";
            document.getElementById("userFacility").innerHTML = "";
            document.getElementById("userLatestActivity").innerHTML = "";

            const userHistory = document.getElementById("userHistory");
            while (userHistory.firstChild) {
                userHistory.removeChild(userHistory.firstChild);
            }

            // Input user information in modal.
            document.getElementById("userFullName").innerHTML =
                user["firstName"] + " " + user["lastName"];
            document.getElementById("userEmail").innerHTML = user["email"];
            document.getElementById("webID").innerHTML = user["webID"];
            document.getElementById("userTitle").innerHTML = user["title"];
            document.getElementById("userRole").innerHTML = user["role"];
            document.getElementById("userFacility").innerHTML =
                user["facilityName"];

            // Input User History (Todo.)

            displayUserHelper(webID);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/users/webUser");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ webID: webID }));
}

/*
    Sets up the graph and populates history. 
*/
function displayUserHelper(webID) {
    // Gather information on user.
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            userInfo = JSON.parse(request.response);

            // Create User graphs
            readyDivCanvas("userGraph1Div", "userGraph1");
            // Action summary graph
            if (userInfo.length != 0) {
                var dict = {};
                var newData = {
                    label: "First Opened Report",
                    data: [0],
                    fillColor: ["rgba(255, 99, 132, 1)"]
                };
                dict[0] = newData;
                var newData = {
                    label: "Viewed Report",
                    data: [0],
                    fillColor: ["rgba(54, 162, 235, 1)"]
                };
                dict[1] = newData;
                var newData = {
                    label: "Forwarded Report",
                    data: [0],
                    fillColor: ["rgba(255, 206, 86, 1)"]
                };
                dict[2] = newData;
                var newData = {
                    label: "Responded to Report",
                    data: [0],
                    fillColor: ["rgba(75, 192, 192, 1)"]
                };
                dict[3] = newData;
                var newData = {
                    label: "Completed Report",
                    data: [0],
                    fillColor: ["rgba(153, 102, 255, 1)"]
                };
                dict[4] = newData;
                var newData = {
                    label: "Other",
                    data: [0],
                    fillColor: ["rgba(255, 159, 64, 1)"]
                };
                dict[5] = newData;

                Array.from(userInfo).forEach(function(note) {
                    if (note["content"] == "{Report initially opened}") {
                        dict[0].data[0]++;
                    } else if (note["content"] == "{Viewed report}") {
                        dict[1].data[0]++;
                    } else if (
                        note["content"].startsWith(
                            "{Report has been successfully forwarded to"
                        )
                    ) {
                        dict[2].data[0]++;
                    } else if (
                        note["content"].startsWith(
                            "{Sent pre-written response:"
                        )
                    ) {
                        dict[3].data[0]++;
                    } else if (
                        note["content"] == "{Report marked as complete}"
                    ) {
                        dict[4].data[0]++;
                    } else {
                        dict[5].data[0]++;
                    }
                });
                renderChart(
                    "userGraph1",
                    dict,
                    [userInfo[0]["firstName"] + "'s Actions"],
                    "bar",
                    standardOptions
                );

                // Latest activity
                document.getElementById("userLatestActivity").innerHTML =
                    "#" +
                    userInfo[0]["reportID"] +
                    ": " +
                    userInfo[0]["content"] +
                    " - " +
                    userInfo[0]["ts"];

                // Get a list of all of the reports they've worked on and populate userHistory.
                userReports = [];
                Array.from(userInfo).forEach(function(note) {
                    const reportID = note["reportID"];
                    if (!userReports.includes(reportID)) {
                        // add new reportID to reports.
                        userReports.push(reportID);
                        // Create a new button to go in the modal.
                        createReportUserButton(note);
                    }
                });
            }
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/users/webUserNotes");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ webID: webID }));
}

/*
    Creates a button showing what reports have been worked on by the user. 
*/
function createReportUserButton(report) {
    const userHistory = document.getElementById("userHistory");

    var button = document.createElement("BUTTON");
    const table = document.createElement("table");
    const tableRow = document.createElement("tr");
    button.setAttribute("onclick", "displayReport(" + report["reportID"] + ")");
    button.setAttribute("id", "userHistoryButton");

    const reportIDText = document.createElement("td");
    reportIDText.setAttribute("class", "buttonReportIDText");
    reportIDText.innerHTML = "#" + report["reportID"];

    const incidentIDText = document.createElement("td");
    incidentIDText.setAttribute("class", "buttonIncidentIDText");
    incidentIDText.innerHTML = "#" + report["incidentID"];

    const reportTSText = document.createElement("td");
    reportTSText.setAttribute("class", "buttonReportTSText");
    reportTSText.innerHTML = report["reportTS"];

    const tagText = document.createElement("td");
    tagText.setAttribute("class", "buttonTagText");
    tagText.innerHTML = report["tag"];

    const locationText = document.createElement("td");
    locationText.setAttribute("class", "buttonLocationText");
    locationText.innerHTML = report["location"];

    tableRow.appendChild(reportIDText);
    tableRow.appendChild(incidentIDText);
    tableRow.appendChild(reportTSText);
    tableRow.appendChild(tagText);
    tableRow.appendChild(locationText);
    table.appendChild(tableRow);
    button.appendChild(table);
    userHistory.appendChild(button);
}

/*
    Code that takes in a dictionary that contains at least label, data, and backgroundCOlor. 
    Also takes in labels [] and type

    Ex) renderChart(usersDict, ["New", "Incomplete", "Complete"], "bar")
*/
function renderChart(canvasName, dict, labels, type, options) {
    var ctx = document.getElementById(canvasName).getContext("2d");
    var datasets = [];
    for (key in dict) {
        if (dict.hasOwnProperty(key)) {
            const value = dict[key];
            datasets.push({
                label: value.label,
                data: value.data,
                backgroundColor: value.fillColor
            });
        }
    }
    var firstOpenedDelayChart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: options
    });
}

/*
    Helper function to initialize a div with a canvas with a given id. 
*/
function readyDivCanvas(chartDivName, id) {
    const chartDiv = document.getElementById(chartDivName);
    while (chartDiv.firstChild) {
        chartDiv.removeChild(chartDiv.firstChild);
    }
    const newCanvas = document.createElement("canvas");
    newCanvas.setAttribute("id", id);
    chartDiv.appendChild(newCanvas);
}

/*
    Function that checks the input fields and, if all is good, initiates a call to
    create a new user. 
*/
const newUserFields = [
    "newUserFirstName",
    "newUserLastName",
    "newUserEmail",
    "newUserTitle",
    "newUserRole",
    "newUserFacilityID"
];
const newUserFieldsReadable = [
    "First Name",
    "Last Name",
    "UCSC Email",
    "Title",
    "Role (numeric)",
    "Facility (numeric)"
];
function createNewUser() {
    let newUserInfo = {};
    let missing = [];
    for (i = 0; i < newUserFields.length; i++) {
        // Populate newUserInfo
        let keyName = newUserFields[i].replace("newUser", "");
        keyName = keyName.charAt(0).toLowerCase() + keyName.slice(1);
        let value = document.getElementById(newUserFields[i]).value;
        if (!/\d/.test(value)) {
            // If does not have number, add quotes.
            value = addQuotes(value);
        }
        newUserInfo[keyName] = value;
        // Type checking.
        if (value === "") {
            missing.push(newUserFieldsReadable[i]);
        }
    }
    if (missing.length != 0) {
        let errorString = missing[0];
        for (i = 1; i < missing.length; i++) {
            errorString = errorString + ", " + missing[i];
        }
        alert(
            "ERROR - all fields must be filled out in order to create a new user!\n\nMissing: " +
                errorString +
                "."
        );
        return;
    }
    console.log(newUserInfo);
    // We've guaranteed that the inputs are clean and not empty in newUserInfo. Let's call the API.
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("User added successfully!");
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/users/newWebUser");
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ dict: JSON.stringify(newUserInfo) }));
}

/*
 * Helper function that wraps a string in '' symbols for a SQL query.
 */
function addQuotes(string) {
    return (string = '"' + string + '"');
}
