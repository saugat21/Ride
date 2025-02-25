import React from "react";
import { toast } from "react-toastify";
import {
  useGetAvailableRideQuery,
  useUpdateRideStatusMutation,
} from "../slices/bookingApiSlice";
import "../css/AvailableRide.css";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";


const AvailableRide = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: rides,
    isLoading,
    error,
    refetch,
  } = useGetAvailableRideQuery(undefined, {
    pollingInterval: 5000,
  });
  const [updateRideStatus] = useUpdateRideStatusMutation();

  // Check if the driver has an active ride
  const hasActiveRide = rides?.some(
    (ride) => ride.driverName === userInfo.name && ride.status !== "Completed"
  );

  

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return toast.error("Error loading rides. Please try again later.");
  }

  const handleStatusChange = async (bookingId, currentStatus, payment) => {
    let newStatus,
      updatedPayment = payment;

    // Update status and payment fields
    if (currentStatus === "Pending") {
      newStatus = "Confirmed";
    } else if (currentStatus === "Confirmed") {
      newStatus = "Completed";
      updatedPayment = true;
    } else {
      return;
    }

    try {
      await updateRideStatus({
        bookingId,
        status: newStatus,
        driverName: userInfo.name,
        driverPhoneNumber: userInfo.phoneNumber,
        payment: updatedPayment,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update ride status:", error);
    }
  };

  const handleAcceptRide = (ride) => {
    if (hasActiveRide && ride.status === "Pending") {
      toast.warning(
        "You can't accept a ride until you complete the current one."
      );
    } else {
      handleStatusChange(ride._id, ride.status, ride.payment);
    }
  };

  return (
    <div className="available-rides-container">
      <h1>Available Rides</h1>
      <table className="rides-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>PhoneNumber</th>
            <th>No. of People</th>
            <th>Start Location</th>
            <th>End Location</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rides?.map((ride, index) => (
            <tr key={ride._id}>
              <td>{index + 1}</td>
              <td>{ride.name}</td>
              <td>{ride.phoneNumber}</td>
              <td>{ride.numberOfPeople || "N/A"}</td>
              <td>{ride.sourcePlace.name || "N/A"}</td>
              <td>{ride.destinationPlace.name || "N/A"}</td>
              <td>${ride.amount}</td>
              <td>
                <span
                  className={`payment-badge ${
                    ride.payment ? "paid" : "not-paid"
                  }`}
                >
                  {ride.payment ? "True" : "False"}
                </span>
              </td>
              <td>
                <span
                  className={`status-badge ${
                    ride.status ? ride.status.toLowerCase() : "unknown"
                  }`}
                >
                  {ride.status || "Unknown"}
                </span>
              </td>
              <td>
                {ride.status !== "Completed" ? (
                  <button
                    className="status-action-button"
                    onClick={() => handleAcceptRide(ride)}
                  >
                    {ride.status === "Pending"
                      ? "Accept Ride"
                      : "Complete Ride"}
                  </button>
                ) : (
                  <button
                    className="status-action-button btn btn-danger"
                    disabled
                  >
                    Ride Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailableRide;
