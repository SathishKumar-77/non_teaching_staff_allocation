import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useLocation } from "react-router-dom";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [skillset, setSkillset] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [data, setData] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");





  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsRegister(params.get("register") === "true");
  }, [location]);


  const validateEmail = (email) => {
    const emailPattern =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  const validatePassword = (password) =>{
    return password.length >= 6;
  }

 



  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Reset previous errors
    setEmailError("");
    setPasswordError("");
  
    if (!email) {
      setEmailError("Email is required");
      return;
    }
  
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();



  
      if (!response.ok) {
        // Handle specific errors
        if (response.status === 400) {
          if (data.message === "User not found") {
            setEmailError("User not found");
          } else if (data.message === "Invalid password") {
            setPasswordError("Invalid password");
          }
        } else {
          alert(data.message); 
        }
        return; 
      }
  

      localStorage.setItem("user", JSON.stringify({
        role: data.role,
        full_name: data.full_name,
        id:data.id,
        available_status:data.availability_status
    }));
  
      // Clear input fields
      setEmail("");
      setPassword("");
  
      // Redirect user based on role
      if (data.role === "admin") {
        
        window.location.href = "/admin_dashboard";
      } else if (data.role === "user") {
        window.location.href = "/";
      } else {
        window.location.href = "/";
      }
  
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed! Please try again.");
    }
  };
  
  


  const handleRegister = async (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate Email
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    // Validate Password
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    const userData = { fullName, dob, skillset, email, password };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();


      if (response.status === 400) {
        setEmailError(data.message); 
      } else if(response.status === 201) {
        console.log("Registered successfully");
        setFullName("");
        setDob("");
        setEmail("");
        setSkillset("");
        setPassword("");
        setConfirmPassword("");
        alert(data.message);
      }else{
      alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed!");
    }
  };

 
  return (
    <div className="container my-5">
      <div className="row">
        {/* Left Side - Form Section */}
        <div
          className={`col-md-6 d-flex flex-column align-items-center justify-content-center px-5 login`}
        >
          <div className="text-center" style={{marginTop: "15%"}}>
          <img 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABwElEQVR4nO2XsUvDQBSHf7YiIo6COIpj3cRF6tzRoRQXwc0hFhe1u+Ak+Cc4KA7STcTFROrgoKKICNqqODVYbEHBHLXR8iSUljNtqtZie/J+8EG4O477eO8CB3A4HA6HAyA6QORmEIdNo9b+qBERjpEXVnjxzbNYLIA/qcC7ZwWEAXL4qiqN8t17KuoIiMgCtb1AFiBPfD7FBfxQX4AIHW0tYN+A7FtQ/rR0HofXk9KYAxH8LBDlCjS5hSiB3vJi51u5OyAMrJUXCwObyglYOg4rAjouVBSYlioQLY+PX2VJBjvXn3DP1yOYfHz3AtKejbWQjiWpAssVgVSWZKoEXPONgt8IUBxdQsdDebGlI03x0iIlBF4MTEntU5LYQ0gZAUvHcZWAgS1lBOqFBVJcAfpVC81vHx3IjG3uP8m45xsluGE8BdeNZ4em3gH3m9T9wKj7fv0BOX9nZU8WkMMVCHMLEV9iwX+hWOt+o62IbWpx25yl2mjbaPeQOdNXSGsZ9+ELppajzFw/VMirqU1UCaSjk1Ap9n1kt5AMkYN9F9GhWvKXI0NWoqcoEt3FwvloAComfza8kj8NrLb6HJx/nQ+81K9XOKn8QgAAAABJRU5ErkJggg==" 
              alt="teaching"
              style={{width:120}}
              >

              </img>
           
            <h4 className="mt-3 mb-4">
              {isRegister ? "Join our team" : "Hello!"}
            </h4>
          </div>

          <p>{isRegister ? "Create a new account" : "Please login to your account"}</p>

          <div className="w-100">
            {isRegister && (
              <>
                <label>Full Name</label>
                <input type="text" value={fullName} className="form-control mb-3"  onChange={(e) => setFullName(e.target.value)} />
                <div className="row">
                  <div className="col-md-6">
                    <label>Date of Birth</label>
                    <input type="date" value={dob} className="form-control mb-3"  onChange={(e) => setDob(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label>Skillset</label>
                    <input type="text" value={skillset} className="form-control mb-3"  onChange={(e) => setSkillset(e.target.value)} />
                  </div>
                </div>
              </>
            )}
            <label>Email address</label>
            <input type="email" value={email} className="form-control"  onChange={(e) => setEmail(e.target.value)} />
            {emailError && <p className="text-danger">{emailError}</p>}
          </div>
          <div className="mb-3 w-100">
            <label>Password</label>
            <input type="password" value={password} className="form-control"  onChange={(e) => setPassword(e.target.value)} />
            {passwordError && <p className="text-danger">{passwordError}</p>}
          </div>
          {isRegister && (
            <div className="mb-3 w-100">
              <label>Confirm Password</label>
              <input type="password" value={confirmPassword} className="form-control"   onChange={(e) => setConfirmPassword(e.target.value)}/>
              {confirmPasswordError && <p className="text-danger">{confirmPasswordError}</p>}
            </div>
          )}

          <button className="btn btn-primary w-100" onClick={isRegister ? handleRegister : handleLogin}>
  {isRegister ? "Register" : "Sign in"}
</button>

          {!isRegister && (
            <a href="#" className="text-muted mt-2">
              Forgot password?
            </a>
          )}

          <div className="d-flex align-items-center justify-content-center mt-4">
            <p className="mb-0">{isRegister ? "Already have an account?" : "Don't have an account?"}</p>
            <button className="btn btn-primary ms-2" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Login" : "Register"}
            </button>
          </div>
        </div>

        <div
          className={`col-md-6 gradient-section d-flex align-items-center justify-content-center`}
        >
          <div className="text-center px-4">
            <h4>{isRegister ? "Create your new account here!" : ""}</h4>
            <p>
              {isRegister
                ? "Join our team and experience an amazing journey of success and growth."
                : "Login to access your account and explore opportunities with us."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
