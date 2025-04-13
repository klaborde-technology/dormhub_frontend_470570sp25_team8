import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/"); // Redirects to home page after 3 seconds
        }, 3000);

        return () => clearTimeout(timer); // Cleanup function
    }, [navigate]);

    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
            }}
        >
            <div
                className="card shadow p-4 text-center"
                style={{
                    maxWidth: "480px",
                    width: "100%",
                    borderRadius: "16px",
                    backgroundColor: "#ffffffdd",
                    backdropFilter: "blur(6px)",
                }}
            >
                <h2 className="fw-bold mb-3" style={{ color: "#6f42c1" }}>You have been logged out</h2>
                <p className="text-muted">Redirecting to the home page...</p>
            </div>
        </div>
    );
}
