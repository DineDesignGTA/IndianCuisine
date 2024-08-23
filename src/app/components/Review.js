'use client'

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Grid } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import ReviewComponent from './ReviewComponent';

export default function Review() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        function fetchReviews() {
            fetch('/api/getReviews')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const transformedReviews = data.map(review => ({
                        name: review.author_name,
                        rating: review.rating,
                        comment: review.text,
                        avatar: review.profile_photo_url,
                        time: review.relative_time_description
                    }));
                    setReviews(transformedReviews);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('There was a problem with your fetch operation:', error);
                    setError('Failed to fetch reviews. Please try again later.');
                    setLoading(false);
                });
        }

        fetchReviews();
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : reviews.length - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex < reviews.length - 1 ? prevIndex + 1 : 0
        );
    };

    return (
        <Container maxWidth="md" className='p-5 pb-20' id="reviews">
            <Typography variant="h3" gutterBottom sx={{ mb: 4, fontWeight: 'bold', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                Customer Reviews
            </Typography>
            <Box>
                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : reviews.length > 0 ? (
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={1}>
                            <Button onClick={handlePrev} sx={{ minWidth: 0 }}>
                                <ArrowBackIos />
                            </Button>
                        </Grid>
                        <Grid item xs={10}>
                            <ReviewComponent
                                name={reviews[currentIndex].name}
                                rating={reviews[currentIndex].rating}
                                comment={reviews[currentIndex].comment}
                                avatar={reviews[currentIndex].avatar}
                                time={reviews[currentIndex].time}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button onClick={handleNext} sx={{ minWidth: 0 }}>
                                <ArrowForwardIos />
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>No reviews available at the moment.</Typography>
                )}
            </Box>
        </Container>
    );
}
