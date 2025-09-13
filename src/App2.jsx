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
import TestLayout from "./framework/layouts/TestLayout";
import TestLayoutPage from "./pages/TestLayoutPage";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  useMediaQuery,
  Stack
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Cria o tema com suporte ao idioma português
const theme = createTheme(
  {
    palette: {
      background: {
        default: "#0d1b2a",
        paper: "#0d1b2a", // Define a cor de fundo padrão para o tema
      },
      primary: {
        main: "#1976d2",
      },
      text: {
        primary: "#fff", // Define a cor do texto padrão como branco
        secondary: "#aaa",
      },
    },
    typography: {
      fontFamily: "Roboto, Arial",
    },
  },
  ptBR
);

const drawerWidth = 320;

function SidebarContent() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
        Filtros de pesquisa
      </Typography>
      <TextField
        size="small"
        fullWidth
        placeholder="Pesquisa rápida"
        sx={{
          mb: 2,
          "& .MuiInputBase-input": { color: "text.primary" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
            "&:hover fieldset": { borderColor: "text.primary" },
            "&.Mui-focused fieldset": { borderColor: "text.primary" },
          },
          "& .MuiInputLabel-root": { color: "text.secondary" },
          "& .MuiInputBase-input::placeholder": { color: "text.secondary" },
        }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
        }}
      />
      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 2, bgcolor: "#1a2c3d", fontSize: 14, borderColor: "#444" }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.primary" }}>
          Consultas salvas
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Nenhuma consulta salva
        </Typography>
        <Typography variant="caption" sx={{ color: "#888" }}>
          Tenha acesso rápido às suas pesquisas salvando uma consulta.
        </Typography>
      </Paper>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: "text.primary" }}>
          Geral
        </Typography>
        <Stack spacing={2}>
          <TextField
            size="small"
            label="Identificador"
            fullWidth
            sx={{
              "& .MuiInputBase-input": { color: "text.primary" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                "&:hover fieldset": { borderColor: "text.primary" },
                "&.Mui-focused fieldset": { borderColor: "text.primary" },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
            }}
            InputLabelProps={{
              style: { color: "#aaa" },
            }}
          />
          <TextField
            size="small"
            label="Nome"
            fullWidth
            sx={{
              "& .MuiInputBase-input": { color: "text.primary" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                "&:hover fieldset": { borderColor: "text.primary" },
                "&.Mui-focused fieldset": { borderColor: "text.primary" },
              },
              "& .MuiInputLabel-root": { color: "text.secondary" },
            }}
            InputLabelProps={{
              style: { color: "#aaa" },
            }}
          />
          <FormControl size="small" fullWidth>
            <InputLabel sx={{ color: "text.secondary" }}>Situação</InputLabel>
            <Select
              label="Situação"
              defaultValue="Ativo"
              sx={{
                color: "text.primary",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.4)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "text.primary" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "text.primary" },
                "& .MuiSvgIcon-root": { color: "text.primary" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#1a2c3d", // Fundo do menu dropdown
                    color: "text.primary",
                  },
                },
              }}
            >
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Inativo">Inativo</MenuItem>
              <MenuItem value="Todos">Todos</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>
      <Button
        size="small"
        sx={{ textTransform: "none", mb: 2, color: "primary.main" }}
        startIcon={<AddIcon fontSize="small" sx={{ color: "primary.main" }} />}
      >
        Filtros avançados
      </Button>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          fullWidth
          sx={{ bgcolor: "primary.main", color: "#fff" }}
        >
          Salvar
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          fullWidth
          sx={{ bgcolor: "primary.main", color: "#fff" }}
        >
          Pesquisar
        </Button>
      </Stack>
    </Box>
  );
}

function MainContent() {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ textAlign: "center", color: "text.secondary" }}>
        <InfoOutlinedIcon sx={{ fontSize: 48, mb: 2, color: "text.primary" }} />
        <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
          Não encontramos nenhum resultado para sua pesquisa.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Verifique se os filtros e os termos da pesquisa estão corretos.
        </Typography>
      </Box>
    </Box>
  );
}

const App = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
        {/* AppBar */}
        <AppBar
          position="fixed" // Alterado para 'fixed' para estar sempre no topo
          color="default"
          elevation={1}
          sx={{
            bgcolor: "background.default", // Azul escuro
            color: "text.primary", // Branco
            borderBottom: "1px solid #444", // Borda mais escura para contraste
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }} // Esconde no desktop
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="img"
              src="https://i.imgur.com/8Km9tLL.png"
              alt="Grok"
              sx={{ height: 32, mr: 2, filter: "invert(1)" }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "text.primary", mr: 3 }}
            >
              Grok
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "primary.main", fontWeight: 500, mr: 3 }}
            >
              Cadastro
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "primary.main", fontWeight: 700, mr: 3 }}
            >
              Entrega (PR066)
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button sx={{ color: "text.primary" }}>Portais</Button>
            <Button sx={{ color: "text.primary" }}>Minhas tarefas</Button>
            <Button sx={{ color: "text.primary" }}>Ferramentas</Button>
            <IconButton color="inherit">
              <NotificationsNoneIcon />
            </IconButton>
            <IconButton color="inherit">
              <HelpOutlineIcon />
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #444", // Borda mais escura
              bgcolor: "background.default", // Azul escuro
              color: "text.primary", // Branco
              marginTop: isMobile ? 0 : "64px", // Ajusta para ficar abaixo da AppBar no desktop
            },
          }}
        >
          <SidebarContent />
        </Drawer>
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: "64px", // Garante que o conteúdo comece abaixo da AppBar fixa
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: "background.default",
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MainContent />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
