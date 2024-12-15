import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  const userDashboardPath =
    userInfo.role === "user" ? "/user/dashboard" : "/driver/dashboard";


  if (location.pathname.startsWith("/user") && userInfo.role !== "user") {
    return <Navigate to={userDashboardPath} replace />;
  }

  if (location.pathname.startsWith("/driver") && userInfo.role !== "driver") {
    return <Navigate to={userDashboardPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
