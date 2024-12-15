import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-3 bg-dark text-white text-center">
      <div className="container">
        <p>Design and Developed by Saugat Baral &copy; {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;
