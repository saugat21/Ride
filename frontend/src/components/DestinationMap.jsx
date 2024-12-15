import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
const DestinationMap = ({ onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState("");

  // Custom hook to handle map click events
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation(e.latlng); // Update selectedLocation state on click
        fetchPlaceName(lat, lng); // Fetch place name on click
        onSelectLocation({ lat, lng }); // Pass selected location to parent component
      },
    });

    return selectedLocation === null ? null : (
      <Marker position={selectedLocation}>
        <Popup>{selectedPlaceName}</Popup>
      </Marker>
    );
  }

  // Function to fetch place name using reverse geocoding
  const fetchPlaceName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch place details");
      }
      const data = await response.json();
      setSelectedPlaceName(data.display_name); // Update selected place name
      onSelectLocation({ lat, lng, placeName: data.display_name });
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <MapContainer
      center={[27.1433, 87.7458]}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker /> {/* Render Marker on map click */}
    </MapContainer>
  );
};

export default DestinationMap;
