import axios from "axios";
import { API_BASE_URL } from '../api';

const API_URL = `${API_BASE_URL}/auth`;

const AuthService = {
    // ✅ Register a new user
    register: async (name, username, email, role, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, username, email, role, password });
            return response.data;
        } catch (error) {
            console.error("Registration error:", error.response?.data?.message || error.response?.data || error.message);
            throw error;
        }
    },

    // ✅ Store only the token, not email
    login: (token) => {
        if (!token || token.split(".").length !== 3) {
            console.error("Invalid token received:", token);
            return;
        }
        localStorage.setItem("token", token);
    },

    // ✅ Logout with confirmation & redirect
    logout: () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (!confirmLogout) return;

        localStorage.removeItem("token");
        window.location.href = "/logout-success";
    },

    // ✅ Check if a token exists and is valid
    isAuthenticated: () => {
        const token = localStorage.getItem("token");
        if (!token || token.split(".").length !== 3) return false;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expiryTime = payload.exp * 1000;
            if (Date.now() >= expiryTime) {
                AuthService.logout();
                return false;
            }
            return true;
        } catch (error) {
            console.error("Invalid token:", error);
            AuthService.logout();
            return false;
        }
    },

    // ✅ Get user role from token
    getUserRole: () => {
        const token = localStorage.getItem("token");
        if (!token || token.split(".").length !== 3) return "GUEST";

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.role || "GUEST";
        } catch (error) {
            console.error("Error decoding token:", error);
            return "GUEST";
        }
    },

    // ✅ Get user ID from token
    getUserId: () => {
        const token = localStorage.getItem("token");
        if (!token || token.split(".").length !== 3) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("Decoded JWT payload:", payload);
            return payload.id || null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    },

    // ✅ Retrieve token for debugging purposes (Optional)
    getToken: () => {
        return localStorage.getItem("token");
    },

    // ✅ Manually clear the token (for debugging purposes)
    clearToken: () => {
        localStorage.removeItem("token");
    },

    // ✅ Attach token to API requests
    getAuthHeader: () => {
        const token = localStorage.getItem("token");
        return token && token.split(".").length === 3 ? { Authorization: `Bearer ${token}` } : {};
    },

    getCurrentUser: () => {
        const token = localStorage.getItem("token");
        if (!token || token.split(".").length !== 3) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return {
                email: payload.sub,
                username: payload.username || payload.sub,
            };
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    },

    // ✅ Get username (usually email) from token
    getUsername: () => {
        const token = localStorage.getItem("token");
        if (!token || token.split(".").length !== 3) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.sub || payload.email || null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    },


};

export default AuthService;