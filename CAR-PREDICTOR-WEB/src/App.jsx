import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import { Container, Typography, Box, Paper } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to CarValue Predictor
          </Typography>
          <Typography variant="body1">
            Please log in or register to get a price prediction for your vehicle.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/login" />;
};





function App() {
  return (
    <Router>
      <Navbar />
      <main>
        { }
        <Routes>
          {/* Each <Route> defines a URL path and the component to render for it. */}

          {/* When the URL is exactly "/", show the HomePage component */}
          <Route path="/" element={<HomePage />} />

          {/* When the URL is "/login", show the LoginPage component */}
          <Route path="/login" element={<LoginPage />} />

          {/* When the URL is "/register", show the RegistrationPage component */}
          <Route path="/register" element={<RegistrationPage />} />

          {/* 5. This is the protected route for our dashboard. */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* This is a catch-all that redirects any unknown URL back to the home page. */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

