import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";

// The component accepts a prop which indicates the registration context.
// If registrationType is "adminRegistration", then an admin is registering a new user
// (and the new user will be a privileged user). Otherwise (or if omitted), the guest registration
// form will create an admin account.
function Register({ registrationType = "guest" }) {
    const navigate = useNavigate();

    // Determine the default role based on the registration context.
    // Guest registration → account is ADMIN.
    // Admin registration → account is PRIVILEGED_USER.
    const defaultRole =
        registrationType === "adminRegistration" ? "PRIVILEGED_USER" : "ADMIN";

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [role] = useState(defaultRole); // Fixed role; no setter needed
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle registration form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            // Call your AuthService.register function with the fixed role
            const response = await AuthService.register(name, username, email, role, password);

            if (response) {
                setMessage("✅ Registration successful! Redirecting...");
                if (registrationType === "guest") {
                    // After guest registration (creating an admin account), redirect to login
                    setTimeout(() => navigate("/login"), 1500);
                } else {
                    setTimeout(() => navigate("/admintasks"), 1500);
                }
            } else {
                setMessage("❌ Registration failed. No response from server.");
            }
        } catch (error) {
            console.error("Registration failed:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data ||
                "❌ Registration failed: Unknown error.";
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center"
            style={{
                background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
                minHeight: "100vh",
                paddingTop: "80px",
                paddingBottom: "20px",
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
                <div className="text-center mb-0">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/747/747545.png"
                        alt="Register Icon"
                        width="75"
                        className="mb-0"
                    />
                    <h3 className="text-purple fw-bold" style={{ color: "#6f42c1" }}>
                        {registrationType === "guest"
                            ? "Create Admin Account"
                            : "Add New Privileged User"}
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

                    {/* Fixed Role field – shown as read-only */}
                    <div className="mb-4">
                        <label htmlFor="role" className="form-label fw-semibold">
                            Role
                        </label>
                        <input
                            type="text"
                            id="role"
                            className="form-control rounded-3"
                            value={role === "ADMIN" ? "Admin" : "Privileged User"}
                            disabled
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

                {registrationType === "guest" && (
                    <div className="text-center mt-4">
                        <small className="text-muted">
                            Already have an account? <a href="/login">Login</a>
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Register;