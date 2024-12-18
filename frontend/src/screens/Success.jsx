import React, { useEffect } from "react";

import { FaCheckCircle } from "react-icons/fa";
import "../css/SuccessPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdataPaymentMutation } from "../slices/bookingApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Success = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;
  const navigate = useNavigate();
  const location = useLocation();
  const [updatePayment] = useUpdataPaymentMutation();

  // Parse query parameters from the success URL
  // const queryParams = new URLSearchParams(location.search);
  // const bookingId = queryParams.get("bookingId");
  // const paymentStatus = queryParams.get("payment") === "true";
  // const amount = queryParams.get("amount");

  // Handler for navigating to Ride History
  const handleRideHistoryClick = () => {
    if (userId) {
      navigate(`/user/ride-history/${userId}`);
    } else {
      toast.error("error while passsing the userId");
    }
  };

  useEffect(() => {
    console.log("Query parameters:", location.search); // Check the URL query string

    const queryParams = new URLSearchParams(location.search);
    const bookingId = queryParams.get("bookingId");
    const paymentStatus = queryParams.get("payment") === "true";
    const amount = queryParams.get("amount");

    console.log("Parsed values:", { bookingId, paymentStatus, amount });

    if (bookingId && paymentStatus) {
      // Update the payment status in the database
      updatePayment({ bookingId, payment: paymentStatus, amount })
        .unwrap()
        .then(() => {
          toast.success("Payment Successful");
        })
        .catch((error) => {
          toast.error("Failed to update payment status");
          console.error("Error updating payment status:", error);
        });
    }
  }, [location.search, updatePayment]);

  // useEffect(() => {
  //   if (bookingId && paymentStatus) {
  //     // Update the payment status in the database
  //     updatePayment({ bookingId, payment: paymentStatus, amount })
  //       .unwrap()
  //       .then(() => {
  //         toast.success("Payment Successful");
  //       })
  //       .catch((error) => {
  //         toast.error("Failed to update payment status");
  //         console.error("Error updating payment status:", error);
  //       });
  //   }
  // }, [bookingId, paymentStatus, amount, updatePayment]);

  return (
    <div className="success-page">
      <div className="success-container">
        <FaCheckCircle className="success-icon" />
        <h1>Payment Successful!</h1>
        <p>
          Thank you for your payment. Your transaction has been completed
          successfully.
        </p>
        <div className="button-group">
          <button className="btn btn-warning" onClick={handleRideHistoryClick}>
            Ride History
          </button>
          <button className="back-button" onClick={() => navigate("/")}>
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
