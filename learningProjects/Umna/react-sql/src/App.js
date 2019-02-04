import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    student:[]
  }


  componentDidMount(){
    this.getStudents();
  }

  getStudents = _ => {
    fetch('http://localhost:4600/student')
      .then(response => response.json())
      .then(response => this.setState({ student: response.data}))
      .catch(err => console.error(err))
  }

  renderStudent = (student_id, name) => {
    console.log("name is:", name)
    return (<div key={student_id}>{name.first_name}</div>)
  }


  render() {
    const {student} = this.state;

    return (
      <div className="App">
      <h1>Hello World!</h1>

      <h3> List of names from mysql </h3>
      {student.map((name, id) => this.renderStudent(id, name))}
      </div>
    );
  }
}

export default App;
