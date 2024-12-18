import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authSliceReducer from './slices/authSlice';
import bookingSliceReducer from './slices/bookingSlice';

// Define the localStorageMiddleware as shown earlier
const localStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    if (action.type === "auth/setCredentials") {
        const { userInfo } = store.getState().auth;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        console.log("LocalStorage updated via middleware:", userInfo);
    }
    return result;
};

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        booking: bookingSliceReducer,
    },
    // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware).concat(localStorageMiddleware), 
    devTools: true,
});

export default store;