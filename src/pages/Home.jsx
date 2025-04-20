import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const sampleUsers = [
    { id: 1, username: 'JohnDoe', email: 'john@example.com', tasks: ['Schedule Move-Out Appointment'], deadline: '2025-04-03', status: 'In-Progress' },
    { id: 2, username: 'JaneSmith', email: 'jane@example.com', tasks: ['Clean Bathroom'], deadline: '2025-04-05', status: 'Completed' },
    { id: 3, username: 'JaneSmith', email: 'jane@example.com', tasks: ['Clean Kitchen Area'], deadline: '2025-05-05', status: 'In-Progress' },
  ];

  const [user, setUser] = useState(sampleUsers);
  const [targetTable, setTargetTable] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  const moveToTargetTable = () => {
    const completed = user.filter((item) => item.status === 'Completed' && !targetTable.some(target => target.id === item.id));
    const inprogress = user.filter((item) => item.status !== 'Completed');
    setUser([...inprogress]);
    setTargetTable([...targetTable, ...completed]);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setSelectedTask("");
  };

  const handleTaskChange = (e) => {
    setSelectedTask(e.target.value);
  };

  const handleDelete = (id) => {
    setUser(prev => prev.filter(u => u.id !== id));
    setTargetTable(prev => prev.filter(u => u.id !== id));
  };

  const allUsers = [...user, ...targetTable];
  const selectedUserObj = allUsers.find(u => u.id.toString() === selectedUser);

  return (
    <div className="container-fluid py-4">
      <div className="text-center mb-3">
        <h2>Task Records</h2>
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-success" style={{ backgroundColor: 'purple', borderColor: 'white' }}>
            Add Task
          </button>
          <button className="btn btn-info ml-3" onClick={moveToTargetTable}>
            Move Completed Tasks
          </button>
        </div>
      </div>

      <div className="dropdown-section mb-4">
        <label htmlFor="studentDropdown">Select Student:</label>
        <select id="studentDropdown" className="form-select" value={selectedUser} onChange={handleUserChange}>
          <option value="">-- Choose a Student --</option>
          {allUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div className="dropdown-section mb-4">
          <label htmlFor="taskDropdown">Select Task:</label>
          <select id="taskDropdown" className="form-select" value={selectedTask} onChange={handleTaskChange}>
            <option value="">-- Choose a Task --</option>
            {selectedUserObj?.tasks?.map((task, index) => (
              <option key={index} value={task}>
                {task}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedUser && selectedTask && (
        <div className="mt-4">
          <h4>Selection Summary:</h4>
          <p><strong>Student:</strong> {selectedUserObj?.username}</p>
          <p><strong>Task:</strong> {selectedTask}</p>
        </div>
      )}

      <h2>In-Progress</h2>
      <table className="table border shadow table-striped table-hover" style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th className="hide-on-mobile">Email</th>
            <th>Task</th>
            <th>Deadline</th>
            <th className="hide-column-name">Task Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {user.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td className="hide-on-mobile">{user.email}</td>
              <td>{user.tasks?.join(", ")}</td>
              <td>{user.deadline}</td>
              <td>
                <span className="circle red-circle" style={{ display: user.status === 'In-Progress' ? 'inline-block' : 'none' }}></span>
                <span className="circle green-circle" style={{ display: user.status === 'Completed' ? 'inline-block' : 'none' }}></span>
                <span className="status-text" style={{ color: user.status === 'In-Progress' ? 'red' : 'green' }}>
                  {user.status}
                </span>
              </td>
              <td>
                <Link
                  to={`/viewsampletask/sampleuser/${user.id}`}
                  state={{ user }}
                  className="btn btn-primary btn-sm"
                >
                  View
                </Link>
                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Completed</h2>
      <table className="table border shadow table-striped table-hover" style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th className="hide-on-mobile">Email</th>
            <th>Task</th>
            <th>Deadline</th>
            <th className="hide-column-name">Task Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {targetTable.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td className="hide-on-mobile">{user.email}</td>
              <td>{user.tasks?.join(", ")}</td>
              <td>{user.deadline}</td>
              <td>
                <span className="circle red-circle" style={{ display: user.status === 'In-Progress' ? 'inline-block' : 'none' }}></span>
                <span className="circle green-circle" style={{ display: user.status === 'Completed' ? 'inline-block' : 'none' }}></span>
                <span className="status-text" style={{ color: user.status === 'In-Progress' ? 'red' : 'green' }}>
                  {user.status}
                </span>
              </td>
              <td>
                <Link
                  to={`/viewsampletask/sampleuser/${user.id}`}
                  state={{ user }}
                  className="btn btn-primary btn-sm"
                >
                  View
                </Link>
                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
