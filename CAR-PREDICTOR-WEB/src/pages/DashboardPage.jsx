import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const DashboardPage = () => {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Dashboard
                    </Typography>
                    <Typography variant="body1">
                        Welcome! You are successfully logged in. This is your protected dashboard where the car price prediction tool will live.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default DashboardPage;

