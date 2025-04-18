import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState(""); // Added state for username
    const [name, setName] = useState(""); // Added state for name
    const [role, setRole] = useState("PRIVILEGED_USER");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await AuthService.register(name, username, email, role, password);

            if (response) {
                setMessage("✅ Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setMessage("❌ Registration failed. No response from server.");
            }
        } catch (error) {
            console.error("Registration failed:", error);

            // Extract backend error message properly
            const errorMessage = error.response?.data?.message || error.response?.data || "❌ Registration failed: Unknown error.";

            setMessage(errorMessage);
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
                        <label htmlFor="username" className="form-label fw-semibold">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="form-control rounded-3"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 position-relative">
                        <label htmlFor="password" className="form-label fw-semibold">
                            Password
                        </label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="form-control rounded-3"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-semibold">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="form-control rounded-3"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
