import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

export default function ViewSampleUserTask() {
  const { id } = useParams();
  const location = useLocation();
  const numericId = parseInt(id, 10);

  // Try to get user from navigation state
  const userFromState = location.state?.user;

  // Static fallback data
  const sampleUsers = [
    { id: 1, username: 'JohnDoe', email: 'john@example.com', tasks: ['Clean Bed'], deadline: '2025-04-03', status: 'In-Progress' },
    { id: 2, username: 'JaneSmith', email: 'jane@example.com', tasks: ['Clean Toilet', 'Clean Sink'], deadline: '2025-04-05', status: 'Completed' },
    { id: 3, username: 'JaneSmith', email: 'jane@example.com', tasks: ['Clean Bed'], deadline: '2025-05-05', status: 'In-Progress' },
  ];

  // Use state if available, otherwise fallback to static data
  const user = userFromState || sampleUsers.find((u) => u.id === numericId);

  if (!user) {
    return <div className="container mt-5"><h3>User not found</h3></div>;
  }

  return (
    <div className="container mt-5">
      <h2>Sample Task Details</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Tasks:</strong> {user.tasks.join(', ')}</p>
      <p><strong>Deadline:</strong> {user.deadline}</p>
      <p><strong>Status:</strong> {user.status}</p>
    </div>
  );
}
