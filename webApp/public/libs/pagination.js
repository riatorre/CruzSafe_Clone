/*
 *  pagination.js
 *  Functions that are used to initialize and maintain pagination on a page.
 *  requires at least 2 buttons with ids "nextBtn" and "prevBtn" to handle transitions within parent page.
 *  may also use buttons with ids "firstBtn" and "lastBtn" to instantly navigate to first or last pages.
 *
 *  Pages are inserted at designated 'id' passed in from createPages();
 *  Page Indicators are inserted at id = (pagesId+Indicators), where pagesId is the id above; essentially, it is assumed that
 *  both destinations have the same root id
 */

// Definition of variables needed
var currentTab = 0;

// --- Navigation & Display Functions ---

// Shows tab at number n; numering is based off of array index
function showTab(n) {
    var x = document.getElementsByClassName("tab");
    var y = document.getElementsByClassName("indicator");
    if (x != null && x.length > 0) {
        x[n].style.display = "block";
        /*// Hides btns depending if on first or last page
        if (n == 0) {
            document.getElementById("firstBtn").style.display = "none";
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("firstBtn").style.display = "inline";
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n == x.length - 1) {
            document.getElementById("lastBtn").style.display = "none";
            document.getElementById("nextBtn").style.display = "none";
        } else {
            document.getElementById("lastBtn").style.display = "inline";
            document.getElementById("nextBtn").style.display = "inline";
        }//*/
        // Displays indicator based on page
        if (y.length > 5) {
            for (var i = 0; i < y.length; i++) {
                y[i].style.display = "none";
                y[i].className = y[i].className.replace(" active", "");
            }
            if (n < 3) {
                for (var i = 0; i < 5; i++) {
                    y[i].style.display = "inline-block";
                }
            } else if (n > y.length - 4) {
                for (var i = y.length - 1; i > y.length - 6; i--) {
                    y[i].style.display = "inline-block";
                }
            } else {
                for (var i = n - 2; i <= n + 2; i++) {
                    y[i].style.display = "inline-block";
                }
            }
        } else {
            for (var i = 0; i < y.length; i++) {
                y[i].style.display = "inline-block";
            }
        }
        y[n].className += " active";
    }
}

/*
 *  Navigate 'n' pages; 'n' is an integer
 *  Primarily used by 'nextBtn' and 'prevBtn', but may be used by others
 */
function nextPrev(n) {
    var x = document.getElementsByClassName("tab");
    if (x != null && x.length > 0) {
        x[currentTab].style.display = "none";
        currentTab = currentTab + n;
        if (currentTab < 0) {
            // fixes currentTab if value somehow ends up below index 0
            currentTab = 0;
        } else if (currentTab >= x.length) {
            // fixes currentTab if value ends up above number of pages that exist
            currentTab = x.length - 1;
        }
        showTab(currentTab);
    }
}

/*
 *  function used to navigate to the very first or very last page
 */
function firstLast(target) {
    var x = document.getElementsByClassName("tab");
    if (x != null && x.length > 0) {
        x[currentTab].style.display = "none";
        if (target === "first") {
            currentTab = 0;
        } else if (target === "last") {
            currentTab = x.length - 1;
        } else {
            console.log("[ERROR] input invalid");
            return -1;
        }
        showTab(currentTab);
    }
}

/*
 *  Jump to page number if it is within bounds
 */
function jumpTo(target) {
    var x = document.getElementsByClassName("tab");
    if (x != null && x.length > 0 && target >= 0 && target < x.length) {
        x[currentTab].style.display = "none";
        currentTab = target;
        showTab(currentTab);
    }
}

// --- Initialization Functions ---

// Create a List for current tab from start and end indices of elementArray
// Utilizes a passed in renderFunc, which is assumed to return the final DOM object rather than append to somewhere
function createList(start, end, elementArray, renderFunc) {
    var list = document.createElement("DIV");
    list.setAttribute("class", "tab");
    for (var i = start; i < end; i++) {
        list.appendChild(renderFunc(elementArray[i]));
    }
    return list;
}

// Create a set of tabs, with number of reports set to a max of maxElemPerPage for each tab
// accepts element ID as id, all elements & their information passed as an array of objects, and
// a function used to define how to render the info (renderFunc)
function createPages(id, maxElemPerPage, elementArray, renderFunc) {
    var upperBound = 0;
    var totalPages = document.createElement("DIV");
    var totalIndicators = document.createElement("DIV");
    var numElem = elementArray.length;
    totalPages.setAttribute("id", "totalPages");
    totalIndicators.setAttribute("id", "totalIndicators");
    if (numElem > 0) {
        for (
            var lowerBound = 0;
            lowerBound < numElem;
            lowerBound += maxElemPerPage
        ) {
            var indicator = document.createElement("a");
            indicator.setAttribute("class", "indicator");
            if (numElem - lowerBound < maxElemPerPage) {
                // Will create a partially empty page
                upperBound = numElem;
            } else {
                // Will create a full page
                upperBound += maxElemPerPage;
            }
            indicator.innerHTML = lowerBound / maxElemPerPage + 1;
            indicator.setAttribute(
                "onClick",
                "jumpTo(" + lowerBound / maxElemPerPage + ")"
            );
            totalPages.appendChild(
                createList(lowerBound, upperBound, elementArray, renderFunc)
            );
            totalIndicators.appendChild(indicator);
        }
    } else {
        totalPages.innerHTML =
            "<p>No reports found. If filters are present, please revise your filters. Otherwise, please contact technical support.</p>";
    }
    document.getElementById(id).appendChild(totalPages);
    document.getElementById(id + "Indicators").appendChild(totalIndicators);
}

/*
 *  Function used to clear all pages and indicators from the page.
 *  Used to ensure pages are properly maintained.
 */
function clearPages() {
    document.getElementById("totalPages").remove();
    document.getElementById("totalIndicators").remove();
}
