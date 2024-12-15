import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";

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
      </Marker>
    </MapContainer>
  );
};

export default LeafletMap;
