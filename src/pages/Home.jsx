import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'intro.js/introjs.css';
import introJs from 'intro.js';
import { FaCheckCircle, FaRegCircle, FaEye, FaTrash } from 'react-icons/fa';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

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
        intro: 'Use this dropdown to select a student. The tasks will be filtered based on the selected student.',
        position: 'bottom',
      },
      {
        element: '#taskDropdown',
        intro: 'Use this dropdown to select a task. The students tasks will be filtered based on the selected task.',
        position: 'bottom',
      },
      {
        element: isMobile ? '.card-body strong' : '.table th',
        intro: isMobile
        ? 'These are the task cards. Each card gives important details about a student and their task.'
        : 'These are the column headers. Each column gives important details about a student and their task.',
        position: 'bottom',
      },
      {
        element: isMobile ? '.text-warning' : '.hide-column-name',
        intro: isMobile 
        ? 'IMPORTANT**: This icon shows the task status. Orange circle (🟠) means "In-Progress" and green checkmark circle (✅) means "Completed".'
        : 'IMPORTANT**: This column shows the task status. Red (🔴) means "In-Progress" and green (🟢) means "Completed".',
        position: 'bottom',
      },
      {
        element: isMobile ? '.card .btn-primary' : '.view-button',
        intro: 'Click to view the details of the selected task.',
        position: 'left',
      },
      {
        element: isMobile ? '.card .btn-outline-danger' : '.delete-button',
        intro: isMobile
        ? 'Guess what this button does? It deletes this card. Refresh the page to undo any changes you have made.'
        : 'Guess what this button does? It deletes this row. Refresh the page to undo any changes you have made.',
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
    setUser(prev => prev.filter(u => u.id !== id));
    setTargetTable(prev => prev.filter(u => u.id !== id));
  };

  const isMobile = useIsMobile();
  const allUsers = [...user, ...targetTable];

  const renderCards = (tasks, isCompleted = false) => (
    <div className="d-md-none mb-4">
      <div className="row g-3">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={task.id} className="col-12">
              <div className="card shadow-lg border-0 rounded-4 card-hover">
                <div className="card-body">
                  <p className="mb-1"><strong>#</strong> {index + 1}</p>
                  <h5 className="card-title d-flex align-items-center gap-2">
                    {task.status === 'Completed' ? <FaCheckCircle className="text-success" /> : <FaRegCircle className="text-warning" />}
                    {task.tasks?.join(", ")}
                  </h5>
                  <p className="mb-2"><strong>Deadline:</strong> {task.deadline}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ color: task.status === 'Completed' ? 'green' : 'red' }}>{task.status}</span>
                    <span className="circle red-circle" style={{ display: task.status === 'In-Progress' ? 'inline-block' : 'none', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'red' }}></span>
                    <span className="circle green-circle" style={{ display: task.status === 'Completed' ? 'inline-block' : 'none', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'green' }}></span>
                    <div className="d-flex gap-2">
                      <Link to={`/viewsampletask/sampleuser/${task.id}`} state={{ user: task }} className="btn btn-primary btn-sm"><FaEye /></Link>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(task.id)}><FaTrash /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted">No tasks found.</div>
        )}
      </div>
    </div>
  );



                       
                       
  return (
    <div
      className="container-fluid py-5 px-3"
      style={{
        background: "linear-gradient(to right, #6a11cb, #2575fc)", // Sleek gradient background
        minHeight: "100vh",
        marginTop: "60px",
        paddingTop: "20px",
      }}
    >
      {/* Main Content */}
      <div className="flex-grow-1 container-fluid py-5 px-3">
        {/* Hero Section */}
        <div
          className="hero-section text-center text-white py-5"
          style={{
            padding: "100px 20px",
            borderRadius: "10px",
          }}
        >
          <h1 className="fw-bold display-4">Welcome to DormHub</h1>
          <p className="fs-5">
            Your ultimate platform for managing dormitory tasks and
            responsibilities. Stay organized, track progress, and enjoy a
            seamless dormitory experience.
          </p>
          <button
            className="btn btn-light btn-lg mt-3"
            style={{
              color: "#6a11cb",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 12px 25px rgba(0, 0, 0, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0, 0, 0, 0.3)";
            }}
            onClick={() => {
              startTour();
              setTimeout(() => {
                document
                  .querySelector(".btn-info")
                  .scrollIntoView({ behavior: "smooth", block: "center" });
              }, 300); // Adding a slight delay to ensure the tour starts before scrolling
            }}
          >
            Get Started
          </button>
        </div>

        {/* Feature Cards */}
        <div className="row mt-5">
          <div className="col-md-4">
            <div className="card-wrapper">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title">Task Management</h5>
                  <p className="card-text">
                    Easily manage and track your dormitory tasks with our
                    intuitive interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-wrapper">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title">Progress Tracking</h5>
                  <p className="card-text">
                    Monitor your progress and stay on top of your
                    responsibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-wrapper">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title">Seamless Experience</h5>
                  <p className="card-text">
                    Enjoy a smooth and hassle-free dormitory management
                    experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ paddingTop: "30px" }}
      >
        <button
          className="btn btn-info"
          style={{
            backgroundColor: "#2575fc", // Gradient color
            color: "white",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease, transform 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#6a11cb")
          } // Change color on hover
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#2575fc";
          }} // Revert color on mouse out
          onClick={moveToTargetTable}
                data-intro="Click to move completed tasks to the Completed section."
                data-step="1"
                data-position="left"
              >
                Move Completed Tasks
              </button>
              </div>

              <div
              className="dropdown-section mb-4 d-flex flex-column flex-md-row justify-content-center align-items-center"
              style={{ gap: isMobile ? "20px" : "200px" }}
              >
              <div style={{ flex: 1, maxWidth: isMobile ? "100%" : "300px", width: "100%" }}>
                <label htmlFor="studentDropdown" style={{ color: "white" }}>
                Select Student:
                </label>
                <select
                id="studentDropdown"
                className="form-select"
                value={selectedUser}
                onChange={handleUserChange}
                data-intro="Use this dropdown to select a student. The tasks will be filtered based on the selected student."
                data-step="2"
                data-position="bottom"
                >
                <option value="">-- Choose a Student --</option>
                {Array.from(
                  new Map(allUsers.map((u) => [u.username, u])).values()
                ).map((u) => (
                  <option key={u.username} value={u.username}>
                  {u.username}
                  </option>
                ))}
                </select>
              </div>

              <div style={{ flex: 1, maxWidth: isMobile ? "100%" : "300px", width: "100%" }}>
                <label htmlFor="taskDropdown" style={{ color: "white" }}>
                Select Task:
                </label>
                <select
                id="taskDropdown"
                className="form-select"
                value={selectedTask}
                onChange={handleTaskChange}
                data-intro="Use this dropdown to select a task. The students tasks will be filtered based on the selected task."
                data-step="3"
                data-position="bottom"
                >
                <option value="">-- Choose a Task --</option>
                {allUsers
                  .filter((user) => user.username === selectedUser)
                  .flatMap((user) => user.tasks)
                  .map((task, index) => (
                  <option key={index} value={task}>
                    {task}
                  </option>
                  ))}
                </select>
              </div>
              </div>

              {/* Task Tables / Cards */}
      {isMobile ? (
        <div className="container bg-white bg-opacity-75 rounded-4 shadow-lg p-4">
          <h2 className="text-center fw-semibold fs-4 border-bottom pb-2 mb-4 text-dark-emphasis">
            In-Progress
          </h2>
          {renderCards(
            user.filter(
              (u) =>
                (!selectedUser || u.username === selectedUser) &&
                (!selectedTask || u.tasks.includes(selectedTask))
            )
          )}
          <h2 className="text-center fw-semibold fs-4 border-bottom pb-2 mt-5 mb-4 text-dark-emphasis">
            Completed
          </h2>
          {renderCards(
            targetTable.filter(
              (u) =>
                (!selectedUser || u.username === selectedUser) &&
                (!selectedTask || u.tasks.includes(selectedTask))
            ),
            true
          )}
        </div>
      ) : (
        <div className="container bg-white bg-opacity-75 rounded-4 shadow-lg p-4">
          {[{ title: "In-Progress", data: user }, { title: "Completed", data: targetTable }].map(
            (section, i) => (
              <div
                key={i}
                className="mb-5 p-3 rounded-4 border"
                style={{
                  borderColor: "#6a11cb",
                  backgroundColor: "#f2f3f5",
                }}
              >
                <h2 className="text-center fw-semibold fs-4 border-bottom pb-2 mb-4 text-dark-emphasis">
                  {section.title}
                </h2>
                <table className="table border shadow table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Task</th>
                      <th>Deadline</th>
                      <th className="hide-column-name">Task Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.data
                      .filter(
                        (u) =>
                          (!selectedUser || u.username === selectedUser) &&
                          (!selectedTask || u.tasks.includes(selectedTask))
                      )
                      .map((user, index) => (
                        <tr key={index}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.tasks.join(", ")}</td>
                          <td>{user.deadline}</td>
                          <td>
                            <span
                              className="circle"
                              style={{
                                display:
                                  user.status === "In-Progress"
                                    ? "inline-block"
                                    : "none",
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: "red",
                                marginRight: "8px",
                              }}
                            ></span>
                            <span
                              className="circle"
                              style={{
                                display:
                                  user.status === "Completed"
                                    ? "inline-block"
                                    : "none",
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: "green",
                                marginRight: "8px",
                              }}
                            ></span>
                            <span style={{ color: user.status === 'Completed' ? 'green' : 'red' }}>{user.status}</span>
                          </td>
                          <td>
                            <Link
                              to={`/viewsampletask/sampleuser/${user.id}`}
                              state={{ user }}
                              className="btn btn-primary btn-sm view-button"
                            >
                              View
                            </Link>
                            <button
                              className="btn btn-danger btn-sm mx-1 delete-button"
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
