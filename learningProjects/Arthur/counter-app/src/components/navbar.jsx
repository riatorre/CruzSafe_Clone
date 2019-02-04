import React, { Component } from "react";

// Stateless, functional component, not using a class, but a function!
// Purely for design for stateless components.

// React passes props to this funciton at runtime.
// Object destructuring.
const Navbar = ({ totalCounters }) => {
  // Return a react element!
  return (
    <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="#">
        Navbar{" "}
        <span className="badge badge-pill badge-secondary">
          {totalCounters}
        </span>
      </a>
    </nav>
  );
};

export default Navbar;

/*
class NavBar extends Component {
  //state = {};
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Navbar{" "}
          <span className="badge badge-pill badge-secondary">
            {this.props.totalCounters}
          </span>
        </a>
      </nav>
    );
  }
}
*/

//export default NavBar;
