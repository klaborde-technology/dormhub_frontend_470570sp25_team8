// EditUserTask.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from "../auth/AuthService";
import { API_BASE_URL } from '../api';

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
            const result = await axios.get(`${API_BASE_URL}/usertask/${id}`, {
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
            await axios.put(`${API_BASE_URL}/usertask/${id}`, payload, {
                headers: AuthService.getAuthHeader(),
            });
            navigate("/admintasks"); // Return to the dashboard after update
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div
            className="container-fluid py-5 px-3"
            style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                minHeight: "100vh",
                marginTop: "60px",
                paddingTop: "20px",
            }}
        >
            <div className="container bg-white bg-opacity-75 rounded-4 shadow-lg p-4">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-primary-emphasis">Edit User Task</h2>
                </div>

                <div className="mb-5 p-3 rounded-4 border" style={{ borderColor: "#6a11cb", backgroundColor: "#f2f3f5" }}>
                    <form onSubmit={onSubmit}>
                        <div className="mb-4">
                            <label htmlFor="deadline" className="form-label fw-semibold">
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

                        <div className="mb-4">
                            <label htmlFor="status" className="form-label fw-semibold">
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

                        <div className="d-flex justify-content-center gap-3">
                            <button type="submit" className="btn btn-primary px-4">
                                Update
                            </button>
                            <Link to="/admintasks" className="btn btn-danger px-4">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}