import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/DriverDashboard.css";
const driverDashboard = () => {
  const navigate = useNavigate();
  const handleFindRide = () => {
    navigate("/driver/dashboard/available-ride");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-caption">
        <h1>Drive with Passion, Earn with Purpose!</h1>
        <p>Your journey begins here—let’s find the next adventure!</p>
        <button className="btn btn-warning" onClick={handleFindRide}>
          Find a ride
        </button>
      </div>
    </div>
  );
};

export default driverDashboard;
