/*
    Code to setup primary elements on homepage.html.
*/

function MainMap() {
    var map = new google.maps.Map(document.getElementById("MainMap"), {
        center: new google.maps.LatLng(36.9916, -122.0583),
        zoom: 15,
        mapTypeId: "hybrid"
    });
    var iconBase = "https://storage.googleapis.com/cruzsafe.appspot.com/";
    var customIcon = {
        1: {
            icon: {
                url: iconBase + "blue.png",
                scaledSize: new google.maps.Size(18, 28)
            }
        },
        2: {
            icon: {
                url: iconBase + "lime.png",
                scaledSize: new google.maps.Size(18, 28)
            }
        },
        3: {
            icon: {
                url: iconBase + "navy.png",
                scaledSize: new google.maps.Size(18, 28)
            }
        },
        4: {
            icon: {
                url: iconBase + "aqua.png",
                scaledSize: new google.maps.Size(18, 28)
            }
        },
        5: {
            icon: {
                url: iconBase + "olive.png",
                scaledSize: new google.maps.Size(18, 28)
            }
        },
        6: {
            icon: {
                url: iconBase + "black.png",
                scaledSize: new google.maps.Size(18, 28)
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

function renderChart() {
    var ctx = document.getElementById("performanceChart").getContext("2d");
    var performanceChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: [
                "< 1 min",
                "1 to 5 min",
                "6 to 30 min",
                "31 to 60 min",
                "2 hours",
                "> 2 hours"
            ],
            datasets: [
                {
                    label: "# of Votes",
                    data: [12, 19, 3, 5, 2, 3],
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
                text: "Report Response Time"
            }
        }
    });
}
