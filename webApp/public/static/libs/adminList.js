/*
 * Administrative page setup
 */

var numButtons = 20;

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
            var allInfo = [];
            Array.from(users).forEach(function(user) {
                allInfo.push(user);
            });
            console.log(users);
            createPages("userList", numButtons, allInfo, createUserButton);
            currentTab = 0;
            showTab(0);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/users/allWebUsers");
    request.send();
}

function createUserButton(user) {
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
    return button;
}
