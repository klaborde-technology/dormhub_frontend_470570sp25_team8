import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./layout/Navbar";
import Home from "./pages/Home";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import EditTask from "./tasks/EditUserTask";
import ViewUser from "./users/ViewUser";
import ViewTask from "./users/ViewUser";
import Login from "./auth/Login";
import Register from "./auth/Register";
import LogoutSuccess from "./auth/LogoutSuccess";
import AuthService from "./auth/AuthService";
import AdminUserTasks from "./pages/AdminUserTasks";
import AddUserTask from "./tasks/AddUserTask";
import EditUserTask from "./tasks/EditUserTask";
import ViewUserTask from "./tasks/ViewUserTask";
import PrivilegeUserTasks from "./pages/PrivilegeUserTasks";
import ViewSampleUserTask from "./tasks/ViewSampleUserTask";
import AddTask from "./tasks/AddTask";


const ProtectedRoute = ({ element, requiredRoles }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();
  const userId = AuthService.getUserId();


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!userId) {
    return <Navigate to="/unauthorized" replace />;
  }
  <Navigate to={`/usertasks/user/${userId}`} replace />;

  return <>{element}</>;
};

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const hideNavbarOnRoutes = ["/login", "/register", "/logout-success"];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            AuthService.isAuthenticated() ? (
              AuthService.getUserRole() === "ADMIN" ? (
                <Navigate to="/admintasks" replace />
              ) : AuthService.getUserRole() === "PRIVILEGED_USER" ? (
                <Navigate to={`/usertasks/user/${AuthService.getUserId()}`} replace />
              ) : (
                <Home />
              )
            ) : (
              <Home />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout-success" element={<LogoutSuccess />} />

        {/* Admin routes */}
        <Route
          path="/adduser"
          element={<ProtectedRoute element={<Register registrationType="adminRegistration" />} requiredRoles={["ADMIN"]} />}
        />

        <Route
          path="/edituser/:id"
          element={<ProtectedRoute element={<EditUser />} requiredRoles={["ADMIN"]} />}
        />

        <Route
          path="/edittask/:id"
          element={<ProtectedRoute element={<EditTask />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />}
        />

        {/* Privileged User routes */}
        <Route
          path="/usertasks/user/:id"
          element={<ProtectedRoute element={<PrivilegeUserTasks />} requiredRoles={["PRIVILEGED_USER"]} />}
        />

        {/* Admin Task Dashboard */}
        <Route
          path="/admintasks"
          element={<ProtectedRoute element={<AdminUserTasks />} requiredRoles={["ADMIN"]} />}
        />

        {/* Task routes */}
        <Route
          path="/addusertask"
          element={<ProtectedRoute element={<AddUserTask />} requiredRoles={["ADMIN"]} />}
        />

        <Route
          path="/editusertask/:id"
          element={<ProtectedRoute element={<EditUserTask />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />}
        />

        <Route
          path="/viewusertask/:id"
          element={<ProtectedRoute element={<ViewUserTask />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />}
        />

        {/* Adding Task routes */}
        <Route
          path="/addtask"
          element={<ProtectedRoute element={<AddTask />} requiredRoles={["ADMIN"]} />}
        />

        {/* Public routes */}
        <Route path="/viewuser/:id" element={<ViewUser />} />
        <Route path="/viewtask/:id" element={<ViewTask />} />
        <Route path="/viewsampletask/sampleuser/:id" element={<ViewSampleUserTask />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
