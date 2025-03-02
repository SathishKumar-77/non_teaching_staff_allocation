import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "../components/styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    availableJobs: 0,
    pendingApplications: 0,
  });



  useEffect(() => {
    fetch("http://localhost:5000/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching job stats:", error));
  }, []);


  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Column - Job Management & Applications */}
        <div className="col-md-6 d-flex flex-column gap-3 manage">
          {/* Job Management Card */}
          <div className="card shadow-sm p-3 ">
            <h4 className="text-center">Job Management</h4>
            <p>Manage job listings, add, edit, or delete jobs.</p>
            <Link to="/job_management" className="btn btn-primary w-100">Manage Jobs</Link>
          </div>
          
          {/* Job Applications Card */}
          <div className="card shadow-sm p-3">
            <h4 className="text-center">Job Applications</h4>
            <p>Review job applications and update status.</p>
            <Link to="/received_applications" className="btn btn-primary w-100">View Applications</Link>
          </div>
        </div>

        {/* Right Column - Stats Overview */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3 states">
            <h4 className="text-center">Dashboard Stats</h4>
            <div className="d-flex justify-content-around flex-wrap">
              <div className="stat-box bg-primary text-white p-3 rounded text-center">
                <h5>{stats.availableJobs}</h5>
                <p>Available Job(s)</p>
              </div>
              <div className="stat-box bg-success text-white p-3 rounded text-center">
                <h5>{stats.totalApplications}</h5>
                <p>Total Application(s)</p>
              </div>
              <div className="stat-box bg-warning text-dark p-3 rounded text-center">
                <h5>{stats.pendingApplications}</h5>
                <p>Pending Job(s)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
