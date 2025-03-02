import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";  // ✅ Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min"; // Bootstrap JS


import "./index.css";  // ✅ Import your global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
