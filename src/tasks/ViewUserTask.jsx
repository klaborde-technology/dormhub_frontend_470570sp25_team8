import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";
import { API_BASE_URL } from "../api";
import { FaCheckCircle, FaRegCircle, FaTrash } from "react-icons/fa";

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
    const userRole = AuthService.getUserRole();

    useEffect(() => {
        loadUserTask();
    }, []);

    const loadUserTask = async () => {
        try {
            const result = await axios.get(`${API_BASE_URL}/usertask/${id}`, {
                headers: AuthService.getAuthHeader(),
            });
            console.log("Loaded user task:", result.data);
            setUserTask(result.data);
        } catch (error) {
            console.error("Error loading user-task:", error);
        }
    };

    const handleBack = () => {
        if (userRole === "ADMIN") {
            navigate("/admintasks");
        } else if (userRole === "PRIVILEGED_USER") {
            navigate(`/usertasks/user/${userId}`);
        } else {
            navigate("/");
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
                    <h2 className="fw-bold text-primary-emphasis">User Task Details</h2>
                </div>
                { /* Task Details */}
                <div className="mb-5 p-3 rounded-4 border" style={{ borderColor: "#6a11cb", backgroundColor: "#f2f3f5" }}>
                    <h2 className="text-center fw-semibold fs-4 border-bottom pb-2 mb-4 text-dark-emphasis">
                        Task Assignment Details
                    </h2>
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body">
                            <h5 className="card-title text-center"><strong>Name:</strong> {userTask.user?.name}</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item text-center">
                                    <b>Username:</b> {userTask.user?.username}
                                </li>
                                <li className="list-group-item text-center">
                                    <b>Email:</b> {userTask.user?.email}
                                </li>
                                <li className="list-group-item text-center">
                                    <b>Task:</b> {userTask.task?.name}
                                </li>
                                <li className="list-group-item text-center">
                                    <b>Deadline:</b> {userTask.deadline}
                                </li>
                                <li className="list-group-item text-center">
                                    <b>Status: </b>
                                    <span className={`badge ${userTask.status ? "bg-success" : "bg-warning text-dark"}`}>
                                        {userTask.status ? "Completed" : "In-progress"}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="d-flex justify-content-center mt-4">
                    <button className="btn btn-secondary" onClick={handleBack}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
