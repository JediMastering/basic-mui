import React from "react";
import { Grid2, Card, CardContent, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Grid2 container spacing={3}>
      <Grid2 xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Card 1</Typography>
            <Typography variant="body2" color="text.secondary">
              Informações sobre o card 1.
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Card 2</Typography>
            <Typography variant="body2" color="text.secondary">
              Informações sobre o card 2.
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Card 3</Typography>
            <Typography variant="body2" color="text.secondary">
              Informações sobre o card 3.
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default Dashboard;
