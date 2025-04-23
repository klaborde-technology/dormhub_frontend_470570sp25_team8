import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'intro.js/introjs.css';
import introJs from 'intro.js';


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

  const startTour = () => {
    const intro = introJs();

    // Set up the steps and keep going to Step 6
    intro.setOptions({
      steps: [
        {
          element: '.btn-info',
          intro: 'Click to move completed tasks to the Completed section.',
          position: 'left',
        },
        {
          element: '#studentDropdown',
          intro: 'Use this drowpdown to select a student. The tasks will be filtered based on the selected student.',
          position: 'bottom',
        },
        {
          element: '#taskDropdown',
          intro: 'Use this drowpdown to select a task. The students tasks will be filtered based on the selected task.',
          position: 'bottom',
        },
        {
          element: '.table th',
          intro: 'These are the column headers. Each column gives important details about a student and their task.',
          position: 'bottom',
        },
        {
          element: '.hide-column-name',
          intro: 'IMPORTANT**: This column shows the task status. Yellow (🟡) means "In-Progress" and green (🟢) means "Completed".',
          position: 'bottom',
        },
        {
          element: '.view-button',  // Ensure the class name for the View button is used
          intro: 'Click to view the details of the selected task.',
          position: 'left',
        },
        {
          element: '.delete-button',  // Ensure the class name for the View button is used
          intro: 'Guess what this button does? It deletes this row. Refresh the page to undo any changes you have made.',
          position: 'left',
        },
      ],
      showStepNumbers: true,
      scrollToElement: true,
    });

    intro.start();
  };

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
    setUser(prev => prev.filter(u => u.username !== username));
    setTargetTable(prev => prev.filter(u => u.username !== username));
  };

  const allUsers = [...user, ...targetTable];
  const selectedUserObj = allUsers.find(u => u.username.toString() === selectedUser);

  return (
    <div className="container-fluid py-4">
      <div className="text-center mb-3">
        <h2>Task Records</h2>
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-success" onClick={startTour}>
            Start Tour
          </button>
          <button className="btn btn-info" onClick={moveToTargetTable}
            data-intro="Click to move completed tasks to the Completed section."
            data-step="1"
            data-position="left">
            Move Completed Tasks
          </button>
        </div>
      </div>

      <div className="dropdown-section mb-4">
        <label htmlFor="studentDropdown">Select Student:</label>
        <select 
          id="studentDropdown" 
          className="form-select" 
          value={selectedUser} 
          onChange={handleUserChange}
          data-intro="Use this drowpdown to select a student. The tasks will be filtered based on the selected student."
          data-step="2"
          data-position="bottom">
          <option value="">-- Choose a Student --</option>
          {Array.from(new Map(allUsers.map(u => [u.username, u])).values()).map((u) => (
            <option key={u.username} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>
      </div>

        <div className="dropdown-section mb-4">
          <label htmlFor="taskDropdown">Select Task:</label>
          <select 
            id="taskDropdown" 
            className="form-select" 
            value={selectedTask}
            onChange={handleTaskChange}
            data-intro="Use this drowpdown to select a task. The students tasks will be filtered based on the selected task."
            data-step="3"
            data-position="bottom"
          >
            <option value="">-- Choose a Task --</option>
            {allUsers
              .filter((user) => user.username === selectedUser)
              .flatMap((user) => user.tasks) // Flatten all tasks from selected users
              .map((task, index) => (
                <option key={index} value={task}>
                  {task}
                </option>
              ))}
          </select>
        </div>

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
          <tr
            data-intro="These are the column headers. Each column gives important details about a student and their task."
            data-step="4"
            data-position="bottom"
          >
            <th>Username</th>
            <th className="hide-on-mobile">Email</th>
            <th>Task</th>
            <th>Deadline</th>
            <th className="hide-column-name"
              data-intro="IMPORTANT**: This column shows the task status. Yellow (🟡) means 'In-Progress' and green (🟢) means 'Completed'."
              data-step="5"
              data-position="bottom"
            >
              Task Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {user 
            .filter((u) => {
              const matchesUser = !selectedUser || u.username.toString() === selectedUser;
              const matchesTask = !selectedTask || u.tasks?.includes(selectedTask);
              return matchesUser && matchesTask;
            })
            .map((user, index) => (
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
                    className="btn btn-primary btn-sm view-button"
                    data-intro="Click to view the details of the selected task."
                    data-step="6"
                    data-position="left"
                  >
                    View
                  </Link>
                  <button 
                    className="btn btn-danger btn-sm mx-1 delete-button" 
                    onClick={() => handleDelete(user.id)}
                    data-intro="Guess what this button does? It deletes this row. Refresh the page to undo any changes you have made."
                    data-step="7"
                    data-position="left"
                  >
                    Delete
                  </button>
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
          {targetTable
            .filter((u) => {
              const matchesUser = !selectedUser || u.username.toString() === selectedUser;
              const matchesTask = !selectedTask || u.tasks?.includes(selectedTask);
              return matchesUser && matchesTask;
            })
            .map((user, index) => (
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
                <button className="btn btn-danger btn-sm mx-1" 
                onClick={() => handleDelete(user.id)}
                >
                  Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}