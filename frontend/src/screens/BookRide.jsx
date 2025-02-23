import React, { useState, useEffect } from "react";
import DestinationMap from "../components/DestinationMap";
import { useSelector } from "react-redux";
import { useCreateBookingMutation } from "../slices/bookingApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../css/BookRide.css";

const BookRide = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [createBooking] = useCreateBookingMutation();

 
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  
  const [payment, setPayment] = useState(false); // Initializing payment
  const [amount, setAmount] = useState(0); // Initializing amount

  const [sourcePlace, setSourcePlace] = useState("");
  const [sourceCoordinates, setSourceCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [destinationPlace, setDestinationPlace] = useState("");
  const [destinationCoordinates, setDestinationCoordinates] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
      setSourcePlace(userInfo.placeName || "");
      setPhoneNumber(userInfo.phoneNumber || '');
      setSourceCoordinates({
        lat: userInfo.location.coordinates[1],
        lng: userInfo.location.coordinates[0],
      });
    }
  }, [userInfo]);

  //handling source Select
  const handleSourceSelect = (location) => {
    setSourcePlace(location.placeName);
    setSourceCoordinates({ lat: location.lat, lng: location.lng });
  };

  const handleDestinationSelect = (location) => {
    setDestinationPlace(location.placeName);
    setDestinationCoordinates({ lat: location.lat, lng: location.lng });
  };

  const fetchCoordinates = async (placeName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${placeName}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch coordinates: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setSourceCoordinates({ lat, lng: lon });
      } else {
        setSourceCoordinates({ lat: null, lng: null });
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const rideData = {
      name,
      phoneNumber,
      numberOfPeople,
      sourcePlace: {
        name: sourcePlace,
        lat: sourceCoordinates.lat,
        lng: sourceCoordinates.lng,
      },
      destinationPlace: {
        name: destinationPlace,
        lat: destinationCoordinates.lat,
        lng: destinationCoordinates.lng,
      },
      user: userInfo._id,
      payment,
      amount,
    };

    try {
      const result = await createBooking(rideData).unwrap();
      navigate(`/user/book-ride/details/${result._id}`);
    } catch (error) {
      toast.error(error.data?.message || "Failed to book ride");
    }
  };

  //form validation garako 
  const isFormValid = () => {
    return (
      destinationPlace &&
      destinationPlace.toString().trim() !== "" && 
      destinationCoordinates.lat !== null &&
      destinationCoordinates.lng !== null
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 book-ride-title">
        The road is calling, let’s hit it!
      </h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded-4 bg-light">
        <div className="mb-4">
          <label htmlFor="name" className="form-label fw-bold">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="form-label fw-bold">
            Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="Enter your phone number"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberOfPeople" className="form-label fw-bold">
            Number of People
          </label>
          <input
            type="number"
            className="form-control"
            id="numberOfPeople"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            required
            placeholder="Enter number of passengers"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="sourcePlace" className="form-label fw-bold">
            Source Place
          </label>
          <input
            type="text"
            className="form-control"
            id="sourcePlace"
            value={sourcePlace}
            onChange={(e) => setSourcePlace(e.target.value)}
            required
            placeholder="Enter your pickup location"
          />
        </div>
        <div className="mb-4">
          <label className="fw-bold">Click on the map to select Source:</label>
          <DestinationMap onSelectLocation={handleSourceSelect} />
        </div>
        <div className="mb-4">
          <label htmlFor="destinationPlace" className="form-label fw-bold">
            Destination Place
          </label>
          <input
            type="text"
            className="form-control"
            id="destinationPlace"
            value={destinationPlace}
            onChange={(e) => setDestinationPlace(e.target.value)}
            required
            placeholder="Enter your destination"
          />
        </div>
        {/* DestinationMap for selecting destination */}
        <div className="mb-4">
          <label className="fw-bold">
            Click on the map to select Destination:
          </label>

          <DestinationMap onSelectLocation={handleDestinationSelect} />
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button
            type="submit"
            className="btn btn-warning w-100 btn-lg fw-bold text-dark"
            disabled={!isFormValid()}
          >
            Book Ride
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookRide;
