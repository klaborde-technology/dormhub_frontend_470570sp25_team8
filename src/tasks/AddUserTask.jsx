import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";
import { API_BASE_URL } from '../api';

export default function AddUserTask() {
    const navigate = useNavigate();

    const [userTask, setUserTask] = useState({
        deadline: "",
        status: "In-progress",
        userId: "",
        taskId: "",
    });

    const { deadline, status, userId, taskId } = userTask;

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
                    headers: AuthService.getAuthHeader(),
                });
                setUsers(usersResponse.data);

                const tasksResponse = await axios.get(`${API_BASE_URL}/tasks`, {
                    headers: AuthService.getAuthHeader(),
                });
                setTasks(tasksResponse.data);
            } catch (error) {
                console.error("Error fetching users or tasks:", error);
            }
        };

        fetchData();
    }, []);

    const onInputChange = (e) => {
        setUserTask({ ...userTask, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const taskData = {
                deadline,
                status: false,
                user: { id: userId },
                task: { id: taskId },
            };

            await axios.post(`${API_BASE_URL}/usertask`, taskData, {
                headers: AuthService.getAuthHeader(),
            });
            navigate("/admintasks");
        } catch (error) {
            console.error("Error adding UserTask:", error);
        }
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center"
            style={{
                background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
                minHeight: "100vh",
                paddingTop: "80px",
                paddingBottom: "20px",
            }}
        >
            <div
                className="card shadow p-4 w-100"
                style={{
                    maxWidth: "420px",
                    borderRadius: "16px",
                    backgroundColor: "#ffffffdd",
                    backdropFilter: "blur(6px)"
                }}
            >
                <div className="text-center mb-1">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1734/1734797.png"
                        alt="Clipboard Icon"
                        width="95"
                        className="mb-1"
                    />
                    <h3 className="text-purple fw-bold mt-1" style={{ color: "#6f42c1" }}>
                        Assign Task to User
                    </h3>
                </div>


                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="User" className="form-label">Select User</label>
                        <select
                            className="form-select"
                            name="userId"
                            value={userId}
                            onChange={onInputChange}
                            required
                        >
                            <option value="">Choose a User</option>

                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.username})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Task" className="form-label">Select Task</label>
                        <select
                            className="form-select"
                            name="taskId"
                            value={taskId}
                            onChange={onInputChange}
                            required
                        >
                            <option value="">Choose a Task</option>
                            {tasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                    {task.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Deadline" className="form-label">Deadline</label>
                        <input
                            type="date"
                            className="form-control"
                            name="deadline"
                            value={deadline}
                            onChange={onInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Status" className="form-label">Status</label>
                        <select
                            className="form-select"
                            name="status"
                            value={status}
                            onChange={onInputChange}
                            disabled
                        >
                            <option value="In-progress">In-progress</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="btn w-100 rounded-3 d-flex justify-content-center align-items-center gap-2"
                        style={{
                            backgroundColor: "#6f42c1",
                            borderColor: "#6f42c1",
                            color: "#fff",
                        }}
                    >
                        Submit
                    </button>

                    <Link
                        to="/admintasks"
                        className="btn w-100 rounded-3 mt-2 d-flex justify-content-center align-items-center gap-2"
                        style={{
                            backgroundColor: "#dc3545",
                            borderColor: "#dc3545",
                            color: "#fff",
                        }}
                    >
                        Cancel
                    </Link>
                </form>
            </div>
        </div>
    );
}