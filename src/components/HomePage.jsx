import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "../components/styles/HomePage.css";
import Header from "./common/Header";
import axios from "axios";



const HomePage = () => {
  const image = "https://www.bing.com/th/id/OGC.0aec6eada1d75bd069126b1e4246d416?pid=1.7&rurl=https%3a%2f%2fmedia0.giphy.com%2fmedia%2fxSjopbUHgWCPfue5Ky%2fgiphy.gif&ehk=KKDn0wXuWH7IFUT5oNfE996N3wIgxQWEpvICmleidFY%3d";
  const [jobs, setJobs] = useState([]);


  useEffect(() => {

    axios.get("http://localhost:5000/jobs")
      .then((response) => setJobs(response.data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);


  return (
    <div className="page-container"> 
      <div className="container my-5">
      <h2 className="text mb-4">Available Jobs</h2>
      <div className="row g-4">
        {jobs.map((job) => (
          <div key={job.id} className="col-md-4">
          <div className="card job-card position-relative">
  {/* New Badge */}
  {job.isNew && (
    <div className="new-badge">New</div>
  )}

  <img 
    src={image} 
    className="card-img-top" 
    alt={job.title} 
    style={{ width: "auto", height: "30vh", objectFit: "cover" }} 
  />
  
  <div className="card-body">
    <h5 className="card-title">{job.job_title}</h5>
    <p className="card-text" title={job.description}>
      {job.description}
    </p>
    
    <Link 
      to="/job_application" 
      state={{ title: job.job_title, description: job.description }} 
      className="btn btn-success"
    >
      Apply Now
    </Link>
  </div>
</div>

          </div>
        ))}
      </div>
    </div>

      
    </div>
  );
};

export default HomePage;
