import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/material/locale";
import CssBaseline from "@mui/material/CssBaseline";

import ProtectedRoute from "./service/ProtectedRoute";
import routes from "./service/Routes";

// Cria o tema com suporte ao idioma português
const theme = createTheme({}, ptBR);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <CssBaseline />
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
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
