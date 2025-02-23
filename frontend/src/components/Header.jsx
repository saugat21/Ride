import React from "react";
import Logo from "../assets/ride-logoo.jpeg";
import { Link, useNavigate,useLocation,Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { removeCredentials } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/userApiSlice";
import { toast } from "react-toastify";


const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();

  

  // Check if user is on a dashboard route
  const isDashboard =
    location.pathname.startsWith("/user/") ||
    location.pathname.startsWith("/driver/");

  if (location.pathname === "/") {
    if (!userInfo) {
      return <Navigate to="/login" replace />;
    }
    if (userInfo.role === "user") {
      return <Navigate to="/user/dashboard" replace />;
    } else if (userInfo.role === "driver") {
      return <Navigate to="/driver/dashboard" replace />;
    }
  }

  const handleLogout = async () => {
    await logout().unwrap();
    dispatch(removeCredentials());
    toast.success("Logout Successfull");
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!userInfo) {
      return "/login";
    }
    return userInfo.role === "driver" ? "/driver/dashboard" : "/user/dashboard";
  };

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container-fluid">
            <Link
              to={getDashboardPath()}
              className="d-flex align-items-center text-white text-decoration-none me-3"
            >
              <img
                src={Logo}
                alt="Logo"
                style={{ height: "50px", width: "auto" }}
                className="me-2 img-fluid rounded-5"
              />
              <span className="fs-4 heading">Ride Sharing</span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto text-center">
                {isDashboard && userInfo ? (
                  <>
                    <li className="nav-item">
                      <button
                        onClick={handleLogout}
                        className="btn btn-outline-light me-2 mb-2 mb-lg-0"
                      >
                        Logout
                      </button>
                    </li>
                    <li className="nav-item dropdown">
                      <button
                        className="btn btn-outline-light dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {userInfo.name}
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-dark"
                        aria-labelledby="dropdownMenuButton"
                      >
                        {userInfo.role === "user" && (
                          <>
                            <li>
                              <Link
                                to="/user/book-ride"
                                className="dropdown-item"
                              >
                                Book Ride
                              </Link>
                            </li>
                            <li>
                              <Link
                                to={`/user/ride-history/${userInfo._id}`}
                                className="dropdown-item"
                              >
                                Ride History
                              </Link>
                            </li>
                          </>
                        )}
                        {userInfo.role === "driver" && (
                          <li>
                            <Link
                              to="driver/dashboard/available-ride"
                              className="dropdown-item"
                            >
                              Find Ride
                            </Link>
                          </li>
                        )}
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link
                        to="/login"
                        className="btn btn-outline-light me-2 mb-2 mb-lg-0"
                      >
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/register" className="btn btn-warning">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
