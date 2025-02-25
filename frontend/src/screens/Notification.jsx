import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  useGetAvailableRideQuery,
  useUpdateNotificationStatusMutation,
  useDeleteNotificationMutation,
} from "../slices/bookingApiSlice";
import "../css/Notification.css";

const Notification = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = useGetAvailableRideQuery();
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

    useEffect(() => {
      
      if (!isLoading && !error) {
        refetch();
      }
    }, [bookings, isLoading, error, refetch]);

  if (isLoading) return <p>Loading notifications...</p>;
  if (error) return <p>Error loading notifications. Please try again later.</p>;

  const notifications = bookings?.filter(
    (booking) =>
      booking.status === "Confirmed" &&
      booking.user === userInfo._id &&
      !booking.notification?.isDeleted
  );

  const markAsRead = async (id) => {
    try {
      await updateNotificationStatus({ bookingId: id, isRead: true }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteNotificationHandler = async (id) => {
    try {
      await deleteNotification(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  

  return (
    <div className="container mt-4">
      <h2 className="d-flex align-item-center justify-content-center mb-3">
        Your Notifications
      </h2>
      {notifications?.length > 0 ? (
        <div className="notification-list">
          {notifications.map((booking) => (
            <div
              key={booking._id}
              className={`alert ${
                booking.notification?.isRead ? "alert-secondary" : "alert-info"
              } d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3`}
              role="alert"
            >
              <span
                className="flex-grow-1 text-wrap mb-2 mb-md-0 fw-bold text-dark"
                style={{ fontSize: "1.1rem" }}
              >
                {`Your ride has been confirmed by `}
                <strong>{booking.driverName}</strong>
                {`. Please contact `}
                <strong>{booking.driverPhoneNumber}</strong>
                {` for further details.`}
              </span>
              <div className="btn-group">
                {!booking.notification?.isRead && (
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => markAsRead(booking._id)}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteNotificationHandler(booking._id)}
                  aria-label="Delete Notification"
                >
                  <FaTimes />
                </button>
               
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-bold text-center fs-2">No notifications available.</p>
      )}
     
    </div>
  );
};

export default Notification;
