// Welcome to the land of commented code. God help us all.

import React, { Component } from "react";

// Can export and declare in same line (export default class)
class Counter extends Component {
  state = {
    count: 0
    //tags: []
    //tags: ["tag1", "tag2", "tag3"]
    //imageURL: "https://picsum.photos/200"
  }; // Contains any data the component needs.

  /*
  styles = {
    fontSize: 50,
    fontWeight: "bold"
  };
  */

  /* There is an experimental function that makes this obsolete
  constructor() {
    super();
    this.handleIncrement = this.handleIncrement.bind(this);
  }
  */

  /*
  handleIncrement = () => {
    // Arrow function is simpler than reminding all event handlers easily. MIGHT BREAK?
    //console.log("Increment Clicked", this);
    this.setState({ count: this.state.count + 1 }); // Pass object and merges with properties in state.
  };
  */

  /*
  handleIncrement() {
    console.log("Increment Clicked!"); // this.state.count is undefined in this method!!
  }
  */

  handleIncrement = product => {
    console.log(product);
    this.setState({ count: this.state.count + 1 });
  };

  /*
  // Workaround for passing argument into this. BUT MESSY. Dont need extra classes for wrappers!
  doHandleIncrement = () => {
    this.handleIncrement({ id: 1 });
  };
  */

  render() {
    // These two lines are polluting our render method! Let's throw them in a seperate method.
    //let classes = "badge m-2 badge-";
    //classes += this.state.count === 0 ? "warning" : "primary";

    return (
      <div>
        <span className={this.getBadgeClasses()}>{this.formatCount()}</span>
        <button
          onClick={() => this.handleIncrement({ id: 1 })}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>
      </div>
    );

    return (
      <div>
        {this.state.tags.length === 0 && "Please create a new tag!"}
        {/* Note the logical and operator '&&' which is applied between non-boolean values. */}
        {this.renderTags()}
      </div>
    );

    return (
      // Note how inside curly brackets can render any valid JS expression!!!
      <div>
        {/*<img src={this.state.imageURL} alt="" />*/}
        <span className={this.getBadgeClasses()}>{this.formatCount()}</span>
        {/*<span style={this.styles} className="badge badge-primary m-2">
          {this.formatCount()}
        </span>*/}
        <button className="btn btn-secondary btn-sm">Increment</button>
        {/*
        <ul>*/}
        {/* taking a string and mapping it to a plain JS object. */}
        {/* Each item in the iterator needs to have keys to keep DOMS in sync */}
        {/*{this.state.tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        */}
      </div>
    ); // JSX expression
    // Note that a JSX components need to have parents! (Babel doesn't know how to do this.)
    // So we fill it with a div.
  }
  getBadgeClasses() {
    let classes = "badge m-2 badge-";
    classes += this.state.count === 0 ? "warning" : "primary";
    return classes;
  }

  // Note we can also return JSX expressions!
  formatCount() {
    const { count } = this.state;
    return count === 0 ? "Zero" : count;
  }

  renderTags() {
    if (this.state.tags.length === 0) return <p>There are no tags!</p>;
    // Empty array
    else {
      return (
        <ul>
          {this.state.tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      );
    }
  }
}

export default Counter; // Now you can render this component in index.js!
