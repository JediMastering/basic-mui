import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import MenuIcon from "@mui/icons-material/Menu";
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from "@mui/material/IconButton";
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MailIcon from '@mui/icons-material/Mail';
import { AppBar, Toolbar } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { Container } from "@mui/material";

import { Link } from "react-router-dom";

const blueGreyColor = blueGrey[800];

export default function SwipeableTemporaryDrawer({ children }) {
  const [state, setState] = React.useState({ left: false });
  const theme = useTheme();

  // Função para abrir/fechar o Drawer
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  // Lista de itens do Drawer
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
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
        <ListItem component={Link} to="/">
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
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

          {/* Container sem margem à esquerda, alinhado ao topo da página */}
          <Container
            sx={{
              marginTop: 8, // Ajuste a margem superior conforme necessário
              paddingTop: 1,
              paddingLeft: 0, // Remover o padding das laterais
              paddingRight: 0, // Remover o padding das laterais
              '@media (min-width:600px)': {
                paddingLeft: 0, // Definir o padding para telas maiores que 600px
                paddingRight: 0, // Definir o padding para telas maiores que 600px
              },
            }}
          >
            {/* Conteúdo aqui */}
            {children}
          </Container>
        </React.Fragment>
      ))}
    </div>
  );
}
