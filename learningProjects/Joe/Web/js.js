function myFunction() {
    const s = document.getElementById("button").innerText;
    if(s === "Hello JavaScript!"){
        document.getElementById("button").innerHTML= "Click again"
    }else{
        document.getElementById("button").innerHTML= "Hello JavaScript!"
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var x = document.getElementById("location");
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

function myMap(position) {
    //var myLatLng = {lat: -25.363, lng: 131.044};
    var mapProp= {
        center:new google.maps.LatLng(36.9635009,-122.0579688),
        zoom:15,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
    let pos;
    pos = new google.maps.LatLng(36.9635009, -122.0579688);
    var mark = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Hello World!'
    });
}
