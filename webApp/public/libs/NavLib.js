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
