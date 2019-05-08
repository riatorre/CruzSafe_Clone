/*
    Code to setup primary elements on homepage.html.
*/
var map;
var both = { lat: 36.975681, lng: -122.05285 };
var Main = { lat: 36.990468, lng: -122.05824 };
var Coastal = { lat: 36.953909, lng: -122.06099 };
var height = window.innerHeight;
var D_Zoom = height < 937 ? 14 : 15;
D_Zoom = D_Zoom == 14 ? (height < 637 ? 13 : 14) : 15;

function CenterControl(controlDiv, map, center) {
    // We set up a variable for this since we're adding event listeners
    // later.
    var control = this;

    // Set the center property upon construction
    control.center_ = center;
    controlDiv.style.clear = "both";

    // Set CSS for the control border
    var goBoth = document.createElement("div");
    goBoth.id = "goBoth";
    goBoth.title = "Focus on entire campus";
    controlDiv.appendChild(goBoth);

    // Set CSS for the control interior
    var goBothText = document.createElement("div");
    goBothText.id = "goBothText";
    goBothText.innerHTML = "Entire Campus";
    goBoth.appendChild(goBothText);

    // Set CSS for the setCenter control border
    var goMain = document.createElement("div");
    goMain.id = "goMain";
    goMain.title = "Focus on main campus";
    controlDiv.appendChild(goMain);

    // Set CSS for the control interior
    var goMainText = document.createElement("div");
    goMainText.id = "goMainText";
    goMainText.innerHTML = "Main Campus";
    goMain.appendChild(goMainText);

    var goCoastal = document.createElement("div");
    goCoastal.id = "goCoastal";
    goCoastal.title = "Focus on coastal campus";
    controlDiv.appendChild(goCoastal);

    // Set CSS for the control interior
    var goCoastalText = document.createElement("div");
    goCoastalText.id = "goCoastalText";
    goCoastalText.innerHTML = "Coastal Campus";
    goCoastal.appendChild(goCoastalText);

    // Set up the click event listener for 'Center Map': Set the center of
    // the map
    // to the current center of the control.
    goBoth.addEventListener("click", function() {
        map.setCenter(both);
        map.setZoom(D_Zoom - 1);
    });

    goMain.addEventListener("click", function() {
        map.setCenter(Main);
        map.setZoom(D_Zoom);
    });

    goCoastal.addEventListener("click", function() {
        map.setCenter(Coastal);
        map.setZoom(D_Zoom);
    });
}

function MainMap() {
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
            mainMapHelper(tagDict, tagColors);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/tags");
    request.send();
}

