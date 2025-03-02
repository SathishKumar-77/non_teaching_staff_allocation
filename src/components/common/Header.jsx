import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import '../styles/Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [reavailTime, setReavailTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get_availability/${userData.id}`);
        const data = await response.json();
        setIsAvailable(data.availability_status === "available");
      } catch (error) {
        console.error("Error fetching availability status:", error);
      }
    };

    if (userData?.id) {
      fetchStatus();
    }
  }, [userData?.id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };


  const handleToggle = async () => {
    if (isAvailable) {
      // If switching to "Not Available," show popup
      setShowPopup(true);
    } else {
      // If switching to "Available," update directly
      try {
        const newStatus = "available";
        const response = await fetch("http://localhost:5000/updateAvailability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userData.id, availability_status: newStatus }),
        });
  
        if (response.ok) {
          setIsAvailable(true);
  
          // Update localStorage
          const updatedUserData = { ...userData, availability_status: newStatus };
          localStorage.setItem("user", JSON.stringify(updatedUserData));
        }
      } catch (error) {
        console.error("Error updating availability:", error);
      }
    }
  };
  

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/updateAvailability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData.id,
          availability_status: "not_available",
          unavailability_reason: reason,
          re_avail_datetime: reavailTime,
        }),
      });
  
      if (response.ok) {
        setIsAvailable(false);
        setReason('');
        setReavailTime('');
        setShowPopup(false);
  
        // Update localStorage
        const updatedUserData = {
          ...userData,
          availability_status: "not_available",
          unavailability_reason: reason,
          re_avail_datetime: reavailTime,
        };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };


  
  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
    <div className="container">
      <Link className="navbar-brand" to="/">Non-Teaching Job Allocation</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          {user ? (
            <>
              {user.role === "admin" && (
                <li className="nav-item"><Link className="nav-link" to="/admin_dashboard">Dashboard</Link></li>
              )}

              <li className="nav-item ms-3">
                <span className="nav-link" style={{ pointerEvents: "none", color: "black" }}>
                  Hello, {user.full_name} 👋 {user.role === "admin" ? "(Admin)" : ""}
                </span>
              </li>

             
              <li className="nav-item">
                <Link className="nav-link" onClick={handleLogout} to="/login">Logout</Link>
              </li>

               {/* Availability Toggle */}
               <li className="nav-item ms-3 align-content-center">
                <div className="toggle-container">
                  <input
                    type="checkbox"
                    className="toggle-switch"
                    id="availabilityToggle"
                    checked={isAvailable}
                    onChange={handleToggle}
                  />
                  <label className="toggle-label" htmlFor="availabilityToggle">
                    {isAvailable ? "Available to work" : "Not Available"}
                  </label>
                </div>
              </li>

            </>
          ) : (
            <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/login?register=true">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>

    {/* Custom Pop-up */}
    {showPopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h5>Set Unavailability</h5>
      <label>Reason:</label>
      <input type="text" className="popup-input" value={reason} onChange={(e) => setReason(e.target.value)} />
      <label>Re-avail Date & Time:</label>
      <input type="datetime-local" className="popup-input" value={reavailTime} onChange={(e) => setReavailTime(e.target.value)} />
      <div className="popup-buttons">
        <button className="popup-btn cancel" onClick={() => setShowPopup(false)}>Cancel</button>
        <button className="popup-btn save" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  </div>
)}
  </nav>
  );
};

export default Header;
