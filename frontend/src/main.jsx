import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

//reduxtoolkit provider
import { Provider } from "react-redux";

//importing store from store.js
import store from "./store.js";

//importing privateRoute
import PrivateRoute from "./components/PrivateRoute.jsx";

//importing components
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

//importing screens
import UserDashboard from "./screens/UserDashboard.jsx";
import DriverDashboard from "./screens/DriverDashboard.jsx";
import BookRide from "./screens/BookRide.jsx";
import BookingDetails from "./screens/BookingDetails.jsx";
import Success from "./screens/Success.jsx";
import Failure from "./screens/Failure.jsx";
import History from "./screens/RideHistory.jsx";
import AvailableRide from "./screens/AvailableRide.jsx";
import Notification from "./screens/Notification.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route
          path="/driver/dashboard/available-ride"
          element={<AvailableRide />}
        />
        <Route path="/user/book-ride" element={<BookRide />} />
        <Route
          path="/user/book-ride/details/:bookingId"
          element={<BookingDetails />}
        />
        <Route path="/user/ride-history/:userId" element={<History />} />
        <Route path="/user/notification" element={<Notification />} />

        <Route path="/user/success" element={<Success />} />
        <Route path="/user/failure" element={<Failure />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
 
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
 
);
