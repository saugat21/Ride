import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constant';


const baseQuery = fetchBaseQuery({

     baseUrl: BASE_URL, 
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('jwt');  // Get token from localStorage
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);  // Add token to Authorization header
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