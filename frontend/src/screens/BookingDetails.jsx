import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import esewaLogo from "../assets/esewa.png";
import { useNavigate } from "react-router-dom";
import cashOnDelivery from "../assets/cc.png"
import { useGetBookingByIdQuery } from "../slices/bookingApiSlice";
import { useUpdateAmountMutation } from "../slices/bookingApiSlice";
import Loader from "../components/Loader";

const BookingDetails = () => {
  const { bookingId } = useParams(); 
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetBookingByIdQuery(bookingId);
   const [updateAmount] = useUpdateAmountMutation();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch booking details");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      // Calculate distance in kilometers
      const distanceInKm = data.distance || 0; // Assume distance is in kilometers from your API
      const ratePerKm = 20; // Rate per kilometer
      const peopleCount = data.numberOfPeople || 1; // Default to 1 person if not provided
      // Calculate amount (assuming rate is 20 Rs per km)
      const calculatedAmount = (distanceInKm * ratePerKm * peopleCount).toFixed(
        2
      ); // 20 Rs per km

      setAmount(parseFloat(calculatedAmount));
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    console.log("Booking not found or data is not defined:", data);
    return <div>Booking not found</div>;
  }

  const callEsewa = async () => {
    var path = "https://uat.esewa.com.np/epay/main";
    var params = {
      amt: amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: `ee2c3ca1-${bookingId}-${new Date().getTime()}`, 
      scd: "EPAYTEST", 
       su: `http://localhost:5173/user/success?bookingId=${bookingId}&payment=true&amount=${amount}`, // Success URL after payment completion
      fu: "http://localhost:5173/user/failure", // Failure URL if payment fails
    };

    function post(path, params) {
      var form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", path);

      for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
      }

      document.body.appendChild(form);
      form.submit();
    }

    post(path, params);
  };

 const handleCOD =async () => {
  try {
      await updateAmount({ bookingId, amount }).unwrap();
      navigate(`/user/success`, {
        state: {
          bookingId,
          amount,
        },
      });
    } catch (error) {
      toast.error("Error updating amount");
    }
 };
  const {
    name,
    phoneNumber,
    numberOfPeople,
    sourcePlace,
    destinationPlace,
    distance,
  } = data;

  return (
    <>
      <h2 className="text-center mb-3 fw-bold text-warning">Booking Details</h2>
      <div className="container d-flex align-items-center justify-content-center ">
        <div className="card shadow-lg border-0 rounded-4 mx-3">
          <div className="card-body p-4">
            <h5 className="card-title text-center text-secondary mb-3">
              <span className="fw-bold">Booking ID:</span> {bookingId}
            </h5>
            <div className="mb-3">
              <p className="card-text fs-5">
                <span className="fw-bold text-dark">Name:</span> {name}
              </p>
              <p className="card-text fs-5">
                <span className="fw-bold text-dark">Phone Number:</span>{" "}
                {phoneNumber}
              </p>
              <p className="card-text fs-5">
                <span className="fw-bold text-dark">Number of People:</span>{" "}
                {numberOfPeople}
              </p>
              <p className="card-text fs-5">
                <span className="fw-bold text-dark">Source Place:</span>{" "}
                {sourcePlace.name}
              </p>
              <p className="card-text fs-5">
                <span className="fw-bold text-dark">Destination Place:</span>{" "}
                {destinationPlace.name}
              </p>
              <p className="card-text fs-5">
                <span className="fw-bold text-dark">Distance:</span> {distance}{" "}
                km
              </p>
              <p className="card-text fs-5">
                <span className="fw-bold text-dark">Amount:</span>{" "}
                <span className="text-success fw-bold">{amount} Rs</span>
              </p>
            </div>
            <div
              className="row  align-items-center mt-4 gap-5"
              style={{ gap: "10px" }}
            >
              <div
                className="col-auto d-flex justify-content-center mb-1"
                onClick={callEsewa}
                style={{ cursor: "pointer" }}
              >
                <img src={esewaLogo} alt="eSewa" className="p-1" height="70" />
              </div>

              <div
                className="col-auto d-flex justify-content-center mb-1"
                onClick={handleCOD}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={cashOnDelivery}
                  alt="Cash on Delivery"
                  className="p-1"
                  height="60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingDetails;
