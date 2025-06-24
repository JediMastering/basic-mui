import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/material/locale";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import ProtectedRoute from "./service/ProtectedRoute";
import routes from "./service/Routes";
import ExamplePage from "./pages/ExamplePage";

// Create theme with Portuguese locale support
const theme = createTheme({
  palette: {
    background: {
      default: "#0d1b2a",
      paper: "#1a2c3d",
    },
    primary: {
      main: "#1976d2",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
    divider: "#444444",
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
}, ptBR);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Router>
            <Routes>
              {/* Use the new example page for the root route */}
              <Route path="/" element={<ExamplePage />} />
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
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
