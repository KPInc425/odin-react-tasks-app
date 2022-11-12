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
        editState: false,
      },
      editInput: "",
      tasksTotal: 0,
    };

    // this.addTask = this.addTask.bind(this);
    // this.deleteClickedTask = this.deleteClickedTask.bind(this);
    // this.makeTaskEditable = this.makeTaskEditable.bind(this);
  }


  addTask = (e) => {
    e.preventDefault();
    this.setState({
      // taskArray: [...this.state.taskArray, this.state.taskInput],
      taskArray: this.state.taskArray.concat(this.state.taskInput),
      taskInput: {
        text: "",
        id: uniqid(),
        editState: false,
      },
      tasksTotal: this.state.tasksTotal + 1,
    })
  }

  handleNameChange = (e) => {
    this.setState({
      taskInput: { 
        text: e.target.value,
        id: this.state.taskInput.id,
        editState: this.state.taskInput.editState
      },
    })
  }

  handleEditChange = (e) => {
    console.log(e.target.value);
    this.setState({
      editInput: e.target.value
    })
  }

  deleteClickedTask = (e) => {
    // console.log(e.target.parentNode.getAttribute("data-task-id"));
    const clickedTaskID = e.target.parentNode.getAttribute("data-task-id");
    this.setState({
      taskArray: this.state.taskArray.filter((task) => task.id !== clickedTaskID),
      tasksTotal: this.state.tasksTotal - 1,
    })
  }

  makeTaskEditable = (e) => {
    // console.log(e.target.parentNode.getAttribute("data-task-id"));
    const clickedTaskID = e.target.parentNode.getAttribute("data-task-id");
    
    
    let tmpArray = [].concat(this.state.taskArray);
    console.log(tmpArray);
    // Reset editState for other tasks that may be selected
    tmpArray = this.resetEditStates(tmpArray);
    console.log(tmpArray);
    const oldTask = this.findTask(clickedTaskID);
    const taskIndex = this.findIndex(clickedTaskID);
    const editableTask = {...oldTask, editState: !oldTask.editState};
    tmpArray[taskIndex] = editableTask;


    this.setState({
      taskArray: tmpArray,
    })
  }

  resetEditStates = (tmpArray) => {
    return tmpArray.map((task) => {
      console.log(task);
      return {
        ...task,
        editState: false
      }
    })
  }

  findIndex = (id) => {
    return this.state.taskArray.findIndex((task) => task.id === id);
  }

  findTask = (id) => {
    return this.state.taskArray.find(task => task.id === id);
  }

  addEditedTask = (e) => {
    console.log(e.target);

    const editedTaskId = e.target.parentNode.getAttribute("data-task-id");
    let tmpArray = [].concat(this.state.taskArray);



    const taskToEdit = this.findTask(editedTaskId);
    const taskIndex = this.findIndex(editedTaskId);

    const editedTask = {...taskToEdit, text: this.state.editInput};

    tmpArray[taskIndex] = editedTask;
    tmpArray = this.resetEditStates(tmpArray);

    this.setState({
      taskArray: tmpArray,
      editInput: "",
    })
  }

  render() {
    return (
      <div className="App">
        <form action="submit" onSubmit={ this.addTask } style={{ display: "flex"}}>
          <input type="text" id='taskInput' onChange={ this.handleNameChange } value={ this.state.taskInput.text } placeholder="Enter task here..."></input>
          <button type='submit' style={{ border: "none", background: "none", padding: 0, zIndex: 2}} ><i className="fa-solid fa-square-plus fa-2x" /></button>
        </form>
        <Overview tasks={ this.state.taskArray } deleteTask={ this.deleteClickedTask } setTaskEdit={ this.makeTaskEditable } addEditedTask={ this.addEditedTask } handleEditChange={ this.handleEditChange }/>
        <h2>Total Tasks</h2>
        <p>{ this.state.tasksTotal }</p>
      </div>
    );
  }

}

export default App;
