/*
    analytics.js
    Code for the various graphs appearing on the admin page.
*/

var standardOptions = {
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
var savedDict = null;
var savedLabels = null;

var chartType = "bar";

function setChartLine() {
    if (chartType != "line") {
        chartType = "line";
        standardOptions = {
            legend: {
                labels: {
                    fontColor: "grey",
                    fontSize: 12
                }
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
                            beginAtZero: true
                        }
                    }
                ],
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: false,
                            color: "white"
                        }
                    }
                ]
            }
        };
        if (savedDict != null) {
            renderChart(savedDict, savedLabels, chartType, standardOptions);
        }
    }
}
function setChartBar() {
    if (chartType != "bar") {
        chartType = "bar";
        standardOptions = {
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
        if (savedDict != null) {
            renderChart(savedDict, savedLabels, chartType, standardOptions);
        }
    }
}
function setChartPie() {
    if (chartType != "pie") {
        chartType = "pie";
        standardOptions = {
            responsive: true,
            maintainAspectRatio: false
        };
        if (savedDict != null) {
            renderChart(savedDict, savedLabels, chartType, standardOptions);
        }
    }
}

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
                chartType,
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
                chartType,
                standardOptions
            );
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/users/reportsUsers");
    request.send();
}

/*
    Graph that displays reports by day of week.
*/
function renderReportByDayOfWeek() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reports = JSON.parse(request.response);
            var daysDict = {};
            var newDay = {
                label: "Reports",
                data: [0, 0, 0, 0, 0, 0, 0],
                fillColor: getRandomColor()
            };
            daysDict[0] = newDay;

            Array.from(reports).forEach(function(report) {
                const ts = report["reportTS"];

                const day = formatDate(ts, {
                    weekday: "long"
                });

                // Increment the information.
                if (day == "Sunday") {
                    daysDict[0].data[0]++;
                } else if (day == "Monday") {
                    daysDict[0].data[1]++;
                } else if (day == "Tuesday") {
                    daysDict[0].data[2]++;
                } else if (day == "Wednesday") {
                    daysDict[0].data[3]++;
                } else if (day == "Thursday") {
                    daysDict[0].data[4]++;
                } else if (day == "Friday") {
                    daysDict[0].data[5]++;
                } else {
                    daysDict[0].data[6]++;
                }
            });
            renderChart(
                daysDict,
                [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                chartType,
                standardOptions
            );
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/allReports");
    request.send();
}

/*
    Graph that displays reports by time of day
*/
function renderReportByTimeOfDay() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reports = JSON.parse(request.response);
            var daysDict = {};
            var newDay = {
                label: "Reports",
                data: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                fillColor: getRandomColor()
            };
            daysDict[0] = newDay;

            Array.from(reports).forEach(function(report) {
                const ts = report["reportTS"];

                const time = parseInt(
                    formatDate(ts, {
                        hour: "numeric",
                        hour12: false
                    })
                );
                // Increment the information.
                daysDict[0].data[time]++;
            });
            renderChart(
                daysDict,
                [
                    "0000",
                    "0100",
                    "0200",
                    "0300",
                    "0400",
                    "0500",
                    "0600",
                    "0700",
                    "0800",
                    "0900",
                    "1000",
                    "1100",
                    "1200",
                    "1300",
                    "1400",
                    "1500",
                    "1600",
                    "1700",
                    "1800",
                    "1900",
                    "2000",
                    "2100",
                    "2200",
                    "2300"
                ],
                chartType,
                standardOptions
            );
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/allReports");
    request.send();
}

/*
    Graph that displays reports by time of day by tag
*/
function renderReportByTimeOfDayTag() {
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
                        data: [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],
                        fillColor: report["color"]
                    };
                    tagsDict[tag] = newTag;
                }
                // Increment the information.
                const ts = report["reportTS"];

                const time = parseInt(
                    formatDate(ts, {
                        hour: "numeric",
                        hour12: false
                    })
                );
                // Increment the information.
                tagsDict[tag].data[time]++;
            });
            renderChart(
                tagsDict,
                [
                    "0000",
                    "0100",
                    "0200",
                    "0300",
                    "0400",
                    "0500",
                    "0600",
                    "0700",
                    "0800",
                    "0900",
                    "1000",
                    "1100",
                    "1200",
                    "1300",
                    "1400",
                    "1500",
                    "1600",
                    "1700",
                    "1800",
                    "1900",
                    "2000",
                    "2100",
                    "2200",
                    "2300"
                ],
                chartType,
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
    Graph that displays reports by Month of year
*/
function renderReportByMonthOfYear() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reports = JSON.parse(request.response);
            var daysDict = {};
            var newDay = {
                label: "Reports",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                fillColor: getRandomColor()
            };
            daysDict[0] = newDay;

            Array.from(reports).forEach(function(report) {
                const ts = report["reportTS"];

                const month = parseInt(
                    formatDate(ts, {
                        month: "numeric"
                    })
                );

                // Increment the information.
                daysDict[0].data[month]++;
            });
            renderChart(
                daysDict,
                [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ],
                chartType,
                standardOptions
            );
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/allReports");
    request.send();
}

/*
    Graph that displays reports by Attachments
*/
function renderReportByAttachments() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            reports = JSON.parse(request.response);
            var dict = {};
            var newData = {
                label: "Reports",
                data: [0, 0],
                fillColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"]
            };
            dict[0] = newData;

            Array.from(reports).forEach(function(report) {
                const attachments = report["attachments"];
                dict[0].data[parseInt(attachments)]++;
            });
            renderChart(
                dict,
                ["No Attachments", "Attachments"],
                chartType,
                standardOptions
            );
        }
    };
    request.open("POST", "https://cruzsafe.appspot.com/api/reports/allReports");
    request.send();
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
    savedDict = dict;
    savedLabels = labels;
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
