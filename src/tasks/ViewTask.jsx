import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
// import { API_BASE_URL } from '../api';

export default function ViewTask() {

    const users = [
        { id: 1, username: 'JohnDoe', email: 'john@example.com', task: 'Clean Bed', deadline: '2025-04-03', status: 'In-Progress' },
        { id: 2, username: 'JaneSmith', email: 'jane@example.com', task: 'Clean Toilet', deadline: '2025-04-05', status: 'Completed' },
      ];

    const [task, setTask] = useState(null); // Initialize task as null

    const { id } = useParams();
    
    /*
    const [task, setTask] = useState({
        name: "",
        deadline: "",
        status: "",
        user: {}
    });
    */
    
    useEffect(() => {
        // Find the task based on the `id` from the URL
        const foundTask = users.find(user => user.id === parseInt(id));
        if (foundTask) {
          setTask(foundTask); // Set the task data into the state
        } else {
          console.log("Task not found!");
        }
    }, [id]);

    if (!task) {
        return <div>Task not found!</div>;
    }

    /*
    const loadTask = async () => {
        try {
            const result = await axios.get(`${API_BASE_URL}/task/${id}`);
            setTask(result.data);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
        
    }
    */
    
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