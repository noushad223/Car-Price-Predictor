import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Navbar = () => {
    const navigate = useNavigate();
    // We force a re-render on login/logout by using a state that changes,
    // or by simply reloading the page. For simplicity, we'll rely on navigation triggering updates.
    const isAuthenticated = !!localStorage.getItem('authToken');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        // Navigate to force a re-render of the navbar and protect routes
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <DirectionsCarIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        CarValue Predictor
                    </RouterLink>
                </Typography>
                <Box>
                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                            <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

