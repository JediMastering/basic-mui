import React from "react";
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemText, Container } from "@mui/material";
import { Link } from "react-router-dom";

const System = ({ children }) => {
    return (
        <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
            {/* Sidebar */}
            <Drawer
                sx={{
                    width: 240,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: 240,
                        boxSizing: "border-box",
                    },
                }}
                variant="permanent"
                anchor="left"
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
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: "background.default",
                    p: 3,
                    overflow: "auto",
                }}
            >
                {/* Header */}
                <AppBar position="sticky">
                    <Toolbar>
                        <Typography variant="h6">Sistema</Typography>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Container sx={{ mt: 4 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default System;
