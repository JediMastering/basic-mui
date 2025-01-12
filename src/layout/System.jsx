import React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { AppBar, Toolbar, Container, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { blueGrey } from "@mui/material/colors";
import { useNavigate, Link } from "react-router-dom";

const blueGreyColor = blueGrey[800];

export default function SwipeableTemporaryDrawer({ children }) {
  const [state, setState] = React.useState({ left: false });
  const navigate = useNavigate();

  // Função para abrir/fechar o Drawer
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  // Função de Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/"); // Redireciona para a página inicial
  };

  // Lista de itens do Drawer
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box>
        <ListItem component={Link} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to="/settings">
          <ListItemText primary="Configurações" />
        </ListItem>
        <ListItem component={Link} to="/profile">
          <ListItemText primary="Perfil" />
        </ListItem>
        <ListItem component={Link} to="/table">
          <ListItemText primary="Tabela" />
        </ListItem>
        {/* Botão de Logout */}
        <ListItemButton
          onClick={handleLogout}
          component="a"
          sx={{color: "rgba(117, 117, 117, 0.87)"}}
        >
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          {/* AppBar Fixado no topo */}
          <AppBar position="fixed" sx={{ backgroundColor: blueGreyColor }}>
            <Toolbar sx={{ paddingLeft: "0px" }} disableGutters>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer(anchor, true)}
                edge="start"
                sx={{ m: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Drawer */}
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>

          {/* Container para conteúdo principal */}
          <Container
            sx={{
              marginTop: 8, // Ajuste a margem superior conforme necessário
              paddingTop: 1,
            }}
          >
            {children}
          </Container>
        </React.Fragment>
      ))}
    </div>
  );
}
