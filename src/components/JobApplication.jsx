import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/JobApplication.css";

const JobApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const jobDetails = location.state || { title: "", description: "" };

  const [formData, setFormData] = useState({
    name: "",
    email: storedUser?.email || "",
    dob: "",
    appliedFor: jobDetails.title || "",
    designation: "",
    skillset: "",
    location: "",
    termsAccepted: false,
  });


  useEffect(() => {
    if (jobDetails.job_title) {
      setFormData((prev) => ({ ...prev, appliedFor: jobDetails.job_title }));
    }
    if (storedUser?.email) {
      setFormData((prev) => ({ ...prev, email: storedUser.email }));
    }
  }, [jobDetails.job_title, storedUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!storedUser) {
    
      alert("Please log in to apply.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/job-apply", formData);
      if (response.data.success) {
        alert("Application submitted successfully!");
        navigate("/");
      } else {
        alert("Application submission failed!");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application.");
    }
  };

  return (
    <div className="container job-application">
      <div className="card shadow-lg p-4">
        <h2 className="text-right mb-3">{jobDetails.title || "Job Application"}</h2>
        <h6 className="text-right mb-5">{jobDetails.description || "Fill the form below to apply."}</h6>
        <form onSubmit={handleSubmit} className="row g-3">
          
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Applied For</label>
            <input type="text" className="form-control" style={{cursor:'not-allowed', color:'#a0a0a0', backgroundColor:'#f0f0f0', border: '1px solid #d3d3d3'}}name="appliedFor" value={formData.appliedFor} readOnly />
          </div>

          <div className="col-md-6">
            <label className="form-label">Designation</label>
            <input type="text" className="form-control" name="designation" value={formData.designation} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Skillset</label>
            <input type="text" className="form-control" placeholder="Eg. Book Sorting & Shelving, Active listening" name="skillset" value={formData.skillset} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Location</label>
            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="col-12">
            <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required /> 
            <label className="ms-2">I accept the terms and conditions</label>
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">Submit Application</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default JobApplication;
