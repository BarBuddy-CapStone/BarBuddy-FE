import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

const CustomerFooter = () => {
  return (
    <footer className="flex flex-col justify-center items-center px-4 py-3 w-full bg-neutral-800">
      <Typography variant="h6" color="#FFA500">
        Bar Buddy
      </Typography>
      <nav className="flex gap-4 text-xs text-white mt-1">
        <Link to="/services">Dịch vụ</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Liên hệ</Link>
      </nav>
      <div className="flex gap-2 mt-2">{/* Social Media Icons */}</div>
    </footer>
  );
};

export default CustomerFooter;
