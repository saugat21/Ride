import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constant';


const baseQuery = fetchBaseQuery({

     baseUrl: BASE_URL, 
    prepareHeaders: (headers, { getState }) => {
        // Retrieve the JWT token from localStorage where it's stored inside userInfo
        const userInfo = JSON.parse(localStorage.getItem('userInfo')); // assuming userInfo is stored in localStorage

        const token = userInfo ? userInfo.token : null;

        // If token exists, set it in the Authorization header
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
     
     });

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User', 'Booking','Notification', 'Ride'],
    endpoints: (builder) => ({

    })
})