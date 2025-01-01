import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./pages/Login";
import NotFound from "./components/NotFound";
import System from "./layout/System"
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<System><Home /></System>} />
        <Route path="test" element={<Test />} />
        <Route path="/dashboard" element={<System><Dashboard /></System>} />
        <Route path="/settings" element={<System><Settings /></System>} />
        <Route path="/profile" element={<System><Profile /></System>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
