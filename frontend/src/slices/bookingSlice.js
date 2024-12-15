import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bookings: localStorage.getItem('bookings') ? JSON.parse(localStorage.getItem('bookings')) : []
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        addBookings: (state, action) => {
            state.bookings.push(action.payload);
            localStorage.setItem('bookings', JSON.stringify(state.bookings));
        },

    }
})

export const { addBookings } = bookingSlice.actions;
export default bookingSlice.reducer;