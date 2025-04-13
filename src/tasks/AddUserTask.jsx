import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService"; // ✅ Import AuthService

export default function AddUserTask() {
    const navigate = useNavigate();

    const [userTask, setUserTask] = useState({
        deadline: "",
        status: "In-progress", // Default status for dropdown
        userId: "",
        taskId: "",
    });

    const { deadline, status, userId, taskId } = userTask;

    const [users, setUsers] = useState([]); // To hold predefined users
    const [tasks, setTasks] = useState([]); // To hold predefined tasks

    // Fetch predefined users and tasks on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get("http://localhost:8080/users", {
                    headers: AuthService.getAuthHeader(),
                });
                setUsers(usersResponse.data);

                const tasksResponse = await axios.get("http://localhost:8080/tasks", {
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
            // Map status to the boolean `false` for "In-progress"
            const taskData = {
                deadline,
                status: false, // Default to "In-progress"
                user: { id: userId }, // Send user ID
                task: { id: taskId }, // Send task ID
            };

            await axios.post("http://localhost:8080/usertask", taskData, {
                headers: AuthService.getAuthHeader(), // Include JWT token
            });
            navigate("/admintasks"); // Redirect to user-tasks list
        } catch (error) {
            console.error("Error adding UserTask:", error);
        }
    };

    return (
        <div className="custom-container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Assign Task to User</h2>
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
                                        {user.username}
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
                                disabled // Only one option ("In-progress")
                            >
                                <option value="In-progress">In-progress</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to="/admintasks">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}