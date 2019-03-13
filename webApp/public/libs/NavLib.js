/*
 * Navigation Library
 */

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function toggleTopNav() {
    var x = document.getElementById("topNav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function toggleFilters() {
    var x = document.getElementById("filterOptions");
    if (x.className === "text_box") {
        x.className += " responsive";
    } else {
        x.className = "text_box";
    }
}
