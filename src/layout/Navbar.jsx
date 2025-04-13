import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../auth/AuthService";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/logout-success"); // Redirect to logout confirmation page
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: "#6a1b9a" }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center text-light" to="/">
          <img 
            src="/images/home.png" 
            alt="Home" 
            style={{ 
              width: "30px", 
              height: "30px", 
              marginRight: "10px", 
              filter: "brightness(0) invert(1)" 
            }} 
          />
          Dormhub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-light">
            {/* For admin, show only the Add Tasks button */}
            {isAuthenticated && userRole === "ADMIN" && (
              <li className="nav-item">
                <Link className="btn btn-outline-light me-2" to="/addtask">
                  Add Tasks
                </Link>
              </li>
            )}
            {/* Login/Register for not authenticated */}
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light me-2" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}