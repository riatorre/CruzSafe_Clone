function MainMap() {
    var map = new google.maps.Map(document.getElementById("MainMap"), {
        center: new google.maps.LatLng(36.9916, -122.0583),
        zoom: 15,
        mapTypeId: "hybrid"
    });
    var iconBase = "http://maps.google.com/mapfiles/kml/paddle/";
    var customIcon = {
        1: {
            icon: {
                url: iconBase + "blu-circle.png",
                scaledSize: new google.maps.Size(30, 30)
            }
        },
        2: {
            icon: {
                url: iconBase + "grn-circle.png",
                scaledSize: new google.maps.Size(30, 30)
            }
        },
        3: {
            icon: {
                url: iconBase + "pink-circle.png",
                scaledSize: new google.maps.Size(30, 30)
            }
        },
        4: {
            icon: {
                url: iconBase + "ylw-circle.png",
                scaledSize: new google.maps.Size(30, 30)
            }
        },
        5: {
            icon: {
                url: iconBase + "ltblu-circle.png",
                scaledSize: new google.maps.Size(30, 30)
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
