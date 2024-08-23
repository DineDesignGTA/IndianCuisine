'use client'
import React, { useState } from 'react';
import { Box, Button, MobileStepper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const images = [
  '/api/placeholder/800/400',
  '/api/placeholder/800/400',
  '/api/placeholder/800/400',
];

export default function Carousel() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <Box
        component="img"
        sx={{
          height: 255,
          display: 'block',
          maxWidth: 400,
          overflow: 'hidden',
          width: '100%',
        }}
        src={images[activeStep]}
        alt={`Slide ${activeStep + 1}`}
      />
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  )
}