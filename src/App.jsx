import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import EditTask from "./tasks/EditUserTask";
import ViewUser from "./users/ViewUser";
import ViewTask from "./tasks/ViewUserTask";
import Login from "./auth/Login";
import Register from "./auth/Register";
import LogoutSuccess from "./auth/LogoutSuccess";
import AuthService from "./auth/AuthService";
import AdminUserTasks from "./pages/AdminUserTasks"; // Make sure this is in your pages folder
import AddUserTask from "./tasks/AddUserTask"; // Your form to add tasks as a user task
import EditUserTask from "./tasks/EditUserTask";
import ViewUserTask from "./tasks/ViewUserTask";
import PrivilegeUserTasks from "./pages/PrivilegeUserTasks"; // Your form to add tasks as a user task

const ProtectedRoute = ({ element, requiredRoles }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {/* If user is an authenticated admin, redirect "/" to "/admintasks", otherwise show Home */}
          <Route
            path="/"
            element={
              AuthService.isAuthenticated() &&
                AuthService.getUserRole() === "ADMIN" ? (
                <Navigate to="/admintasks" replace />
              ) : (
                <Home />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout-success" element={<LogoutSuccess />} />

          {/* Protected Admin routes */}
          <Route
            path="/adduser"
            element={<ProtectedRoute element={<AddUser />} requiredRoles={["ADMIN"]} />}
          />
          <Route
            path="/edituser/:id"
            element={<ProtectedRoute element={<EditUser />} requiredRoles={["ADMIN"]} />}
          />
          <Route
            path="/edittask/:id"
            element={<ProtectedRoute element={<EditTask />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />}
          />

          {/* Public routes */}
          <Route path="/viewuser/:id" element={<ViewUser />} />
          <Route path="/viewtask/:id" element={<ViewTask />} />


          {/* Privileged Users: Incorporate a route to req  ADJUST to PrivilegedUser Later */}
          <Route path="/privilegeusertasks" element={<PrivilegeUserTasks />} />

          {/* Admin Task Dashboard */}
          <Route
            path="/admintasks"
            element={<ProtectedRoute element={<AdminUserTasks />} requiredRoles={["ADMIN"]} />}
          />

          {/* Route to add a new task (user task) */}
          <Route
            path="/addtask"
            element={<ProtectedRoute element={<AddUserTask />} requiredRoles={["ADMIN"]} />}
          />

          <Route
            path="/editusertask/:id"
            element={
              <ProtectedRoute element={<EditUserTask />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />
            }
          />

          <Route
            path="/viewusertask/:id"
            element={<ProtectedRoute element={<ViewUserTask />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />}
          />

        </Routes>
      </Router>
    </div>
  );
}

export default App;