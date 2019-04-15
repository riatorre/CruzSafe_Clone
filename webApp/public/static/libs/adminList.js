/*
 * Administrative page setup
 */

/*
    Grabs a list of all users and populates userList div in admin page. 
 */
function setupUsersList() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            users = JSON.parse(request.response);

            userList = document.getElementById("userList"); // Remove all items in list if any
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
    //button.setAttribute("onclick", "displayUser(" + report["reportID"] + ")"); TODO+++++++++++++

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
                const facilityEmail = facility["facilityEmail"];
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

function getLastWord(string) {
    var seperated = string.split(" ");
    return seperated[seperated.length - 1];
}

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
