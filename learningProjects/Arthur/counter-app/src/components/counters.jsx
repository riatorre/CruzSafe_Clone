// New component!

import React, { Component } from "react";
import Counter from "./counter";

class Counters extends Component {
  // state = {
  //   counters: [
  //     { id: 1, value: 4 },
  //     { id: 2, value: 0 },
  //     { id: 3, value: 0 },
  //     { id: 4, value: 0 }
  //   ]
  // };

  // handleIncrement = counter => {
  //   //console.log(counter);
  //   //const counters = [...this.state.counters]; // Objects in this array are the exact same.
  //   //counters[0].value++;
  //   //console.log(this.state.counters[0]);
  //   // ^ This is a NONO. Do not modify the state directly!!

  //   const counters = [...this.state.counters];
  //   const index = counters.indexOf(counter);
  //   counters[index] = { ...counter }; // Make your own damn copy of the counters.
  //   counters[index].value++;
  //   this.setState({ counters });
  // };

  // handleReset = () => {
  //   const counters = this.state.counters.map(c => {
  //     c.value = 0;
  //     return c;
  //   });
  //   this.setState({ counters });
  // };

  // handleDelete = counterId => {
  //   console.log("Event Handler Called", counterId);
  //   const counters = this.state.counters.filter(c => c.id !== counterId); // Use filter to get all counters except one we want
  //   this.setState({ counters });
  // };

  render() {
    const { onReset, counters, onDelete, onIncrement } = this.props; // Makes code much cleaner
    console.log("Counters - Rendered");

    return (
      <div>
        <button onClick={onReset} className="btn btn-primary btn-sm m-2">
          Reset
        </button>
        {counters.map(counter => (
          <Counter
            key={counter.id}
            onDelete={onDelete}
            onIncrement={onIncrement}
            counter={counter}
          >
            {/* Modified and chagned onto counter. Now just call counter.blah. */}
            <h4>Counter #{counter.id}</h4>
          </Counter>
        ))}
        {/*<Counter />
        <Counter />
        <Counter />
        <Counter />*/}
      </div>
    );
  }
}

export default Counters;
