import React, { useEffect, useState } from "react";
import Image from "../assets/ai.jpg";
import { useSelector } from "react-redux";
import Map from "../components/Map";
import { useNavigate } from "react-router-dom";
import { useGetAvailableRideQuery } from "../slices/bookingApiSlice";
import Loader from "../components/Loader";




const userDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // Fetch bookings data using RTK Query
  const { data: bookings, isLoading } = useGetAvailableRideQuery();

  // State for unread notifications count
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Calculate unread notifications
  useEffect(() => {
    if (bookings) {
      const unreadCount = bookings.filter(
        (booking) =>
          booking.status === "Confirmed" &&
          booking.user === userInfo._id &&
          !booking.notification?.isRead &&
          !booking.notification?.isDeleted
      ).length;

      setUnreadNotificationsCount(unreadCount);
    }
  }, [bookings, userInfo]);

   if (isLoading)
     return (
     <Loader/>
     );

   return (
     <div className="container mt-5">
       <div className="row align-items-center">
         {/* Profile Image */}
         <div className="col-md-6 text-center">
           <img
             src={Image}
             alt="Profile"
             className="img-fluid rounded-circle"
             style={{ maxHeight: "200px" }}
           />
         </div>

         {/* User Details */}
         <div className="col-md-6">
           <h2>Welcome To Our Ride {userInfo.name}</h2>
           <p>
             <strong>Email:</strong> {userInfo.email}
           </p>
           <p>
             <strong>Role:</strong> {userInfo.role}
           </p>

           {/* Notification Button */}
           <div className="position-relative">
             <button
               variant="primary"
               className="btn btn-warning mt-3 position-relative"
               onClick={() => navigate("/user/notification")}
             >
               Notifications
               {unreadNotificationsCount > 0 && (
                 <span
                   className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                   style={{ fontSize: "0.95rem" }}
                 >
                   {unreadNotificationsCount}
                   <span className="visually-hidden">unread notifications</span>
                 </span>
               )}
             </button>
           </div>
         </div>
       </div>

       {/* Book a Ride and Map Section */}
       <div className="row align-item-center mt-5">
         <div className="col-md-6 d-flex align-items-center justify-content-center flex-column">
           <h1>WANNA SHARE A RIDE?</h1>
           <button
             variant="primary"
             className="btn btn-warning mt-3 mb--3"
             onClick={() => navigate("/user/book-ride")}
           >
             Book a Ride
           </button>
         </div>
         <div className="col-md-6 ">
           <Map />
         </div>
       </div>
     </div>
   );
};

export default userDashboard;
