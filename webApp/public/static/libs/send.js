/*
    send.js
    API meant to send an email
*/

function sendEmail() {
    const email = new XMLHttpRequest();
    email.onreadystatechange = function() {
        console.log("success");
    };
    email.open(
        "POST",
        "https://cruzsafe.appspot.com/api/facilities/emailNotification"
    );
    email.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    email.send(null);
}
