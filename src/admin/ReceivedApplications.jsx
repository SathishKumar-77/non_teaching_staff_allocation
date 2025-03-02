import { useEffect, useState } from "react";

const ReceivedApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/applications");
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const updateStatus = async (id, status) => {
    const confirmAction = window.confirm(`Are you sure you want to ${status} this application?`);
    
    if (!confirmAction) return; // Stop execution if the user cancels
  
    try {
      const response = await fetch(`http://localhost:5000/application/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
  
      if (response.ok) {
        alert(`Application successfully ${status}`); // ✅ Success alert
        fetchApplications(); // Refresh list
      } else {
        alert("Error updating status"); // ❌ Error alert
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status"); // ❌ Error handling
    }
  };
  

  return (
    <div className="container mt-5">
        <h2 className="text-right" style={{ marginTop: 200 }}   >Job Applications</h2>
        <table className="table" style={{ marginTop: 30, padding: 4 }}>
  <thead>
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>Email</th>
      <th>Applied For</th>
      <th>Designation</th>
      <th>Skillset</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {applications.length > 0 ? (
      applications.map((app, index) => (
        <tr key={app.id}>
          <td>{index + 1}</td>
          <td>{app.name}</td>
          <td>{app.email}</td>
          <td>{app.appliedFor}</td>
          <td>{app.designation}</td>
          <td>{app.skillset}</td>
          <td>
            <span
              className={`badge bg-${
                app.status === "pending"
                  ? "warning"
                  : app.status === "accepted"
                  ? "success"
                  : "danger"
              }`}
            >
              {app.status}
            </span>
          </td>
          <td>
            {app.status === "pending" && (
              <>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => updateStatus(app.id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => updateStatus(app.id, "rejected")}
                >
                  Reject
                </button>
              </>
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="8" className="text-center">
          No applications received.
        </td>
      </tr>
    )}
  </tbody>
</table>


    </div>
  );
};

export default ReceivedApplications;
