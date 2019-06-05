/*
    navLib.js
    Navigation Library
 */

var topNav = document.getElementById("topNav");
var filterOptions = document.getElementById("filterOptions");

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function toggleTopNav() {
    if (topNav != null) {
        if (topNav.className === "topnav") {
            topNav.className += " responsive";
        } else {
            topNav.className = "topnav";
        }
    }
}

function toggleFilters() {
    if (filterOptions != null) {
        if (filterOptions.className === "filterOptions") {
            filterOptions.className += " responsive";
        } else {
            filterOptions.className = "filterOptions";
        }
    }
}
