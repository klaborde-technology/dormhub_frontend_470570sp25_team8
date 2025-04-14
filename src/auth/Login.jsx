import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/auth/login", {
                email,
                password,
            });

            const token = response.data;

            if (!token || token.split(".").length !== 3) {
                console.error("Invalid token received:", token);
                throw new Error("Invalid token format");
            }

            AuthService.login(token);
            setMessage("✅ Login successful! Redirecting...");

            setTimeout(() => {
                const role = AuthService.getUserRole();

                if (role === "ADMIN") {
                    navigate("/admintasks", { replace: true });
                } else if (role === "PRIVILEGED_USER") {
                    navigate("/privilegeusertasks", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            }, 1500);
        } catch (error) {
            console.error("Login error:", error);
            setMessage("❌ Login failed. Check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(to right, #d9a7c7, #fffcdc)", // Matching purple-pink gradient
            }}
        >
            <div
                className="card shadow p-4 w-100"
                style={{
                    maxWidth: "420px",
                    borderRadius: "16px",
                    backgroundColor: "#ffffffdd",
                    backdropFilter: "blur(6px)",
                }}
            >
                <div className="text-center mb-4">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
                        alt="User Avatar"
                        width="64"
                        className="mb-2"
                    />
                    <h3 className="text-purple fw-bold" style={{ color: "#6f42c1" }}>
                        Sign in to Your Account
                    </h3>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-control rounded-3"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control rounded-3"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                        disabled={loading}
                    >
                        {loading && (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        )}
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {message && (
                    <div className="mt-3 text-center" aria-live="polite">
                        <small className={message.startsWith("✅") ? "text-success" : "text-danger"}>
                            {message}
                        </small>
                    </div>
                )}

                <div className="text-center mt-4">
                    <small className="text-muted">
                        Don’t have an account? <a href="/register">Register</a>
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Login;
