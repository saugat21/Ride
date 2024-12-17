import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import "../css/Login.css";
import Car from "../assets/car-sharing.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials(userData));
      // Store the token in localStorage
      const token = response.token; // Assuming the token is returned in response.data.token
      localStorage.setItem("jwt", token);
      toast.success("Login Successful");
      navigate(
        userData.role === "driver" ? "/driver/dashboard" : "/user/dashboard"
      );
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Failed to login: ", err);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center">
      <div className="login-page-left">
        <img src={Car} alt="Ride Sharing" className="login-image" />
      </div>
      <div
        className="card p-4  shadow rounded-4 login-form-container"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="mb-4 text-center stylish-heading">
          Welcome To Our App!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <div className="mt-3">
            <p>Haven't signed up? <Link to="/register">Register</Link> </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
