/*
    Code to setup primary elements on homepage.html.
*/

function MainMap() {
    var map = new google.maps.Map(document.getElementById("MainMap"), {
        center: new google.maps.LatLng(36.9916, -122.0583),
        zoom: 15,
        mapTypeId: "hybrid",
        styles: [
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });
    var iconBase = "https://storage.googleapis.com/cruzsafe.appspot.com/";
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

    // Change this depending on the name of your PHP or XML file
    downloadUrl("https://cruzsafe.appspot.com/api/reports/allReports", function(
        data
    ) {
        reportInfo = JSON.parse(data.response); // Returns an array
        if (reportInfo != null) {
            Array.prototype.forEach.call(reportInfo, function(report) {
                var id = report["reportID"];
                var tag = report["tag"];
                var point = new google.maps.LatLng(
                    parseFloat(report["latitude"]),
                    parseFloat(report["longitude"])
                );
                var Cicon = customIcon[tag] || {};
                var marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    icon: Cicon.icon
                });
                marker.addListener("click", function() {
                    displayReport(id, false);
                });
            });
        }
    });
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
            data = [0, 0, 0];
            Array.from(reports).forEach(function(report) {
                if (report["initialOpenWebID"] == null) {
                    // Number of Unread reports
                    data[0]++;
                } else if (report["completeWebID"] == null) {
                    // Number of Read but not completed reports
                    data[1]++;
                } else {
                    // Number of completed reports
                    data[2]++;
                }
            });
            renderReportsOverviewHelper(data);
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/allReports");
    request.send();
}
function renderReportsOverviewHelper(data) {
    var ctx = document.getElementById("reportsOverviewChart").getContext("2d");
    var firstOpenedDelayChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["New", "Incomplete", "Complete"],
            datasets: [
                {
                    label: "Report Statuses",
                    data: data,
                    backgroundColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)"
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)"
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
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
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)"
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)"
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: "Report First Opened Delay"
            }
        }
    });
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
