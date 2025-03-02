import React, { useState, useEffect } from "react";
import '../components/styles/JobManagement.css';
const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workload, setWorkload] = useState("");
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/jobs");
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = { job_title: jobTitle, description, workload };
    const url = editingJob ? `http://localhost:5000/jobs/${editingJob.id}` : "http://localhost:5000/jobs";
    const method = editingJob ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();
      alert(data.message);
      setJobTitle("");
      setDescription("");
      setWorkload("");
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (job) => {
    setJobTitle(job.job_title);
    setDescription(job.description);
    setWorkload(job.workload);
    setEditingJob(job);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      alert(data.message);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row job g-10">
        {/* Left Side - Job Form */}
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h2 className="text-center">{editingJob ? "Edit Job" : "Post new Job"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Job Title:</label>
                <input type="text" className="form-control" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description:</label>
                <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Workload:</label>
                <textarea className="form-control" value={workload} onChange={(e) => setWorkload(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">{editingJob ? "Update Job" : "Add Job"}</button>
            </form>
          </div>
        </div>

        {/* Right Side - Job Listings */}
       
        <div className="col-md-8">
          <h2 className="text-center">Created Jobs</h2>
          <table className="table table-bordered table-striped">
  <thead className="table-dark">
    <tr>
      <th>Job Title</th>
      <th>Description</th>
      <th>Workload</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {jobs.length > 0 ? (
      jobs.map((job) => (
        <tr key={job.id}>
          <td>{job.job_title}</td>
          <td>{job.description}</td>
          <td>{job.workload}</td>
          <td className="flex-column justify-content-center align-items-center gap-2 h-100">
            <button className="btn btn-warning me-2 w-100 mb-2" onClick={() => handleEdit(job)}>
              Edit
            </button>
            <button className="btn btn-danger w-100" onClick={() => handleDelete(job.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4" className="text-center">
          No jobs created.
        </td>
      </tr>
    )}
  </tbody>
</table>

        </div>
      </div>
    </div>
  );
};

export default JobManagement;
