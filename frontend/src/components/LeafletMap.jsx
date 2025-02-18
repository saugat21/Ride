import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


const LeafletMap = ({ userLocation }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Default center for the map (Kathmandu, Nepal)
  const defaultCenter = { lat: 27.7172, lng: 85.324 };

  const center = userInfo?.location?.coordinates
    ? {
        lat: userInfo.location.coordinates[1], // Latitude from userInfo
        lng: userInfo.location.coordinates[0], // Longitude from userInfo
      }
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>
          {userInfo?.location?.placeName
            ? `Location: ${userInfo.location.placeName}`
            : "Default Location"}
        </Popup>
        icon={customIcon}
      </Marker>
    </MapContainer>
  );
};

export default LeafletMap;
