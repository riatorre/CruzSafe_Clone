function sendEmail() {
    const email = new XMLHttpRequest();
    email.onreadystatechange = function() {
        console.log("success");
    };
    email.open("POST", "https://cruzsafe.appspot.com/api/reports/email");
    email.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    email.send(null);
}