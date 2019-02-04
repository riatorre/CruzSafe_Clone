import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
//import Counter from "./components/counter";
import Counters from "./components/counters";

// Choose to render the Counter component rather than the App component!
//ReactDOM.render(<Counters />, document.getElementById("root"));
ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
