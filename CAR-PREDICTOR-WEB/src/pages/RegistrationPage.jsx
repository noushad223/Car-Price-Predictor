
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.post('http://127.0.0.1:8000/api/register/', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            let errorMsg = 'Registration failed. Please try again.';
            if (err.response?.data) {
                const errors = Object.values(err.response.data).flat();
                errorMsg = errors.join(' ');
            }
            setError(errorMsg);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
                    <TextField
                        margin="normal" required fullWidth id="first_name" label="First Name" name="first_name"
                        value={formData.first_name} onChange={handleChange}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
                    />
                    <TextField
                        margin="normal" required fullWidth id="last_name" label="Last Name" name="last_name"
                        value={formData.last_name} onChange={handleChange}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
                    />
                    <TextField
                        margin="normal" required fullWidth id="username" label="Username" name="username"
                        value={formData.username} onChange={handleChange}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>) }}
                    />
                    <TextField
                        margin="normal" required fullWidth id="email" label="Email Address" name="email"
                        value={formData.email} onChange={handleChange}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
                    />
                    <TextField
                        margin="normal" required fullWidth name="password" label="Password" type="password" id="password"
                        value={formData.password} onChange={handleChange}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>) }}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                    <Typography variant="body2" align="center">
                        Already have an account?{' '}
                        <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                            Sign in
                        </RouterLink>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default RegistrationPage;