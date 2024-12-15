import React from "react";
import { FiLoader } from "react-icons/fi"; // Import the loader icon
import "../css/Loader.css"
const Loader = () => {
  return (
    <div className="spinner-container">
      <FiLoader className="spinner-icon" />
    </div>
  );
};

export default Loader;
