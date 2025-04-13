import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("PRIVILEGED_USER");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            await AuthService.register(email, password, role);
            setMessage("✅ Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
            console.error("Registration failed:", error);
            setMessage("❌ Registration failed. Email may already be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(to right, #d9a7c7, #fffcdc)", // Soft purple-pink blend
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
                        src="https://cdn-icons-png.flaticon.com/512/747/747545.png"
                        alt="Register Icon"
                        width="64"
                        className="mb-2"
                    />
                    <h3 className="text-purple fw-bold" style={{ color: "#6f42c1" }}>
                        Create an Account
                    </h3>
                </div>

                <form onSubmit={handleRegister}>
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

                    <div className="mb-4">
                        <label htmlFor="role" className="form-label fw-semibold">
                            Role
                        </label>
                        <select
                            id="role"
                            className="form-select rounded-3"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="PRIVILEGED_USER">Privileged User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
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
                        {loading ? "Registering..." : "Register"}
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
                        Already have an account? <a href="/login">Login</a>
                    </small>
                </div>
            </div>
        </div>
    );
}

export default Register;
