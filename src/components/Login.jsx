import React from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Página Inicial
            </Typography>
            <Button variant="contained" color="primary" to="/" component={Link}>
                Voltar
            </Button>
        </div>
    );
};

export default Login;
