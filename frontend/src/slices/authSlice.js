import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload)) 

        },
        removeCredentials: (state, action) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
        fetchUserInfoSuccess: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
    }
})
export const { setCredentials, removeCredentials, fetchUserInfoSuccess } = authSlice.actions;
export default authSlice.reducer;