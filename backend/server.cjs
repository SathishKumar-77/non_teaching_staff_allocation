const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt =  require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const router = express.Router();
const nodemailer = require("nodemailer");



require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY; 



const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.E_MAIL,
    pass: process.env.PWD,
  },
  tls: {
    rejectUnauthorized: false, // ✅ Ignore SSL certificate issues
  },
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if email exists
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { id, full_name, role, availability_status, reason, re_avail_datetime } = user;
    
    const token = jwt.sign({ id, full_name, role }, SECRET_KEY, { expiresIn: "1h" });

    if (role === "admin") {
      return res.json({
        message: "Admin login successful",
        token,
        role,
        full_name,
        id,
        availability_status: "NA" // Admin doesn't have availability status
      });
    } else {
      return res.json({
        message: "User login successful",
        token,
        role,
        full_name,
        id,
        availability_status,
        reason: availability_status === "not_available" ? reason : "",
        re_avail_datetime: availability_status === "not_available" ? re_avail_datetime : ""
      });
    }
  });
});


module.exports = router;


app.post("/register", async (req, res) => {
  const { fullName, dob, skillset, email, password } = req.body;

  // Check if email already exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Database
    const insertQuery = "INSERT INTO users (full_name, dob, skillset, email, password) VALUES (?, ?, ?, ?, ?)";
    db.query(insertQuery, [fullName, dob, skillset, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: "Error inserting user" });

      res.status(201).json({ message: "User registered successfully!" });
    });
  });
});


app.post("/job-apply", (req, res) => {
  const { name, email, dob, appliedFor, designation, skillset, location } = req.body;
  const sql = `INSERT INTO job_applications (name, email, dob, appliedFor, designation, skillset, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`;

  db.query(sql, [name, email, dob, appliedFor, designation, skillset, location], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Application submitted!" });
  });
});


// ✅ Get all jobs
app.get("/jobs", (req, res) => {
  db.query("SELECT * FROM jobs", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    // Get today's date and subtract 1 day
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);

    // Add `isNew` field based on `created_at` timestamp
    const jobs = results.map(job => ({
      ...job,
      isNew: new Date(job.created_at) >= sevenDaysAgo // Check if job is recent
    }));

    res.json(jobs);
  });
});



// ✅ Add a new job
app.post("/jobs", (req, res) => {
  const { job_title, description, workload } = req.body;

  if (!job_title || !description || !workload) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO jobs (job_title, description, workload) VALUES (?, ?, ?)";
  db.query(sql, [job_title, description, workload], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Job added successfully", jobId: result.insertId });
  });
});

// ✅ Update a job
app.put("/jobs/:id", (req, res) => {
  const { job_title, description, workload } = req.body;
  const jobId = req.params.id;

  const sql = "UPDATE jobs SET job_title=?, description=?, workload=? WHERE id=?";
  db.query(sql, [job_title, description, workload, jobId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Job updated successfully" });
  });
});

// ✅ Delete a job
app.delete("/jobs/:id", (req, res) => {
  const jobId = req.params.id;

  const sql = "DELETE FROM jobs WHERE id=?";
  db.query(sql, [jobId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Job deleted successfully" });
  });
});



// ✅ 2. Get All Applications (Admin Side)
app.get("/applications", (req, res) => {
  db.query("SELECT * FROM job_applications", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// ✅ 3. Update Application Status (Accept or Reject)
app.put("/application/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Fetch applicant details
  const getUserQuery = `SELECT name, email FROM job_applications WHERE id = ?`;
  db.query(getUserQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: "User not found or database error" });
    }

    const { name, email } = results[0];

    // Update status in the database
    const updateQuery = `UPDATE job_applications SET status = ? WHERE id = ?`;
    db.query(updateQuery, [status, id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      // ✅ **Return success response immediately**
      res.json({ message: `Application ${status} successfully updated`, id });

      // 🔄 **Send email asynchronously (won't block API response)**
      const mailOptions = {
        from: "dummymailjy@gmail.com",
        to: email,
        subject: `Job Application ${status.toUpperCase()}`,
        text: `Dear ${name},\n\nWe wanted to inform you that your job application has been ${status}. Keep striving for success, and we wish you the best in your career journey.\n\nBest regards,\nAdmin`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Email Error:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    });
  });
});



app.get("/stats", (req, res) => {
  const jobStatsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM job_applications) AS totalApplications,
      (SELECT COUNT(*) FROM jobs) AS availableJobs,
      (SELECT COUNT(*) FROM job_applications WHERE status = 'pending') AS pendingApplications
  `;

  db.query(jobStatsQuery, (err, stats) => {
    if (err) return res.status(500).json({ message: "Error fetching job stats" });

    return res.json(stats[0]);
  });
});


app.get("/jobs/:userId", (req, res) => {
  const userId = req.params.userId;
  
  const sql = "SELECT appliedFor, status FROM job_applications WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});



app.get("/get_availability/:id", (req, res) => {
  const userId = req.params.id;

  const sql = "SELECT availability_status FROM users WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length > 0) {
      return res.json({ availability_status: result[0].availability_status });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});


app.post("/updateAvailability", (req, res) => {
  const { id, availability_status, unavailability_reason, re_avail_datetime } = req.body;

  const sql = `
    UPDATE users 
    SET availability_status = ?, 
        unavailability_reason = ?, 
        re_avail_datetime = ?
    WHERE id = ?`;

  db.query(sql, [availability_status, unavailability_reason, re_avail_datetime, id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    return res.json({ success: true, message: "Availability status updated successfully" });
  });
});








// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
