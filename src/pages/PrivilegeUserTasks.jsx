import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";
import { API_BASE_URL } from "../api";
import { FaCheckCircle, FaRegCircle, FaTrash, FaEye } from "react-icons/fa";

const PrivilegeUserTasks = () => {
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const { id } = useParams();
    const userId = AuthService.getUserId();
    const navigate = useNavigate();

    useEffect(() => {
        if (String(id) !== String(userId)) {
            navigate("/unauthorized", { replace: true });
        }
    }, [id, userId, navigate]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const headers = { headers: AuthService.getAuthHeader() };
            const [inProgressResponse, completedResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/usertasks/user/${userId}?status=false`, headers),
                axios.get(`${API_BASE_URL}/usertasks/user/${userId}?status=true`, headers)
            ]);
            const inProgressTasksWithIndex = inProgressResponse.data
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .map((task, index) => ({ ...task, originalIndex: task.originalIndex || index + 1 }));

            const completedTasksWithIndex = completedResponse.data
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .map((task, index) => ({ ...task, originalIndex: task.originalIndex || index + 1 }));

            setInProgressTasks(inProgressTasksWithIndex);
            setCompletedTasks(completedTasksWithIndex);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const toggleTaskStatus = async (taskId, currentStatus, deadline) => {
        try {
            await axios.put(
                `${API_BASE_URL}/usertask/${taskId}`,
                { status: !currentStatus, deadline },
                { headers: AuthService.getAuthHeader() }
            );
            fetchTasks();
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`${API_BASE_URL}/usertask/${taskId}`, {
                headers: AuthService.getAuthHeader(),
            });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const renderTable = (tasks) => {
        return (
            <div className="table-responsive d-none d-md-block">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Task Name</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.originalIndex}</td>
                                    <td>{task.task.name}</td>
                                    <td>{task.deadline}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="form-check-input toggle-modern"
                                            checked={task.status}
                                            disabled={AuthService.getUserRole() !== "PRIVILEGED_USER"}
                                            onChange={() =>
                                                toggleTaskStatus(task.id, task.status, task.deadline)
                                            }
                                        />
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link to={`/viewusertask/${task.id}`} className="btn btn-primary btn-sm view-btn">
                                                <FaEye />
                                            </Link>
                                            {AuthService.getUserRole() === "ADMIN" && (
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => deleteTask(task.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">No tasks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderCards = (tasks) => {
        return (
            <div className="d-md-none">
                <div className="row g-3">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div key={task.id} className="col-12">
                                <div className="card shadow-lg border-0 rounded-4 card-hover">
                                    <div className="card-body">
                                        <p className="mb-1"><strong>#</strong> {task.originalIndex}</p>
                                        <h5 className="card-title d-flex align-items-center gap-2">
                                            {task.status ? (
                                                <FaCheckCircle className="text-success" />
                                            ) : (
                                                <FaRegCircle className="text-warning" />
                                            )}
                                            {task.task.name}
                                        </h5>
                                        <p className="mb-2"><strong>Deadline:</strong> {task.deadline}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input toggle-modern"
                                                    checked={task.status}
                                                    disabled={AuthService.getUserRole() !== "PRIVILEGED_USER"}
                                                    onChange={() =>
                                                        toggleTaskStatus(task.id, task.status, task.deadline)
                                                    }
                                                />
                                                <label className="form-check-label">
                                                    Mark as {task.status ? "In Progress" : "Completed"}
                                                </label>
                                            </div>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Link to={`/viewusertask/${task.id}`} className="btn btn-primary btn-sm view-btn">
                                                    <FaEye />
                                                </Link>
                                                {AuthService.getUserRole() === "ADMIN" && (
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => deleteTask(task.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted">No tasks found.</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div
            className="container-fluid py-5 px-3"
            style={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)", // Sleek gradient background
                minHeight: "100vh",
            }}
        >
            <div className="container bg-white bg-opacity-75 rounded-4 shadow-lg p-4">

                {/* In-Progress Tasks */}
                <div className="mb-5 p-3 rounded-4 border" style={{ borderColor: "#6a11cb", backgroundColor: "#f2f3f5" }}>
                    <h2 className="text-center fw-semibold fs-4 border-bottom pb-2 mb-4 text-dark-emphasis">
                        In-Progress Tasks
                    </h2>
                    {renderTable(inProgressTasks)}
                    {renderCards(inProgressTasks)}
                </div>

                {/* Completed Tasks */}
                <div className="p-3 rounded-4 border" style={{ borderColor: "#6a11cb", backgroundColor: "#f2f3f5" }}>
                    <h2 className="text-center fw-semibold fs-4 border-bottom pb-2 mb-4 text-dark-emphasis">
                        Completed Tasks
                    </h2>
                    {renderTable(completedTasks)}
                    {renderCards(completedTasks)}
                </div>
            </div>
        </div>
    );
};

export default PrivilegeUserTasks;
