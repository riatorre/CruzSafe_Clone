import React, { Component } from "react";
import logo from "./logo.svg";
import NavBar from "./components/navbar";
import Counters from "./components/counters";
import "./App.css";

class App extends Component {
  // Code lifted from navbar.jsx
  state = {
    counters: [
      { id: 1, value: 4 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
      { id: 4, value: 0 }
    ]
  };

  // Great opportunity to initialize properties recieved from outside
  constructor() {
    super(); // call constructor of parent class
    console.log("App - Constructor");
    //this.state = this.props.something;
  }

  // Called after rendered into DOM; AJAX calls to server
  componentDidMount() {
    //Ajax Call
    //this.setState({ moves });
    console.log("App-Mounted");
  }
  handleIncrement = counter => {
    //console.log(counter);
    //const counters = [...this.state.counters]; // Objects in this array are the exact same.
    //counters[0].value++;
    //console.log(this.state.counters[0]);
    // ^ This is a NONO. Do not modify the state directly!!

    const counters = [...this.state.counters];
    const index = counters.indexOf(counter);
    counters[index] = { ...counter }; // Make your own damn copy of the counters.
    counters[index].value++;
    this.setState({ counters });
  };

  handleReset = () => {
    const counters = this.state.counters.map(c => {
      c.value = 0;
      return c;
    });
    this.setState({ counters });
  };

  handleDelete = counterId => {
    console.log("Event Handler Called", counterId);
    const counters = this.state.counters.filter(c => c.id !== counterId); // Use filter to get all counters except one we want
    this.setState({ counters });
  };

  // Note: all children rendered recursively!
  render() {
    console.log("App - Rendered");
    // Thrown-in starter template from bootstrap.
    return (
      <React.Fragment>
        <NavBar
          totalCounters={this.state.counters.filter(c => c.value > 0).length}
        />
        <main className="container">
          <Counters
            counters={this.state.counters}
            onReset={this.handleReset}
            onIncrement={this.handleIncrement}
            onDelete={this.handleDelete}
          />
        </main>
      </React.Fragment>
    );

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
