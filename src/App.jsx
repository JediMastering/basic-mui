import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./service/ProtectedRoute";
import routes from "./service/Routes";

const App = () => {
  return (
    <Router>
      <Routes>
        {routes.map(({ path, element, isProtected }, index) => (
          <Route
            key={index}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute>{element}</ProtectedRoute>
              ) : (
                element
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