function mainMapHelper(tagList, tagColors) {
    map = new google.maps.Map(document.getElementById("MainMap"), {
        center: both,
        zoom: D_Zoom - 1,
        mapTypeId: "hybrid",
        styles: [
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ],
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });
    var onresize = function(e) {
        //note i need to pass the event as an argument to the function
        height = e.target.outerHeight;
        D_Zoom = height < 1040 ? 14 : 15;
        D_Zoom = D_Zoom == 14 ? (height < 637 ? 13 : 14) : 15;
        map.setZoom(D_Zoom - 1);
    };
    window.addEventListener("resize", onresize);
    // Create the DIV to hold the control and call the CenterControl()
    // constructor
    // passing in this DIV.
    var centerControlDiv = document.createElement("div");
    var centerControl = new CenterControl(centerControlDiv, map, both);
    var infoWindow = new google.maps.InfoWindow();
    centerControlDiv.index = 1;
    centerControlDiv.style["padding-top"] = "10px";
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
    var iconBase = "https://storage.googleapis.com/cruzsafe.appspot.com/";
    var tempTagColorDict = {
        1: "blue_num.png",
        2: "lime_num.png",
        3: "navy_num.png",
        4: "aqua_num.png",
        5: "olive_num.png",
        6: "black_num.png"
    };
    var customIcon = {
        1: {
            icon: {
                url: iconBase + "blue_num.png",
                scaledSize: new google.maps.Size(23, 36)
            }
        },
        2: {
            icon: {
                url: iconBase + "lime_num.png",
                scaledSize: new google.maps.Size(23, 36)
            }
        },
        3: {
            icon: {
                url: iconBase + "navy_num.png",
                scaledSize: new google.maps.Size(23, 36)
            }
        },
        4: {
            icon: {
                url: iconBase + "aqua_num.png",
                scaledSize: new google.maps.Size(23, 36)
            }
        },
        5: {
            icon: {
                url: iconBase + "olive_num.png",
                scaledSize: new google.maps.Size(23, 36)
            }
        },
        6: {
            icon: {
                url: iconBase + "black_num.png",
                scaledSize: new google.maps.Size(23, 36)
            }
        }
    };

    // Initialize the tags List.
    const tagListDiv = document.getElementById("tagList");
    // Remove all pre-existing children.
    while (tagListDiv.firstChild) {
        tagListDiv.removeChild(tagListDiv.firstChild);
    }

    for (key in tagList) {
        if (tagList.hasOwnProperty(key)) {
            const newDiv = document.createElement("div");
            newDiv.setAttribute("id", "tagListTag");
            newDiv.setAttribute("style", "text-align:left;");
            const value = tagList[key];
            const newIcon = document.createElement("img");
            newIcon.src = iconBase + tempTagColorDict[key];
            newIcon.setAttribute(
                "style",
                "height:30px;width30px;margin-right:5px;margin-left: 5px;"
            );
            newDiv.appendChild(newIcon);
            const newText = document.createElement("t");
            newText.setAttribute("style", "color:" + tagColors[value] + ";");
            newText.innerHTML = value;
            newDiv.appendChild(newText);
            tagListDiv.appendChild(newDiv);
        }
    }

    // Change this depending on the name of your PHP or XML file
    downloadUrl(
        "https://cruzsafe.appspot.com/api/reports/incompleteReports",
        function(data) {
            reportInfo = JSON.parse(data.response); // Returns an array
            if (reportInfo != null) {
                Array.prototype.forEach.call(reportInfo, function(report) {
                    var r_id = report["reportID"];
                    var id = report["incidentID"];
                    var tag = report["tag"];
                    var reportTS = report["reportTS"];
                    var date = formatDate(reportTS, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour12: false
                    });
                    var time = formatDate(reportTS, {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: false
                    });
                    var location = report["location"];
                    var body = report["body"];
                    var point = new google.maps.LatLng(
                        parseFloat(report["latitude"]),
                        parseFloat(report["longitude"])
                    );
                    var Cicon = customIcon[tag] || {};
                    var tagName = tagList[tag];
                    var infowincontent =
                        '<div id="content">' +
                        "<hr>" +
                        '<h5 style="font-size:20px">' +
                        tagName +
                        "</h5>" +
                        "<hr>" +
                        '<p style="font-size:15px"><b>Location: </b>' +
                        location +
                        "</p>" +
                        '<p style="font-size:15px"><b>Description: </b>' +
                        body +
                        "</p>" +
                        '<p style="font-size:15px"><b>Date: </b>' +
                        date +
                        "</p>" +
                        '<p style="font-size:15px"><b>Time: </b>' +
                        time +
                        "</p>" +
                        '<p style="font-size:15px"><b>Incident #: </b>' +
                        id +
                        "</p>" +
                        "</div>";
                    var marker = new google.maps.Marker({
                        map: map,
                        position: point,
                        icon: Cicon.icon
                    });

                    marker.addListener("click", function() {
                        displayReport(r_id, false);
                    });
                    marker.addListener("mouseover", function() {
                        infoWindow.setContent(infowincontent);
                        infoWindow.open(map, marker);
                    });
                    marker.addListener("mouseout", function() {
                        infoWindow.close();
                    });
                });
            }
        }
    );
}

function downloadUrl(url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && this.status == 200) {
            callback(request, request.status);
        }
    };

    request.open("POST", url);
    request.send(null);
}

