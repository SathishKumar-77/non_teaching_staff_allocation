import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Profile.css"; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [jobStats, setJobStats] = useState({ applied: 0, selected: 0, rejected: 0, pending: 0 });
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
      fetchUserJobs(storedUser.id);
    }
  }, []);

  const fetchUserJobs = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/jobs/${userId}`);
      const jobs = response.data;
      
      const stats = {
        applied: jobs.length,
        selected: jobs.filter(job => job.status === "accepted").length,
        rejected: jobs.filter(job => job.status === "rejected").length,
        pending: jobs.filter(job => job.status === "pending").length,
      };

      setJobStats(stats);
      setAppliedJobs(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  if (!user) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container profile-container">
      <div className="row">
        {/* Left Column: Profile & Stats */}
        <div className="col-md-4 profile-card">
          <div className="text-center">
            <img src="https://www.clipartkey.com/mpngs/m/208-2089363_user-profile-image-png.png" alt="Profile" className="profile-pic" />
            <h3 className="mt-3">{user.full_name} {user.role === "admin" ? "(Admin)" : ""}</h3>
          </div>
          <div className="stats">
            <p><strong>Jobs Applied:</strong> {jobStats.applied}</p>
            <p><strong>Jobs Selected:</strong> {jobStats.selected}</p>
            <p><strong>Jobs Rejected:</strong> {jobStats.rejected}</p>
            <p><strong>Jobs Pending:</strong> {jobStats.pending}</p>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default Profile;
