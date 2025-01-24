import React from "react";
import { useUpdateUserLocationMutation } from "../slices/userApiSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserInfoSuccess } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import LeafletMap from "./LeafletMap";


const Map = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateUserLocation, { isLoading, error }] =
    useUpdateUserLocationMutation();

  useEffect(() => {
    const updateLocation = async (latitude, longitude, placeName) => {
      try {
        const updatedUser = await updateUserLocation({
          userId: userInfo._id,
          latitude,
          longitude,
          placeName,
        }).unwrap();
        dispatch(fetchUserInfoSuccess(updatedUser));
      } catch (error) {
        console.error("Error updating location: ", error);
      }
    };

    const fetchPlaceName = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch place details: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        const placeName = data.display_name; // Extract place name from response
        updateLocation(lat, lng, placeName);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    const getUserGeolocation = () => {
      const defaultLocation = {
        latitude: 27.7172, // Default latitude (Kathmandu)
        longitude: 85.324, // Default longitude (Kathmandu)
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchPlaceName(latitude, longitude);
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                console.error("The request to get user location timed out.");
                break;
              default:
                console.error(
                  "An unknown error occurred while fetching geolocation."
                );
            }
            // Use fallback location on error
            fetchPlaceName(defaultLocation.latitude, defaultLocation.longitude);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Use fallback location
        fetchPlaceName(defaultLocation.latitude, defaultLocation.longitude);
      }
    };

    getUserGeolocation();
  }, [updateUserLocation, userInfo._id, dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <LeafletMap />
    </div>
  );
};

export default Map;
