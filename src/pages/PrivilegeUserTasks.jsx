import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";

const PrivilegeUserTasks = () => {
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const { id } = useParams(); // Get user ID from URL params 
    const userId = AuthService.getUserId(); // Get user ID from AuthService
    const navigate = useNavigate();

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const userId = AuthService.getUserId(); // Get the user ID from AuthService
            console.log("User ID:", userId);
            const inProgressResponse = await axios.get(
                `http://localhost:8080/usertasks/user/${userId}?status=false`,
                { headers: AuthService.getAuthHeader() }
            );
            const completedResponse = await axios.get(
                `http://localhost:8080/usertasks/user/${userId}?status=true`,
                { headers: AuthService.getAuthHeader() }
            );
            setInProgressTasks(inProgressResponse.data);
            setCompletedTasks(completedResponse.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Toggle task completion status while preserving deadline
    const toggleTaskStatus = async (id, currentStatus, currentDeadline) => {
        try {
            await axios.put(
                `http://localhost:8080/usertask/${id}`,
                { 
                    status: !currentStatus, 
                    deadline: currentDeadline // Keep the deadline unchanged
                },
                { headers: AuthService.getAuthHeader() }
            );
            fetchTasks(); // Refresh task lists dynamically
        } catch (error) {
            console.error("Error updating task status:", error);
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

    useEffect(() => {
        if (String(id) !== String(userId)) {
            navigate("/unauthorized", { replace: true }); // Prevent access to other users' tasks
        }
    }, [id, userId, navigate]);

    // Render table for tasks
    const renderTable = (tasksToRender) => (
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th>Task No.</th>
                    <th>Task Name</th>
                    <th>Task Deadline</th>
                    <th>Complete?</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasksToRender.length > 0 ? (
                    tasksToRender.map((task) => (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>{task.task.name}</td>
                            <td>{task.deadline}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={task.status} // Checkbox reflects task status
                                    disabled={AuthService.getUserRole() !== "PRIVILEGED_USER"} // Disable checkbox for non-privileged users
                                    onChange={() => 
                                        toggleTaskStatus(task.id, task.status, task.deadline) // Pass deadline here
                                    }
                                />
                            </td>
                            <td>
                                <Link
                                    to={`/viewusertask/${task.id}`}
                                    className="btn btn-info btn-sm me-1"
                                >
                                    View
                                </Link>
                                {AuthService.getUserRole() === "ADMIN" && (
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    Delete
                                </button>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center">
                            No tasks found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    return (
        <div className="container-fluid mt-4">
            {/* In-progress Tasks Table */}
            <div className="mb-5">
                <h2>In-Progress Task List</h2>
                {renderTable(inProgressTasks)}
            </div>

            {/* Completed Tasks Table */}
            <div>
                <h2>Completed Task List</h2>
                {renderTable(completedTasks)}
            </div>
        </div>
    );
};

export default PrivilegeUserTasks;