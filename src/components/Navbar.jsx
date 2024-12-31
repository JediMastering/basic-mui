import React from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Login</Link>
      <Link to="/home">Home</Link>
    </nav>
  );
};

export default Navbar;