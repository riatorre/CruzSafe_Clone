const standardOptions = {
    legend: {
        labels: {
            fontColor: "grey",
            fontSize: 12
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
};

/*
    Grabs all of the tags. 
*/
function renderReportByTag() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reports = JSON.parse(request.response);
            var tagsDict = {};

            Array.from(reports).forEach(function(report) {
                const tag = report["tag"];
                if (!(tag in tagsDict)) {
                    var newTag = {
                        label: report["tagName"],
                        data: [0, 0, 0],
                        fillColor: report["color"]
                    };
                    tagsDict[tag] = newTag;
                }
                // Increment the information.
                if (report["completeTS"]) {
                    // Complete
                    tagsDict[tag].data[2]++;
                } else if (report["initialOpenTS"]) {
                    // Incomplete
                    tagsDict[tag].data[1]++;
                } else {
                    // New
                    tagsDict[tag].data[0]++;
                }
            });
            renderChart(
                tagsDict,
                ["New", "Incomplete", "Complete"],
                "bar",
                standardOptions
            );
        }
    };
    request.open(
        "POST",
        "https://cruzsafe.appspot.com/api/reports/reportsTags"
    );
    request.send();
}

/*
    Graph that displays how many reports have been sent in by user
*/
function renderReportByUser() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            users = JSON.parse(request.response);
            var usersDict = {};

            Array.from(users).forEach(function(user) {
                const mobileID = user["mobileID"];
                if (!(mobileID in usersDict)) {
                    var newUser = {
                        label: user["firstName"] + " " + user["lastName"],
                        data: [0, 0, 0],
                        fillColor: getRandomColor()
                    };
                    usersDict[mobileID] = newUser;
                }
                // Increment the information.
                if (user["completeTS"]) {
                    // Complete
                    usersDict[mobileID].data[2]++;
                } else if (user["initialOpenTS"]) {
                    // Incomplete
                    usersDict[mobileID].data[1]++;
                } else {
                    // New
                    usersDict[mobileID].data[0]++;
                }
            });
            renderChart(
                usersDict,
                ["New", "Incomplete", "Complete"],
                "bar",
                standardOptions
            );
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/users/reportsUsers");
    request.send();
}

/*
    Code that takes in a dictionary that contains at least label, data, and backgroundCOlor. 
    Also takes in labels [] and type

    Ex) renderChart(usersDict, ["New", "Incomplete", "Complete"], "bar")
*/
function renderChart(dict, labels, type, options) {
    // Remove canvas
    const chartDiv = document.getElementById("chartDiv");
    while (chartDiv.firstChild) {
        chartDiv.removeChild(chartDiv.firstChild);
    }
    // Create new canvas
    const newChart = document.createElement("canvas");
    newChart.setAttribute("id", "chart");
    chartDiv.appendChild(newChart);
    var ctx = document.getElementById("chart").getContext("2d");
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
    Imported code to get a random color
*/
function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
