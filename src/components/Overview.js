import React from "react";

function Overview({ tasks, deleteTask, setTaskEdit, addEditedTask, handleEditChange}) {
    return (
        <div className="taskList">
            { 
            tasks.map((task, index) => {
                return (
                    <div key={ task.id } data-task-id={ task.id }>
                        { task.editState 
                            ? 
                            <div style={{ display: "inline-block"}}>
                                <label>{ index + 1 }) </label>
                                <input id={ `task${index}` } placeholder="Edit text here..." onChange={ handleEditChange }></input>
                                <p style={{ display: "inline-block", paddingRight: 10}}> (Current: { task.text }) </p>

                            </div> 
                            : 
                            <p style={{ display: "inline-block", paddingRight: 10}}> { index + 1}) { task.text } </p>
                        }
                        { task.editState 
                            ? 
                            <button onClick={ addEditedTask } style={{ border: "none", background: "none", paddingLeft: 5, zIndex: 2}} className="fa-solid fa-square-plus"> </button> 
                            :
                            <button onClick={ setTaskEdit } style={{ border: "none", background: "none", paddingLeft: 5, zIndex: 2}} className="material-icons" >
                                edit
                            </button>
                        }
                        { task.editState 
                            ? 
                            <button onClick={ setTaskEdit } style={{ border: "none", background: "none", padding: 0, zIndex: 2}} className="fa-regular fa-rectangle-xmark"> </button>
                            :
                            <button onClick={ deleteTask } style={{ border: "none", background: "none", padding: 0, zIndex: 2}} className="material-icons" >
                                delete
                             </button>
                        }

                        
                    </div>
                )
            })
            }
        </div>
    )
}

// function task

export default Overview;
