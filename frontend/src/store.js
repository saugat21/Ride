import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authSliceReducer from './slices/authSlice';
import bookingSliceReducer from './slices/bookingSlice';
import chatSliceReducer from './slices/chatSlice'

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        booking: bookingSliceReducer,
        chat:chatSliceReducer,
        
    },
    // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware), 
    devTools: true,
});

export default store;