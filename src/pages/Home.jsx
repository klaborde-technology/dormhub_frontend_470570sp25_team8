import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function Home() {
  
  const users = [
    { id: 1, username: 'JohnDoe', email: 'john@example.com', tasks: ['Clean Bed'], deadline: '2025-04-03', status: 'In-Progress' },
    { id: 2, username: 'JaneSmith', email: 'jane@example.com', tasks: ['Clean Toilet', 'Clean Sink'], deadline: '2025-04-05', status: 'Completed' },
    { id: 3, username: 'JaneSmith', email: 'jane@example.com', tasks: ['Clean Bed'], deadline: '2025-05-05', status: 'In-Progress' },
  ];
  
  const [user, setUser] = useState(users);
  const [targetTable, setTargetTable] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  const moveToTargetTable = () => {
    const completed = user.filter((item) => item.status === 'Completed' && !targetTable.some(target => target.id === item.id));
    const inprogress = user.filter((item) => item.status !== 'Completed');

    setUser([...inprogress]); // Create a new array for the user state
    setTargetTable([...targetTable, ...completed]);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setSelectedTask(""); // Reset task selection when a user is changed
  };

  const handleTaskChange = (e) => {
    setSelectedTask(e.target.value);
  };

  return (
    <div>
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
                Add Task
              </button>
              <button
                className="btn btn-info ml-3"
                onClick={moveToTargetTable}
              >
                Move Completed Tasks
              </button>
            </div>
          </div>

          {/* Dropdown List for Students */}
          <div className="dropdown-section mb-4">
            <label htmlFor="studentDropdown">Select Student:</label>
            <select
              id="studentDropdown"
              className="form-select"
              value={selectedUser}
              onChange={handleUserChange}
            >
              <option value="">-- Choose a Student --</option>
              {[...user, ...targetTable].map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown List for Tasks */}
          {selectedUser && (
            <div className="dropdown-section mb-4">
              <label htmlFor="taskDropdown">Select Task:</label>
              <select
                id="taskDropdown"
                className="form-select"
                value={selectedTask}
                onChange={handleTaskChange}
              >
                <option value="">-- Choose a Task --</option>
                {[...user, ...targetTable]
                  .find((u) => u.id.toString() === selectedUser)
                  .tasks.map((task, index) => (
                    <option key={index} value={task}>
                      {task}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Display Selected Summary */}
          {selectedUser && selectedTask && (
            <div className="mt-4">
              <h4>Selection Summary:</h4>
              <p>
                <strong>Student:</strong> {[...user, ...targetTable].find((u) => u.id.toString() === selectedUser).username}
              </p>
              <p>
                <strong>Task:</strong> {selectedTask}
              </p>
            </div>
          )}

          {/* The main table for displaying tasks */}
          <h2>In-Progress</h2>
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
              {user.map((user, index) => (
                <tr key={index}>
                  <td style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{user.username}</td>
                  <td className="hide-on-mobile">{user.email}</td>
                  <td>{user.tasks.join(", ")}</td>
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
                    <Link to={`/viewtask/${user.id}`} className="btn btn-primary btn-sm" aria-label="View task">
                    <span className="btn-view-desktop">View</span>
                    <span className="btn-view-mobile">&#128065;</span>
                    </Link>
                    <Link
                    className="btn btn-sm"
                    to={`/edittask/${user.id}`}
                    style={{
                      backgroundColor: 'fuchsia',
                      borderColor: 'white',
                    }}
                    aria-label="Edit task"
                  >
                    <span className="btn-edit-desktop">Edit</span>
                    <span className="btn-edit-mobile">&#9998;</span>
                  </Link>
                    <button
                      className="btn btn-danger btn-sm mx-1"
                      aria-label="Delete task"
                    >
                      <span className="btn-delete-desktop">Delete</span>
                      <span className="btn-delete-mobile">&#128465;</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Completed Tasks Table */}
          <h2>Completed</h2>
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
              {targetTable.map((user, index) => (
                <tr key={index}>
                  <td style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{user.username}</td>
                  <td className="hide-on-mobile">{user.email}</td>
                  <td>{user.tasks.join(", ")}</td>
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
                    <Link to={`/viewtask/${user.id}`} className="btn btn-primary btn-sm" aria-label="View task">
                    <span className="btn-view-desktop">View</span>
                    <span className="btn-view-mobile">&#128065;</span>
                    </Link>
                    <Link
                    className="btn btn-sm"
                    to={`/edittask/${user.id}`}
                    style={{
                      backgroundColor: 'fuchsia',
                      borderColor: 'white',
                    }}
                    aria-label="Edit task"
                  >
                    <span className="btn-edit-desktop">Edit</span>
                    <span className="btn-edit-mobile">&#9998;</span>
                  </Link>
                    <button
                      className="btn btn-danger btn-sm mx-1"
                      aria-label="Delete task"
                    >
                      <span className="btn-delete-desktop">Delete</span>
                      <span className="btn-delete-mobile">&#128465;</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div >
      </div >
    </div>
  );
}
