import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 4400);

        return () => clearTimeout(timer);
    }, [navigate]);

    const splitText = (text) => {
        return text.split("").map((letter, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                {letter}
            </span>
        ));
    };

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
                <h2 className="logout-header color-change fw-bold mb-3">{splitText("You have been logged out")}</h2>
                <p className="logout-message color-change text-muted">{splitText("Redirecting to the home page...")}</p>
            </div>
        </div>
    );
}
