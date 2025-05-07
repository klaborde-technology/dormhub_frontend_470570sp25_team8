import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import AuthService from "../auth/AuthService";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated();
  const username = AuthService.getUsername();
  const userRole = AuthService.getUserRole();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    AuthService.logout();
    setDropdownOpen(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{ backgroundColor: "#6a1b9a", padding: "0.75rem 1rem" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center text-white" to="/">
          <img
            src="/images/home.png"
            alt="Home"
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              filter: "brightness(0) invert(1)",
            }}
          />
          Dormhub
        </Link>

        <div className="d-flex align-items-center">
          {!isAuthenticated ? (
            <>
              <Link className="btn btn-outline-light me-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-outline-light" to="/register">
                Register
              </Link>
            </>
          ) : (
            <div className="dropdown">
              <button
                className="btn text-white d-flex align-items-center"
                onClick={toggleDropdown}
                style={{ border: "none", background: "transparent" }}
              >
                <FaUserCircle size={24} className="me-2" />
                {username}
              </button>
              {dropdownOpen && (
                <div
                  className="dropdown-menu show"
                  style={{ right: 0, left: "auto", marginTop: "0.5rem" }}
                >
                  {userRole === "ADMIN" && (
                    <>
                      <Link className="dropdown-item" to="/addusertask">
                        Assign Tasks
                      </Link>
                      <Link className="dropdown-item" to="/addtask">
                        Add New Task
                      </Link>
                      <Link className="dropdown-item" to="/adduser">
                        Add New User
                      </Link>
                    </>
                  )}
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}