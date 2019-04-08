var customLabel = {
    1: {
        label: "1"
    },
    2: {
        label: "2"
    },
    3: {
        label: "3"
    },
    4: {
        label: "4"
    },
    5: {
        label: "5"
    }
};
function MainMap() {
    var map = new google.maps.Map(document.getElementById("MainMap"), {
        center: new google.maps.LatLng(36.9916, -122.0583),
        zoom: 15,
        mapTypeId: "hybrid"
    });

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
                var icon = customLabel[tag] || {};
                var marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    label: icon.label
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
