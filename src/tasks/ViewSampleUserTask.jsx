import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export default function ViewSampleUserTask() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const numericId = parseInt(id, 10);

  // Try to get user from navigation state
  const userFromState = location.state?.user;

  // Static fallback data
  const sampleUsers = [
    { id: 1, username: 'JohnDoe', email: 'john@example.com', tasks: ['Schedule Move-Out Appointment'], deadline: '2025-04-03', status: 'In-Progress' },
    { id: 2, username: 'JaneSmith', email: 'jane@example.com', tasks: ['Clean Bathroom'], deadline: '2025-04-05', status: 'Completed' },
    { id: 3, username: 'JaneSmith', email: 'jane@example.com', tasks: ['Clean Kitchen Area'], deadline: '2025-05-05', status: 'In-Progress' },
  ];

  const user = userFromState || sampleUsers.find((u) => u.id === numericId);

  if (!user) {
    return (
      <div className="container-fluid py-5 px-3" style={{ background: "linear-gradient(to right, #6a11cb, #2575fc)", minHeight: "100vh", marginTop: "60px" }}>
        <div className="container bg-white bg-opacity-75 rounded-4 shadow-lg p-4 text-center">
          <h3 className="text-danger">User not found</h3>
          <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>Return To Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-5 px-3"
      style={{
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        minHeight: "100vh",
        marginTop: "50px",
        paddingTop: "20px",
      }}
    >
      <div className="container bg-white bg-opacity-75 rounded-4 shadow-lg p-4">
        <div className="mb-5 p-3 rounded-4 border" style={{ borderColor: "#6a11cb", backgroundColor: "#f2f3f5" }}>
          <h2 className="text-center fw-semibold fs-4 border-bottom pb-2 mb-4 text-dark-emphasis">
            Sample Task Details
          </h2>
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title text-center"><strong>Username:</strong> {user.username}</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item text-center">
                  <b>Email:</b> {user.email}
                </li>
                <li className="list-group-item text-center">
                  <b>Task(s):</b> {user.tasks.join(', ')}
                </li>
                <li className="list-group-item text-center">
                  <b>Deadline:</b> {new Date(user.deadline).toLocaleDateString()}
                </li>
                <li className="list-group-item text-center">
                  <b>Status:</b>{" "}
                  <span className={`badge ${user.status === "Completed" ? "bg-success" : "bg-warning text-dark"}`}>
                    {user.status}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>
            Return To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
