import { apiSlice } from "./apiSlice";
import { BOOKINGS_URL } from "../constant";

export const bookingsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: BOOKINGS_URL,
                method: 'POST',
                body: bookingData,
            }),
        }),
        updataPayment: builder.mutation({
            query: ({ bookingId, payment, amount }) => ({
                url: `${BOOKINGS_URL}/${bookingId}/payment`,
                method: 'PUT',
                body: { payment, amount },
            })
        }),
        getBookingById: builder.query({
            query: (bookingId) => ({
                url: `${BOOKINGS_URL}/${bookingId}`,
                method: 'GET'
            }),
            providesTags: (result, error, bookingId) => [{ type: 'Booking', id: bookingId }],
            keepUnusedDataFor: 5, // Optionally, you can keep data for 60 seconds after last usage
        }),

        getRideHistoryByUserId: builder.query({
            query: (userId) => ({
                url: `${BOOKINGS_URL}/history/${userId}`,
                method: 'GET'
            }),
            providesTags: (userId) => [{ id: userId }],
            keepUnusedDataFor: 5,
        }),
        getAvailableRide: builder.query({
            query: () => ({
                url: `${BOOKINGS_URL}/available-ride`,
                method: 'GET'
            }),
            providesTags: ["Bookings"],
            keepUnusedDataFor: 5,
            refetchOnReconnect: true,
            
        }),
        updateRideStatus: builder.mutation({
            query: ({ bookingId, status,driverName, driverPhoneNumber }) => ({
                url: `${BOOKINGS_URL}/rides/${bookingId}/status`,
                method: 'PATCH',
                body: { status, driverName, driverPhoneNumber },
            }),
            invalidatesTags: ['Ride', 'Notification'],
        }),
        updateNotificationStatus: builder.mutation({
            query: ({ bookingId, isRead }) => ({
                url: `${BOOKINGS_URL}/${bookingId}/mark-read`,
                method: "PATCH",
                body: { isRead },
            }),
            invalidatesTags: ['Ride' , 'Notification'],
        }),
        deleteNotification: builder.mutation({
            query: (bookingId) => ({
                url: `${BOOKINGS_URL}/${bookingId}/delete-notification`,
                method: "PATCH",
            }),
            invalidatesTags: ['Ride','Notification'],
        }),
        deleteBooking: builder.mutation({
            query: (bookingId) => ({
                url: `${BOOKINGS_URL}/${bookingId}`,
                method: "DELETE",
            }),
            providesTags: ["Bookings"],
            keepUnusedDataFor: 5,
            refetchOnReconnect: true,
        }),

    })
})

export const { useCreateBookingMutation, useGetBookingByIdQuery, useUpdataPaymentMutation, useGetRideHistoryByUserIdQuery, useGetAvailableRideQuery,useUpdateRideStatusMutation,useUpdateNotificationStatusMutation,useDeleteNotificationMutation,useDeleteBookingMutation} = bookingsApiSlice;