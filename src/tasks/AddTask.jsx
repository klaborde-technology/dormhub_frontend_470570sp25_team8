import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService"; // Import AuthService
import { API_BASE_URL } from "../api"; // Adjust the API base URL accordingly

export default function AddTask() {
    const navigate = useNavigate();

    // State to store task name
    const [task, setTask] = useState({ name: "" });
    const { name } = task;

    const onInputChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/task`, task, {
                headers: {
                    ...AuthService.getAuthHeader(),
                    "Content-Type": "application/json", // Explicit content type
                },
            });
            navigate("/admintasks"); // Redirect to tasks list
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div className="custom-container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add New Task</h2>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="TaskName" className="form-label">
                                Task Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={onInputChange}
                                required
                                placeholder="Enter Task Name"
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/admintasks">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}