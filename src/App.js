import React, { Component } from 'react';
import Overview from './components/Overview';
import uniqid from "uniqid";


class App extends Component {
  constructor() {
    super();

    this.state = {
      taskArray: [],
      taskInput: {
        text: "", 
        id: uniqid(),
      },
      tasksTotal: 0,
    };

    this.addTask = this.addTask.bind(this);
    this.deleteClickedTask = this.deleteClickedTask.bind(this);
  }


  addTask = (e) => {
    e.preventDefault();
    this.setState({
      // taskArray: [...this.state.taskArray, this.state.taskInput],
      taskArray: this.state.taskArray.concat(this.state.taskInput),
      taskInput: {
        text: "",
        id: uniqid(),
      },
      tasksTotal: this.state.tasksTotal + 1,
    })
  }

  handleNameChange = (e) => {
    this.setState({
      taskInput: { 
        text: e.target.value,
        id: this.state.taskInput.id,
      },
    })
  }

  deleteClickedTask = (e) => {
    console.log(e.target.parentNode.getAttribute("data-task-id"));
    const clickedTaskID = e.target.parentNode.getAttribute("data-task-id");
    this.setState({
      taskArray: this.state.taskArray.filter((task) => task.id !== clickedTaskID),
      tasksTotal: this.state.tasksTotal - 1,
    })
  }

  render() {
    return (
      <div className="App">
        <form action="submit" onSubmit={ this.addTask } style={{ display: "flex"}}>
          <input type="text" id='taskInput' onChange={ this.handleNameChange } value={ this.state.taskInput.text } placeholder="Enter task here..."></input>
          <button type='submit' style={{ border: "none", background: "none", padding: 0, zIndex: 2}} ><i className="fa-solid fa-square-plus fa-2x" /></button>
        </form>
        <Overview tasks={ this.state.taskArray } deleteTask={ this.deleteClickedTask }/>
        <h2>Total Tasks</h2>
        <p>{ this.state.tasksTotal }</p>
      </div>
    );
  }

}

export default App;
