import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";

export default function ViewUserTask() {
    const [userTask, setUserTask] = useState({
        user: {},
        task: {},
        deadline: "",
        status: false,
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const userId = AuthService.getUserId();

    useEffect(() => {
        loadUserTask();
    }, []);

    const loadUserTask = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/usertask/${id}`, {
                headers: AuthService.getAuthHeader(),
            });
            console.log("Loaded user task:", result.data);
            setUserTask(result.data);
        } catch (error) {
            console.error("Error loading user-task:", error);
        }
    };

    const handleBack = () => {
        const role = AuthService.getUserRole();
        const userId = AuthService.getUserId();

        if (role === "ADMIN") {
            navigate("/admintasks");
        } else if (role === "PRIVILEGED_USER") {
            navigate(`/usertasks/user/${userId}`);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="custom-container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">User Task Details</h2>
                    <div className="card">
                        <div className="card-header">Details of Task Assignment (ID: {id})</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <b>Name:</b> {userTask.user && userTask.user.name}
                            </li>
                            <li className="list-group-item">
                                <b>Username:</b> {userTask.user && userTask.user.username}
                            </li>
                            <li className="list-group-item">
                                <b>Email:</b> {userTask.user && userTask.user.email}
                            </li>
                            <li className="list-group-item">
                                <b>Task:</b> {userTask.task && userTask.task.name}
                            </li>
                            <li className="list-group-item">
                                <b>Deadline:</b> {userTask.deadline}
                            </li>
                            <li className="list-group-item">
                                <b>Status:</b> {userTask.status ? "Completed" : "In-progress"}
                            </li>
                        </ul>
                    </div>
                    <button className="btn btn-primary my-2" onClick={handleBack}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}