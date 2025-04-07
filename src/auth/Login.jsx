import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";

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
            const token = response.data; // Your API returns only the raw token

            // Ensure token looks valid (JWT format)
            if (!token || token.split(".").length !== 3) {
                console.error("Invalid token received:", token);
                throw new Error("Invalid token format");
            }

            AuthService.login(token); // Store token properly

            setMessage("✅ Login successful! Redirecting...");

            // After a delay, check the user's role and redirect accordingly.
            setTimeout(() => {
                if (AuthService.getUserRole() === "ADMIN") {
                    navigate("/admintasks", { replace: true });
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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Login;