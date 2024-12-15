import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/Register.css";
import Reg from "../assets/forms.jpg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber]=useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      name,
      email,
      password,
      phoneNumber,
      role,
      ...(role === "driver" && {
        licenseNumber,
        vehicleDetails: { type: vehicleType, model: vehicleModel },
      }),
    };

    try {
      const userData = await register(user).unwrap();
      dispatch(setCredentials(userData));
      toast.success("User Registered Successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to register. Please check your details.");
    }
  };

  return (
    <div className="register-page d-flex align-items-center">
      <div className="register-form-container">
        <form onSubmit={handleSubmit} className="form-card shadow rounded-4">
          <h1 className="mb-4 stylish-heading">Create Your Account</h1>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingName"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="floatingName">Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingEmail">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="floatingNumber"
              placeholder="Your Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <label htmlFor="floatingNumber">Phone Number</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="form-floating mb-3">
            <select
              className="form-select"
              id="floatingRole"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="driver">Driver</option>
            </select>
            <label htmlFor="floatingRole">Role</label>
          </div>
          {role === "driver" && (
            <>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingLicenseNumber"
                  placeholder="License Number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
                <label htmlFor="floatingLicenseNumber">License Number</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingVehicleType"
                  placeholder="Vehicle Type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                />
                <label htmlFor="floatingVehicleType">Vehicle Type</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingVehicleModel"
                  placeholder="Vehicle Model"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                />
                <label htmlFor="floatingVehicleModel">Vehicle Model</label>
              </div>
            </>
          )}
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={isLoading}
          >
            Register
          </button>
        </form>
      </div>
      <div className="register-image-container">
        <img
          src={Reg}
          alt="Ride sharing illustration"
          className="register-image"
        />
      </div>
    </div>
  );
};

export default Register;
