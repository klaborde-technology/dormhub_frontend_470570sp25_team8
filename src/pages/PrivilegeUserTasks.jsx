import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthService from "../auth/AuthService";

const PrivilegeUserTasks = () => {
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const inProgressResponse = await axios.get(
                "http://localhost:8080/usertasks?status=false",
                { headers: AuthService.getAuthHeader() }
            );
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

    // Toggle task completion status
    const toggleTaskStatus = async (id, currentStatus) => {
        try {
            await axios.put(
                `http://localhost:8080/usertask/${id}`,
                { status: !currentStatus },
                { headers: AuthService.getAuthHeader() }
            );
            fetchTasks();
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

    // Render a table for tasks, including a placeholder row when no tasks are found
    const renderTable = (tasks, isCompleted) => (
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
                {tasks.length > 0 ? (
                    tasks.map((ut) => (
                        <tr key={ut.id}>
                            <td>{ut.id}</td>
                            <td>{ut.task.name}</td>
                            <td>{ut.deadline}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={() => toggleTaskStatus(ut.id, isCompleted)}
                                />
                            </td>
                            <td>
                                <Link
                                    to={`/viewusertask/${ut.id}`}
                                    className="btn btn-info btn-sm me-1"
                                >
                                    View
                                </Link>
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
                <h2>Task List</h2>
                {renderTable(inProgressTasks, false)}
            </div>

            {/* Completed Tasks Table */}
            <div>
                <h2>Completed Task List</h2>
                {renderTable(completedTasks, true)}
            </div>
        </div>
    );
};

export default PrivilegeUserTasks;