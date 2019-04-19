// Store modals && Keys in global variable for ease of handling
var modals = [];
var modalKeys = [];

// When the user clicks on the button, open the modal
function openModal(key) {
    modals[key].style.display = "inline-flex";
}

// When the user clicks on <span> (x), close the modal
function closeModal(key) {
    modals[key].style.display = "none";
}

function getModalKeys() {
    return modalKeys;
}

function getModalByKey(key) {
    return modals[key];
}

document.onkeydown = function(e) {
    e = e || window.event;
    var isEscape = false;
    if ("key" in e) {
        isEscape = e.key === "Escape" || e.key === "Esc";
    } else {
        isEscape = e.keyCode === 27;
    }
    if (isEscape) {
        // Checks to see if modal even exists
        if (modals) {
            // Checks to see if modal is open
            modals.forEach(function(element) {
                if (element.style.display === "inline-flex") {
                    document.getElementById("close").click();
                }
            });
            modalKeys.forEach(function(key) {
                closeModal(key); // If the abovecode doesn't work, just closes.
            });
        }
    }
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target.className == "modal") {
        // Checks to see if modal even exists
        if (modals) {
            // Checks to see if modal is open
            modals.forEach(function(element) {
                if (element.style.display === "inline-flex") {
                    document.getElementById("close").click();
                }
            });
            modalKeys.forEach(function(key) {
                closeModal(key); // If the abovecode doesn't work, just closes.
            });
        }
    }
};

/*  Create Modal Function
 *  Takes in the target elementId, a renderFunc and its needed data
 *  renderFunc should return the DOM that needs to be attached rather than attaching it itself
 *  Data defaults to false if empty; data is the data needed to be passed into the renderFunc if needed
 */
function createModal(elementId, key, renderFunc, data = false) {
    const target = document.getElementById(elementId);
    if (target) {
        if (renderFunc && typeof renderFunc == "function") {
            // Exterior Modal; basically just the gray screen
            var modal = document.createElement("DIV");
            modal.setAttribute("id", key);
            modal.setAttribute("class", "modal");
            // Interior Modal; where the content is placed
            var modalContent = document.createElement("DIV");
            modalContent.setAttribute("class", "modal-content animate");
            // Close Button for Modal
            var closeBtn = document.createElement("SPAN");
            closeBtn.setAttribute("id", "close");
            closeBtn.setAttribute("class", "close");
            closeBtn.setAttribute("onClick", "closeModal('" + key + "')");
            closeBtn.innerHTML = "&times;";
            // Append closeBtn to modalContent
            modalContent.appendChild(closeBtn);
            // After appending closeBtn, append content generated and returned by renderFunc()
            modalContent.appendChild(renderFunc(data ? data : null));
            // Append modalContent to modal
            modal.appendChild(modalContent);
            // Finally, append the modalContainer to the target Element
            modals[key] = modal;
            modalKeys.push(key);
            target.appendChild(modal);
        } else {
            console.log("Invalid renderFunc");
        }
    } else {
        console.log("Invalid elementId");
    }
}

/*  Setup function for Modal
 *  Replaces existing modal if it exists @ elementId
 */
function setupModal(elementId, key, renderFunc, data = false) {
    const target = document.getElementById(elementId);
    if (target) {
        if (key != null) {
            if (renderFunc && typeof renderFunc == "function") {
                // If Modal with key exists & its parent is not the target, remove it from the document.
                if (modals[key] != null && modals[key].parentNode != target) {
                    modals[key].parentNode.removeChild(modals[key]);
                }
                // If target has any children, remove them; includes previous modal
                if (target.children.length > 0) {
                    while (target.children.length > 0) {
                        if (target.firstChild.className == "modal") {
                            var index = modals.indexOf(target.firstChild);
                            modals[index] = null;
                            modalKeys.splice(index, 1);
                        }
                        target.removeChild(target.firstChild);
                    }
                }
                modals[key] = null;
                createModal(elementId, key, renderFunc, data ? data : null);
            } else {
                console.log("Invalid renderFunc");
            }
        } else {
            console.log("Please supply a Key for the Modal");
        }
    } else {
        console.log("Invalid elementId");
    }
}
