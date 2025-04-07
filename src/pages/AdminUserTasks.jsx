// AdminUserTasks.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthService from "../auth/AuthService";

const AdminUserTasks = () => {
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    // Function to fetch in-progress and completed tasks from the backend
    const fetchTasks = async () => {
        try {
            // Fetch tasks where status is false for in-progress
            const inProgressResponse = await axios.get(
                "http://localhost:8080/usertasks?status=false",
                { headers: AuthService.getAuthHeader() }
            );
            // Fetch tasks where status is true for completed
            const completedResponse = await axios.get(
                "http://localhost:8080/usertasks?status=true",
                { headers: AuthService.getAuthHeader() }
            );
            setInProgressTasks(inProgressResponse.data);
            setCompletedTasks(completedResponse.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Delete a task by id and refresh the list
    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/usertask/${id}`, {
                headers: AuthService.getAuthHeader(),
            });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Render a table for either a set of tasks
    const renderTable = (tasks) => (
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th>User Name</th>
                    <th>Task</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((ut) => (
                    <tr key={ut.id}>
                        <td>{ut.user.username}</td>
                        <td>{ut.task.name}</td>
                        <td>{ut.deadline}</td>
                        <td>
                            <Link to={`/viewusertask/${ut.id}`} className="btn btn-info btn-sm me-1">
                                View
                            </Link>
                            <Link to={`/editusertask/${ut.id}`} className="btn btn-warning btn-sm me-1">
                                Edit
                            </Link>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteTask(ut.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="container mt-4">
            <h1>Admin Task Dashboard</h1>

            {/* In-progress Tasks Table */}
            <div className="mb-5">
                <h2>In-progress</h2>
                {inProgressTasks.length > 0 ? (
                    renderTable(inProgressTasks)
                ) : (
                    <p>No in-progress tasks found.</p>
                )}
            </div>

            {/* Completed Tasks Table */}
            <div>
                <h2>Completed</h2>
                {completedTasks.length > 0 ? (
                    renderTable(completedTasks)
                ) : (
                    <p>No completed tasks found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminUserTasks;