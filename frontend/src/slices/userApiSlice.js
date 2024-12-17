import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constant";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data,
                
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: USERS_URL,
                method: 'POST',
                body: data,
               
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
               

            }),
        }),
        updateUserLocation: builder.mutation({
            query: (location) => ({
                url: `${USERS_URL}/update-location`,
                method: 'POST',
                body: location,
               
            }),
        }),
    })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserLocationMutation } = usersApiSlice;