/*
    Code to render reportsOverviewChart. Gathers information and then renders chart using helper function.
*/
function renderReportsOverview() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reports = JSON.parse(request.response);
            renderReportsOverviewFacilities(reports);
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/reportAllTS"
    );
    request.send();
}
/*
    Now that we have all of the report IDs, we will cross-reference that list with the assignments that have been made. 
*/
function renderReportsOverviewFacilities(reports) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            assignments = Array.from(JSON.parse(request.response));

            var facilityDict = {
                0: {
                    label: "Unassigned",
                    data: [0, 0, 0],
                    fillColor: "blue" // NOTE THIS IS HARD CODED.
                }
            }; // Intialzied with empty.
            var assignedReports = []; // Keeping track of what reports to skip over
            // Create a dictionary of key:value = facilityID:facilityObject
            assignments.forEach(function(assignment) {
                const facilityID = assignment["facilityID"];
                if (!(facilityID in facilityDict)) {
                    var newFacility = {
                        label: assignment["facilityName"],
                        data: [0, 0, 0],
                        fillColor: assignment["color"]
                    };
                    facilityDict[facilityID] = newFacility;
                }
                // Increment the information.
                if (assignment["completeTS"]) {
                    // Complete
                    facilityDict[facilityID].data[2]++;
                } else if (assignment["initialOpenTS"]) {
                    // Incomplete
                    facilityDict[facilityID].data[1]++;
                } else {
                    // New
                    facilityDict[facilityID].data[0]++;
                }
            });
            Array.from(reports).forEach(function(report) {
                if (!assignedReports.includes(report["reportID"])) {
                    // Has not been assigned
                    if (report["completeTS"]) {
                        // Complete
                        facilityDict[0].data[2]++;
                    } else if (report["initialOpenTS"]) {
                        // Incomplete
                        facilityDict[0].data[1]++;
                    } else {
                        // New
                        facilityDict[0].data[0]++;
                    }
                }
            });
            console.log(facilityDict);
            renderReportsOverviewHelper(facilityDict);
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/assignments/facilityAssignments"
    );
    request.send();
}
/*
    Takes in filled facilityDict with facilityID:facilityObj {facilityName, complete, incomplete, new}
*/
function renderReportsOverviewHelper(facilityDict) {
    var ctx = document.getElementById("reportsOverviewChart").getContext("2d");
    // From facilityDict, create an array with all of the color values.
    var datasets = [];
    for (key in facilityDict) {
        if (facilityDict.hasOwnProperty(key)) {
            const facility = facilityDict[key];
            datasets.push({
                label: facility.label,
                data: facility.data,
                backgroundColor: facility.fillColor,
                borderColor: "black",
                borderWidth: 1
            });
        }
    }
    var firstOpenedDelayChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["New", "Incomplete", "Complete"],
            datasets: datasets
        },
        options: {
            legend: {
                labels: {
                    fontSize: 15
                }
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    });
}

/*
    Code to render firstOpenedDelay Chart. Gathers information and then renders chart using helper function.
*/
function renderfirstOpenedDelay() {
    // Gather the data; initialTS versus initialOpenTS (ignoring ones that don't have any initialOpenTS's)
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reports = JSON.parse(request.response);
            data = [0, 0, 0, 0, 0, 0];
            Array.from(reports).forEach(function(report) {
                var reportTS = toDateFormat(report["reportTS"]);
                var initialOpenTS = toDateFormat(report["initialOpenTS"]);
                var miliDiff = initialOpenTS - reportTS;
                // < 1 min
                if (miliDiff < 60000) {
                    data[0]++;
                }
                // 1 to 5 min
                else if (miliDiff < 300000) {
                    data[1]++;
                }
                // 6 to 30 min
                else if (miliDiff < 1.8e6) {
                    data[2]++;
                }
                // 31 to 60 min
                else if (miliDiff < 3.6e6) {
                    data[3]++;
                }
                // 1 to 3 hours
                else if (miliDiff < 1.08e7) {
                    data[4]++;
                }
                // > 3 hours
                else {
                    data[5]++;
                }
            });
            renderfirstOpenedDelayHelper(data);
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/allOpenedReports"
    );
    request.send();
}
/* 
    Takes in data; an array of size 6 gotten from renderChart().
*/
function renderfirstOpenedDelayHelper(data) {
    var ctx = document.getElementById("firstOpenedDelayChart").getContext("2d");
    var firstOpenedDelayChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: [
                "< 1 min",
                "1 to 5 min",
                "6 to 30 min",
                "31 to 60 min",
                "1 to 3 hours",
                "> 3 hours"
            ],
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        "#237000",
                        "#009FB7",
                        "#AD8432",
                        "#696773",
                        "#272727",
                        "#020100"
                    ],
                    borderColor: [
                        "black",
                        "black",
                        "black",
                        "black",
                        "black",
                        "black"
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            legend: {
                labels: {
                    fontSize: 15
                }
            }
        }
    });
}

/*
    The following is imported code to convert MySQL TS to JS date.
*/

function formatDate(mySQLDate, options) {
    var jsDate = toDateFormat(mySQLDate);
    return jsDate.toLocaleString("en-US", options);
}

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
