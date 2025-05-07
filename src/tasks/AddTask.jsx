import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";
import { API_BASE_URL } from "../api";


export default function AddTask() {
    const navigate = useNavigate();
    const [task, setTask] = useState({ name: "" });
    const { name } = task;

    const onInputChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/task`, task, {
                headers: {
                    ...AuthService.getAuthHeader(),
                    "Content-Type": "application/json",
                },
            });
            navigate("/admintasks");
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
            }}
        >
            <div
                className="card shadow p-4 w-100"
                style={{
                    maxWidth: "420px",
                    borderRadius: "18px",
                    backgroundColor: "#ffffffdd",
                    backdropFilter: "blur(6px)",
                }}
            >
                <div className="text-center mb-4">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1735/1735010.png"
                        alt="Add Task"
                        width="100"
                        className="mb-3"
                    />

                    <h3 className="text-purple fw-bold" style={{ color: "#6f42c1" }}>
                        Add New Task
                    </h3>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor="taskName" className="form-label fw-semibold">
                            Task Name
                        </label>
                        <input
                            type="text"
                            id="taskName"
                            className="form-control rounded-3"
                            name="name"
                            value={name}
                            onChange={onInputChange}
                            required
                            placeholder="Enter Task Name"
                        />
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