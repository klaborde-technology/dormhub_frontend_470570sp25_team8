import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthService from "../auth/AuthService";
import { API_BASE_URL } from '../api';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const AdminUserTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [filteredDeadlines, setFilteredDeadlines] = useState([]);
    const [filteredTaskNames, setFilteredTaskNames] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedDeadline, setSelectedDeadline] = useState("");
    const [selectedTaskName, setSelectedTaskName] = useState("");

    const fetchTasks = async () => {
        try {
            const inProgressResponse = await axios.get(
                `${API_BASE_URL}/usertasks?status=false`,
                { headers: AuthService.getAuthHeader() }
            );
            const completedResponse = await axios.get(
                `${API_BASE_URL}/usertasks?status=true`,
                { headers: AuthService.getAuthHeader() }
            );
            const combinedTasks = [...inProgressResponse.data, ...completedResponse.data];
            setTasks(combinedTasks);
            setInProgressTasks(inProgressResponse.data);
            setCompletedTasks(completedResponse.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const fetchPrivilegedUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: AuthService.getAuthHeader()
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching privileged users:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchPrivilegedUsers();
    }, []);

    useEffect(() => {
        const filteredTasks = tasks
            .filter((task) => (selectedUser ? task.user.username === selectedUser : true))
            .filter((task) => (selectedDeadline ? task.deadline === selectedDeadline : true))
            .filter((task) => (selectedTaskName ? task.task.name === selectedTaskName : true));

        setFilteredDeadlines([...new Set(filteredTasks.map((task) => task.deadline))]);
        setFilteredTaskNames([...new Set(filteredTasks.map((task) => task.task.name))]);
    }, [selectedUser, selectedDeadline, selectedTaskName, tasks]);

    const filterTasks = (tasksToFilter) => {
        return tasksToFilter
            .filter((task) => (selectedUser ? task.user.username === selectedUser : true))
            .filter((task) => (selectedDeadline ? task.deadline === selectedDeadline : true))
            .filter((task) => (selectedTaskName ? task.task.name === selectedTaskName : true));
    };

    const renderTable = (tasksToRender) => {
        return (
            <div className="table-responsive d-none d-md-block">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>User Name</th>
                            <th>Task</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasksToRender.length > 0 ? (
                            tasksToRender.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.user.username}</td>
                                    <td>{task.task.name}</td>
                                    <td>{task.deadline}</td>
                                    <td>
                                        <Link to={`/viewusertask/${task.id}`} className="btn btn-info btn-sm me-1">View</Link>
                                        <Link to={`/editusertask/${task.id}`} className="btn btn-warning btn-sm me-1">Edit</Link>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No tasks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderCard = (tasksToRender) => {
        return (
            <div className="row">
                {tasksToRender.length > 0 ? (
                    tasksToRender.map((task) => (
                        <div key={task.id} className="col-12 col-md-6 col-lg-4 mb-3">
                            <div className="card" style={{ borderColor: "#6a11cb" }}>
                                <div className="card-body">
                                    <h5 className="card-title">{task.task.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{task.user.username}</h6>
                                    <p className="card-text">
                                        <strong>Deadline:</strong> {task.deadline}
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/viewusertask/${task.id}`} className="btn btn-outline-primary btn-sm">
                                            <FaEye />
                                        </Link>
                                        <Link to={`/editusertask/${task.id}`} className="btn btn-outline-warning btn-sm">
                                            <FaEdit />
                                        </Link>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteTask(task.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No tasks found.</p>
                    </div>
                )}
            </div>
        );
    };

    const deleteTask = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete the assigned task?");

        if (!isConfirmed) return;

        try {
            await axios.delete(`${API_BASE_URL}/usertask/${id}`, { headers: AuthService.getAuthHeader() });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="container-fluid py-5 px-3" style={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            minHeight: "100vh",
            paddingTop: "50px"
        }}>
            <div className="text-center mb-4">
                <h1 className="mb-4" style={{
                    fontWeight: "bold",
                    color: "rgba(255, 255, 255, 0.85)",
                    marginTop: "50px"
                }}>Admin Task Dashboard</h1>
            </div>

            <div className="container bg-white bg-opacity-75 rounded-4 shadow-lg p-4 my-3">
                <div className="d-flex justify-content-center mb-4">
                    <div className="mx-2 w-50">
                        <label>Select User:</label>
                        <select className="form-select custom-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                            <option value="">-- All Users --</option>
                            {users.map((user) => (
                                <option key={user.username} value={user.username}>
                                    {user.name} ({user.username})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mx-2 w-50">
                        <label>Select Deadline:</label>
                        <select className="form-select custom-select" value={selectedDeadline} onChange={(e) => setSelectedDeadline(e.target.value)}>
                            <option value="">-- All Deadlines --</option>
                            {filteredDeadlines.map((deadline) => (
                                <option key={deadline} value={deadline}>{deadline}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-1">
                    <label>Select Task:</label>
                    <select className="form-select custom-select" value={selectedTaskName} onChange={(e) => setSelectedTaskName(e.target.value)}>
                        <option value="">-- All Tasks --</option>
                        {filteredTaskNames.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="container bg-white bg-opacity-75 rounded-4 shadow-lg p-3 my-3">
                <div className="mb-5 p-3 rounded-4 border" style={{ borderColor: "#6a11cb", backgroundColor: "#f2f3f5" }}>
                    <h2 className="text-center fw-semibold fs-4 border-bottom pb-2 mb-4 text-dark-emphasis">
                        In-Progress User Tasks
                    </h2>
                    {/* Table for Desktop view */}
                    <div className="d-none d-md-block">
                        {filterTasks(inProgressTasks).length ? renderTable(filterTasks(inProgressTasks)) : <p className="text-center">No tasks found.</p>}
                    </div>
                    {/* Cards for Mobile view */}
                    <div className="d-md-none">
                        {filterTasks(inProgressTasks).length ? renderCard(filterTasks(inProgressTasks)) : <p className="text-center">No tasks found.</p>}
                    </div>
                </div>
                <div className="mb-5 p-3 rounded-4 border" style={{ borderColor: "#6a11cb", backgroundColor: "#f2f3f5" }}>
                    <h2 className="text-center fw-semibold fs-4 border-bottom pb-2 mb-4 text-dark-emphasis">
                        Completed User Tasks
                    </h2>
                    {/* Table for Desktop view */}
                    <div className="d-none d-md-block">
                        {filterTasks(completedTasks).length ? renderTable(filterTasks(completedTasks)) : <p className="text-center">No tasks found.</p>}
                    </div>
                    {/* Cards for Mobile view */}
                    <div className="d-md-none">
                        {filterTasks(completedTasks).length ? renderCard(filterTasks(completedTasks)) : <p className="text-center">No tasks found.</p>}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminUserTasks;