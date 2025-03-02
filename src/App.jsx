import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./components/HomePage";
import Login from "./components/auth/Login";
import JobApplication from "./components/JobApplication";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedRoute from "./components/auth/ProtectRoutes";
import JobManagement from "./admin/JobManagement";
import ReceivedApplications from "./admin/ReceivedApplications";
import NotFound from "./components/common/NotFound";
import Profile from "./components/common/Profile";


const App = () => {
  return (
    <Router>
        localStorage.removeItem("user");

  <div className="d-flex flex-column min-vh-100">
    <Header />
    <main className="flex-grow-1">
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/job_application" element={<JobApplication />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin-Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/job_management" element={<JobManagement/>}/>
          <Route path="/received_applications" element={<ReceivedApplications/>}/>
        </Route>

        <Route path="*" element={<NotFound />} />



      </Routes>
    </main>
    <Footer />
  </div>
</Router>

  );
};

export default App;
