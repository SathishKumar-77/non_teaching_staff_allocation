import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css"; // Import the updated styles

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="error-content">
        <h1 className="error-title">
          4<span className="zero">0</span>4
          <img src="/astronaut.jpg" alt="Astronaut" className="inline-astronaut" />
        </h1>
        <p className="error-message">Oops! Page not found.</p>
        <p className="error-description">Looks like you’re lost in space. Let's get you back home!</p>
        <Link to="/" className="home-button">Go Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
