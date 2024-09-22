import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdCloseFullscreen } from "react-icons/md";
import axios from "axios"; // Ensure axios is imported
import "./Login.css";

const Login = ({ setShowLogin }) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/login", values, { withCredentials: true })
      .then((res) => {
        if (res.data.status === "Success") {
          setShowLogin(false); // Close the login popup
          navigate("/");
        } else {
          setError("Error occurred during login. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div className="login-popup">
      <form onSubmit={handleSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Login</h2>
          <MdCloseFullscreen onClick={() => setShowLogin(false)} />
        </div>
        <div className="login-popup-inputs">
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms and conditions</p>
        </div>
        <p>
          Create a new account?{" "}
          <Link to="/register">
            <span>Click here</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
