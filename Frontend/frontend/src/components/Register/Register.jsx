import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdCloseFullscreen } from "react-icons/md";
import axios from "axios"; // Don't forget to import axios
import "./Register.css";

const Register = ({ setShowLogin }) => {
  const [values, setValues] = useState({
    first_name: "",
    second_name: "",
    email: "",
    password: "",
    roles: "learner"
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/register", values)
      .then((res) => {
        if (res.data.status === "Success") {
          setValues({
            first_name: "",
            second_name: "",
            email: "",
            password: "",
            roles: "learner"
          }); // Reset form values
          setShowLogin(false); // Close the Register popup
          navigate("/login");
        } else {
          setError("Error occurred during registration");
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
          <h2>Register</h2>
          <MdCloseFullscreen onClick={() => setShowLogin(false)} />
        </div>
        <div className="login-popup-inputs">
          <input
            type="text"
            id="first-name"
            placeholder="First Name"
            value={values.first_name}
            onChange={(e) =>
              setValues({ ...values, first_name: e.target.value })
            }
            required
          />
          <input
            type="text"
            id="second-name"
            placeholder="Second Name"
            value={values.second_name}
            onChange={(e) =>
              setValues({ ...values, second_name: e.target.value })
            }
            required
          />
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
        <button type="submit">Register</button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            <span>Click here</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
