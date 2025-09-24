import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import CarDetailsPage from './pages/CarDetailsPage';
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

          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/cardetails" element={<CarDetailsPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

