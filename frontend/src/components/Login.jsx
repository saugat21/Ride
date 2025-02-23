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
      dispatch(setCredentials({...userData}));
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
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="row w-100 justify-content-center align-items-center">
        {/* Left Side Image - Visible only on larger screens */}
        <div className="col-lg-6 d-none d-lg-flex justify-content-center">
          <img
            src={Car}
            alt="Ride Sharing"
            className="img-fluid"
            style={{ maxWidth: "80%", height: "auto" }}
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="col-12 col-sm-10 col-md-8 col-lg-4">
          <div className="card p-3 p-sm-4 shadow rounded-4 ">
            <h2
              className="mb-3 text-center stylish-heading"
              style={{ fontSize: "1.5rem" }}
            >
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
              <div className="mt-3 text-center">
                <p>
                  Haven't signed up? <Link to="/register">Register</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
