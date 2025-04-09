import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthService from "../auth/AuthService";

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

    // Fetch tasks and process metadata
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
            const combinedTasks = [...inProgressResponse.data, ...completedResponse.data];
            setTasks(combinedTasks);
            setInProgressTasks(inProgressResponse.data);
            setCompletedTasks(completedResponse.data);
            setUsers([...new Set(combinedTasks.map((task) => task.user.username))]);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const filteredTasks = tasks
            .filter((task) => (selectedUser ? task.user.username === selectedUser : true))
            .filter((task) => (selectedDeadline ? task.deadline === selectedDeadline : true))
            .filter((task) => (selectedTaskName ? task.task.name === selectedTaskName : true));
    
        setFilteredDeadlines([...new Set(filteredTasks.map((task) => task.deadline))]);
        setFilteredTaskNames([...new Set(filteredTasks.map((task) => task.task.name))]);
        setUsers([...new Set(filteredTasks.map((task) => task.user.username))]); // Dynamically update users
    }, [selectedUser, selectedDeadline, selectedTaskName, tasks]);

    const filterTasks = (tasksToFilter) => {
        return tasksToFilter
            .filter((task) => (selectedUser ? task.user.username === selectedUser : true))
            .filter((task) => (selectedDeadline ? task.deadline === selectedDeadline : true))
            .filter((task) => (selectedTaskName ? task.task.name === selectedTaskName : true));
    };

    const renderTable = (tasksToRender) => (
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>User Name</th>
                    <th>Task</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasksToRender.map((task) => (
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
                ))}
            </tbody>
        </table>
    );

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/usertask/${id}`, { headers: AuthService.getAuthHeader() });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Admin Task Dashboard</h1>
            <div className="mb-4">
                <label>Select User:</label>
                <select className="form-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">-- All Users --</option>
                    {users.map((user) => (
                        <option key={user} value={user}>{user}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label>Select Deadline:</label>
                <select className="form-select" value={selectedDeadline} onChange={(e) => setSelectedDeadline(e.target.value)}>
                    <option value="">-- All Deadlines --</option>
                    {filteredDeadlines.map((deadline) => (
                        <option key={deadline} value={deadline}>{deadline}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label>Select Task:</label>
                <select className="form-select" value={selectedTaskName} onChange={(e) => setSelectedTaskName(e.target.value)}>
                    <option value="">-- All Tasks --</option>
                    {filteredTaskNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-5">
                <h2>In-progress Tasks</h2>
                {filterTasks(inProgressTasks).length ? renderTable(filterTasks(inProgressTasks)) : <p>No tasks found.</p>}
            </div>
            <div>
                <h2>Completed Tasks</h2>
                {filterTasks(completedTasks).length ? renderTable(filterTasks(completedTasks)) : <p>No tasks found.</p>}
            </div>
        </div>
    );
};

export default AdminUserTasks;