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

import { Container } from "@mui/material";

import { Link } from "react-router-dom";

const blueGreyColor = blueGrey[800];

export default function SwipeableTemporaryDrawer({children}) {
  const [state, setState] = React.useState({ left: false });

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

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
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
      </List>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <AppBar
            sx={{ backgroundColor: blueGreyColor }}
            position="fixed" >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer(anchor, true)}
                edge="start"
                sx={[
                  {
                    m: 2,
                  },

                ]}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
          <Container sx={{ mt: 4 }}>
            {children}
          </Container>
        </React.Fragment>
      ))}
    </div>
  );
}