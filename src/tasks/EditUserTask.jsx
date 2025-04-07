// EditUserTask.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from "../auth/AuthService";

export default function EditUserTask() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Local state only for deadline and status
    const [task, setTask] = useState({
        deadline: "",
        status: "false", // will use string value; later convert to boolean
    });

    const onInputChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadTask();
    }, []);

    const loadTask = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/usertask/${id}`, {
                headers: AuthService.getAuthHeader(),
            });
            // Assuming result.data contains fields: deadline and status
            setTask({
                deadline: result.data.deadline,
                status: result.data.status.toString(), // convert boolean to string for the select
            });
        } catch (error) {
            console.error("Error loading user task:", error);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                deadline: task.deadline,
                status: task.status === "true", // convert back to boolean
            };
            await axios.put(`http://localhost:8080/usertask/${id}`, payload, {
                headers: AuthService.getAuthHeader(),
            });
            navigate("/admintasks"); // Return to the dashboard after update
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div className="custom-container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Edit Task</h2>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="deadline" className="form-label">
                                Deadline
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                name="deadline"
                                value={task.deadline}
                                onChange={onInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <select
                                className="form-select"
                                name="status"
                                value={task.status}
                                onChange={onInputChange}
                                required
                            >
                                <option value="false">In-progress</option>
                                <option value="true">Completed</option>
                            </select>
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