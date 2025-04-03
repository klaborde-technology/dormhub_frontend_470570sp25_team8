import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function Home() {
  const users = [
    { id: 1, username: 'JohnDoe', email: 'john@example.com', task: 'Clean Bed', deadline: '2025-04-03', status: 'In-Progress' },
    { id: 2, username: 'JaneSmith', email: 'jane@example.com', task: 'Clean Toilet', deadline: '2025-04-05', status: 'Completed' },
  ];

  return (
    <div className="container-fluid">
      <div className="py-4">
        <div className="text-center mb-3">
          <h2>Task Records</h2>
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-success btn-lrg"
              style={{
                backgroundColor: 'purple',
                borderColor: 'white',
              }}
            >
              Add
            </button>
          </div>
        </div>

        <table
          className="table border shadow table-striped table-hover"
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col" className="hide-on-mobile">Email</th>
              <th scope="col">Task</th>
              <th scope="col">Deadline</th>
              <th scope="col" className="hide-column-name">Task Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{user.username}</td>
                <td className="hide-on-mobile">{user.email}</td>
                <td>{user.task}</td>
                <td>{user.deadline}</td>
                <td>
                  <span
                    className="circle red-circle"
                    style={{
                      display: user.status === 'In-Progress' ? 'inline-block' : 'none',
                    }}
                  ></span>
                  <span
                    className="circle green-circle"
                    style={{
                      display: user.status === 'Completed' ? 'inline-block' : 'none',
                    }}
                  ></span>
                  <span
                    className="status-text"
                    style={{
                      color:
                        user.status === 'In-Progress'
                          ? 'red'
                          : user.status === 'Completed'
                          ? 'green'
                          : 'inherit',
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  {/* Wrap the View task button with Link to navigate */}
                  <Link to={`/viewtask/${user.id}`} className="btn btn-primary btn-sm" aria-label="View task">
                    &#128065;
                  </Link>
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: 'purple',
                      borderColor: 'white',
                    }}
                    aria-label="Edit task"
                  >
                    &#9998;
                  </button>
                  <button
                    className="btn btn-danger btn-sm mx-1"
                    aria-label="Delete task"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
