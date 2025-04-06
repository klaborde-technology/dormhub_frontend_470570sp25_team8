import React, { use, useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function ViewTask() { 

    const [task, setTask] = useState(null); // Initialize task as null

    const { id } = useParams();

    useEffect(() => {
        // Fetch task based on ID
        const fetchTask = async () => {
          try {
            const result = await axios.get(`http://localhost:8080/api/task/${id}`); // Replace with actual endpoint
            setTask(result.data); // Store fetched task data
          } catch (error) {
            console.error('Error fetching task:', error);
          }
        };
        fetchTask();
      }, [id]);

    if (!task) {
        return <div>Task not found!</div>;
    }
    
    
    const getStatusStyle = (status) => {
        if (status == "Completed") {
            return { color: "green" }
        } else if (status == "In Progress") {
            return { color: "yellow" };
        }
        return {};
    }
    

    return (
        <div className="custom-container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">

                <div className="purple-bar">View Task</div>

                    <div className="card">
                        <div className="card-header">
                            <h5>Account Info:</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <b>Username:    </b>
                                    {task.username}
                                </li>
                                <li className="list-group-item">
                                    <b>Email:   </b>
                                    {task.email}
                                </li>
                                <h5>Task Info:</h5>
                                <li className="list-group-item">
                                    <b>Task Name:   </b>
                                    {task.task}

                                </li>
                                <li className="list-group-item">
                                    <b>Task Deadline:   </b>
                                    {task.deadline}

                                </li>
                                <li className="list-group-item">
                                    <b>Task Status: </b>
                                    {task.status}

                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link className="btn btn-primary my-2" to={"/"}>Return</Link>
                </div>
            </div>
        </div>
    )
}