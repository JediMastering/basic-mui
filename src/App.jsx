import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/material/locale";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from './framework/layouts/MainLayout';
import UsersPage from './pages/users/UsersPage';

import ProtectedRoute from "./service/ProtectedRoute";
import routes from "./service/Routes";

// Cria o tema com suporte ao idioma português
const theme = createTheme({}, ptBR);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <CssBaseline />
        <MainLayout>
          <UsersPage />
        </MainLayout>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
