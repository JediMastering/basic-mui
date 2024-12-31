import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import { CssBaseline, Container } from "@mui/material";

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Container>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
