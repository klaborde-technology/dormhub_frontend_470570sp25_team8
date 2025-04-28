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

  // Use state if available, otherwise fallback to static data
  const user = userFromState || sampleUsers.find((u) => u.id === numericId);

  if (!user) {
    return <div className="container mt-5"><h3>User not found</h3></div>;
  }

  return (
    <div className="custom-container" style={{paddingTop: '100px'}}>
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Sample Task Details</h2>
          <div className="card">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <b>Name:</b> {user.username}
              </li>
              <li className="list-group-item">
                <b>Email:</b> {user.email}
              </li>
              <li className="list-group-item">
                <b>Tasks:</b> {user.tasks.join(', ')}
              </li>
              <li className="list-group-item">
                <b>Deadline:</b> {user.deadline}
              </li>
              <li className="list-group-item">
                <b>Status:</b> {user.status}
              </li>
            </ul>
          </div>
          <button
            className="btn btn-primary my-2"
            onClick={() => navigate("/")}
          >
            Return To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
  
}
