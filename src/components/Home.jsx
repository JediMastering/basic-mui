import React from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Home
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login1"
            >
                Quebrado
            </Button>
        </div>
    );
};

export default Home;
