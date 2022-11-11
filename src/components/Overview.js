import React from "react";

function Overview({ tasks, deleteTask }) {
    return (
        <div>
            { 
            tasks.map((task, index) => {
                return (
                    <div key={ task.id } data-task-id={ task.id }>
                        <p style={{ display: "inline-block", paddingRight: 10}}> { index + 1} { task.text } </p>
                        <button key={ index }  onClick={ deleteTask }> Delete </button>
                    </div>
                )
            })
            }
        </div>
    )
}

export default Overview;