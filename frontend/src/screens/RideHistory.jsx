import React from "react";
import { useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import {
  useDeleteBookingMutation,
  useGetRideHistoryByUserIdQuery,
} from "../slices/bookingApiSlice";
import Loader from "../components/Loader";


const RideHistory = () => {
  const { userId } = useParams();
  const {
    data: rideHistory = [], 
    isLoading,
    isError,
    error,
  } = useGetRideHistoryByUserIdQuery(userId);
  const [deleteRide] = useDeleteBookingMutation();

  // Filter out rides where payment is false
  const filteredRideHistory = rideHistory.filter(
    (ride) => ride.payment === true
  );

  // Function to format the date as "yyyy-mm-dd hh:mm"
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, 
    };
    return new Date(date).toLocaleString("en-US", options);
  };

  // Delete handler
  const handleDelete = async (rideId) => {
    console.log(rideId);
    if (window.confirm("Are you sure you want to delete this ride?")) {
      try {
        await deleteRide(rideId).unwrap();
        refetch(); // Refetch the ride history after deletion
      } catch (error) {
        console.error("Failed to delete ride:", error);
      }
    }
  };

  // Loading and error states
  if (isLoading)
    return (
     <Loader/>
    );

  if (isError)
    return (
      <div className="alert alert-danger text-center">
        {error?.data?.message || "Failed to load ride history"}
      </div>
    );

 return (
   <div className="container mt-5">
     <h2 className="mb-3 mt-1 text-center text-warning fs-1">Ride History</h2>
     {filteredRideHistory.length === 0 ? (
       <div className="alert alert-info text-center">No rides found.</div>
     ) : (
       <div className="row">
         {filteredRideHistory.map((ride) => (
           <div key={ride._id} className="col-md-6 mb-4">
             <div className="card shadow-sm h-100">
               <div className="card-body position-relative">
                 {/* Delete Icon */}
                 {ride.status === "Completed" && (
                   <FaTrash
                     className="position-absolute top-0 end-0 m-3 text-danger fs-5"
                     style={{ cursor: "pointer" }}
                     onClick={() => handleDelete(ride._id)}
                     title="Delete Ride"
                   />
                 )}
                 <h5 className="card-title text-secondary mb-3">
                   {formatDate(ride.createdAt)}
                 </h5>
                 <p className="card-text">
                   <strong>Start:</strong> {ride.sourcePlace.name}
                 </p>
                 <p className="card-text">
                   <strong>End:</strong> {ride.destinationPlace.name}
                 </p>
                 <p className="card-text">
                   <strong>Fare:</strong>{" "}
                   <span className="text-success">${ride.amount}</span>
                 </p>
                 <p className="card-text">
                   <strong>Status:</strong>
                   <span
                     className={`badge mx-2 ${
                       ride.status === "Pending"
                         ? "bg-success"
                         : ride.status === "Confirmed"
                         ? "bg-warning text-dark"
                         : ride.status === "Completed"
                         ? "bg-danger"
                         : "bg-secondary"
                     }`}
                   >
                     {ride.status}
                   </span>
                 </p>
                 <p className="card-text">
                   <strong>Payment:</strong>{" "}
                   <span className="badge bg-success">DONE</span>
                 </p>
               </div>
             </div>
           </div>
         ))}
       </div>
     )}
   </div>
 );
};

export default RideHistory;
