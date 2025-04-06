import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function EditTask() {
    const { id } = useParams();

    const [task, setTask] = useState({
        username: "",
        email: "",
        task: "",
        deadline: "",
        status: "",

    });
    
    
    const { username, email, task: taskName, deadline, status } = task;

    const onInputChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadTask();
    }, []);

    const loadTask = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/api/task/${id}`);
            setTask(result.data);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };


    return (
        <div className="custom-container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">

                    <div className="purple-bar">Edit Task</div>

                    <div className="card">
                        <div className="card-header">
                            <h3>Account Info:</h3>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter username"
                                        name="username"
                                        value={username}
                                        onChange={onInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter email"
                                        name="email"
                                        value={email}
                                        onChange={onInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="task" className="form-label">Task</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter task"
                                        name="task"
                                        value={taskName}
                                        onChange={onInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="deadline" className="form-label">Deadline</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="deadline"
                                        value={deadline}
                                        onChange={onInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        name="status"
                                        value={status}
                                        onChange={onInputChange}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Completed">Completed</option>
                                        <option value="In Progress">In Progress</option>
                                    </select>
                                </div>
                                <button type="submit" className='btn btn-primary' >Update</button>
                                <Link className="btn btn-danger mx-2" to={"/"}>Cancel</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}