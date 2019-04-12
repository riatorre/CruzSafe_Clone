// Store modal in global variable for ease of handling
var modalGlobal = null;

// When the user clicks on the button, open the modal
function openModal() {
    modalGlobal.style.display = "inline-flex";
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
    modalGlobal.style.display = "none";
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
        if (modalGlobal) {
            // Checks to see if modal is open
            if (modalGlobal.style.display === "inline-flex") {
                closeModal();
            }
        }
    }
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modalGlobal.style.display = "none";
    }
};

/*  Create Modal Function
 *  Takes in the target elementId, a renderFunc and its needed data
 *  renderFunc should return the DOM that needs to be attached rather than attaching it itself
 *  Data defaults to false if empty; data is the data needed to be passed into the renderFunc if needed
 */
function createModal(elementId, renderFunc, data = false) {
    const target = document.getElementById(elementId);
    if (target) {
        if (renderFunc && typeof renderFunc == "function") {
            // Exterior Modal; basically just the gray screen
            var modal = document.createElement("DIV");
            modal.setAttribute("id", "modal");
            modal.setAttribute("class", "modal");
            // Interior Modal; where the content is placed
            var modalContent = document.createElement("DIV");
            modalContent.setAttribute("class", "modal-content animate");
            // Close Button for Modal
            var closeBtn = document.createElement("SPAN");
            closeBtn.setAttribute("id", "close");
            closeBtn.setAttribute("class", "close");
            closeBtn.setAttribute("onClick", "closeModal()");
            closeBtn.innerHTML = "&times;";
            // Append closeBtn to modalContent
            modalContent.appendChild(closeBtn);
            // After appending closeBtn, append content generated and returned by renderFunc()
            modalContent.appendChild(renderFunc(data ? data : null));
            // Append modalContent to modal
            modal.appendChild(modalContent);
            // Finally, append the modalContainer to the target Element
            modalGlobal = modal;
            target.appendChild(modal);
        } else {
            console.log("Invalid renderFunc");
        }
    } else {
        console.log("Invalid elementId");
    }
}

/*  Setup function for Modal
 *  Replaces existing modal if it exists
 */
function setupModal(elementId, renderFunc, data = false) {
    const target = document.getElementById(elementId);
    if (target) {
        if (renderFunc && typeof renderFunc == "function") {
            if (target.children.length > 0) {
                while (target.children.length > 0) {
                    target.removeChild(target.firstChild);
                }
            }
            modalGlobal = null;
            createModal(elementId, renderFunc, data ? data : null);
        } else {
            console.log("Invalid renderFunc");
        }
    } else {
        console.log("Invalid elementId");
    }
}
