// My first application yay!

import React from "react"; // Kinda important
import ReactDOM from "react-dom"; // doing the DOM work.

const element = <h1>Hello World</h1>; // BABEL will deal with this.
console.log(element); // Hot module changes! Don't need to refresh to see changes!

// Time to render it. now we use ReactDOM.
ReactDOM.render(element, document.getElementById("root"));
