const coastalCampus = document.getElementById("coastalCampusMap");
const mainCampus = document.getElementById("mainCampusMap");

coastalCampus.setAttribute(
    "src",
    "https://www.google.com/maps/embed/v1/place?q=36.9530384,-122.0671123&key=" +
        aPIKey
);
mainCampus.setAttribute(
    "src",
    "https://www.google.com/maps/embed/v1/place?q=36.9916,-122.0583&key=" +
        aPIKey
);
