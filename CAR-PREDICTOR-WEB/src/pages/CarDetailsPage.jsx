import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
    Container,
    Paper,
    TextField,
    Grid,
    Typography,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
} from '@mui/material';

export default function PricePredictorForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [predictionResult, setPredictionResult] = React.useState(null);
    const [apiError, setApiError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError('');
        setPredictionResult(null);

        const currentYear = new Date().getFullYear();
        const age = currentYear - parseInt(data.year, 10);

        if (isNaN(age) || age < 0) {
            setApiError('Please enter a valid year of manufacture.');
            setIsLoading(false);
            return;
        }

        const payload = {
            make: data.make,
            model: data.model,
            miles: parseInt(data.miles, 10),
            age: age,
            feul_type: data.fuel_type,
            transmission: data.transmission,
            body_type: data.body_type,
        };

        try {
            const apiUrl = 'http://127.0.0.1:8000/api/predict/';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'An unknown error occurred.');
            }

            setPredictionResult(result);

        } catch (error) {
            setApiError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
            <Paper
                variant='outlined'
                sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
                <Typography component='h1' variant='h4' align='center'>
                    Car Price Predictor
                </Typography>
                <Typography variant='body1' align='center' sx={{ mt: 1 }}>
                    Enter the details of the vehicle to get a price estimate.
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id='make'
                                label='Make (e.g., Ford)'
                                fullWidth
                                variant='standard'
                                {...register('make', { required: 'Make is required' })}
                                error={!!errors.make}
                                helperText={errors.make?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id='model'
                                label='Model (e.g., Focus)'
                                fullWidth
                                variant='standard'
                                {...register('model', { required: 'Model is required' })}
                                error={!!errors.model}
                                helperText={errors.model?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id='year'
                                label='Year of Manufacture'
                                type='number'
                                fullWidth
                                variant='standard'
                                {...register('year', {
                                    required: 'Year is required',
                                    min: { value: 1980, message: 'Year must be after 1980' },
                                    max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
                                })}
                                error={!!errors.year}
                                helperText={errors.year?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id='miles'
                                label='Miles'
                                type='number'
                                fullWidth
                                variant='standard'
                                {...register('miles', { required: 'Miles are required', min: { value: 0, message: 'Miles cannot be negative' } })}
                                error={!!errors.miles}
                                helperText={errors.miles?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant='standard' required>
                                <InputLabel id="fuel-type-label">Fuel Type</InputLabel>
                                <Select
                                    labelId="fuel-type-label"
                                    defaultValue=""
                                    {...register('fuel_type', { required: 'Fuel type is required' })}
                                    error={!!errors.fuel_type}
                                >
                                    <MenuItem value="Petrol">Petrol</MenuItem>
                                    <MenuItem value="Diesel">Diesel</MenuItem>
                                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                                    <MenuItem value="Electric">Electric</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant='standard' required>
                                <InputLabel id="transmission-label">Transmission</InputLabel>
                                <Select
                                    labelId="transmission-label"
                                    defaultValue=""
                                    {...register('transmission', { required: 'Transmission is required' })}
                                    error={!!errors.transmission}
                                >
                                    <MenuItem value="Manual">Manual</MenuItem>
                                    <MenuItem value="Automatic">Automatic</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant='standard' required>
                                <InputLabel id="body-type-label">Body Type</InputLabel>
                                <Select
                                    labelId="body-type-label"
                                    defaultValue=""
                                    {...register('body_type', { required: 'Body type is required' })}
                                    error={!!errors.body_type}
                                >
                                    <MenuItem value="Saloon">Saloon</MenuItem>
                                    <MenuItem value="Hatchback">Hatchback</MenuItem>
                                    <MenuItem value="SUV">SUV</MenuItem>
                                    <MenuItem value="Estate">Estate</MenuItem>
                                    <MenuItem value="Coupe">Coupe</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button
                            type='submit'
                            variant='contained'
                            disabled={isLoading}
                            sx={{ minWidth: 150, minHeight: 40 }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Predict Price'}
                        </Button>
                    </Box>
                </form>

                {/* Section to display results or errors */}
                <Box sx={{ mt: 4 }}>
                    {apiError && (
                        <Alert severity="error">{apiError}</Alert>
                    )}
                    {predictionResult && (
                        <Alert severity="success">
                            <Typography variant="h6">
                                Predicted Price: £{predictionResult.current_predicted_price?.toFixed(2)}
                            </Typography>
                            {/* You can also display the depreciation data here */}
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}