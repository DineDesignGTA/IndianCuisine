'use client'

import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Typography, 
  useMediaQuery 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import contactData from '../Data/contact.json';

const iconMap = {
  LocationOn: LocationOnIcon,
  AccessTime: AccessTimeIcon,
  Email: EmailIcon,
};

export default function Contact() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div id="contact">
      <Box sx={{ pt: 8, pb: 8 }}>
        <Container maxWidth="lg">
          {/* Contact Info Cards */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {contactData.contactCards.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Card elevation={3}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                      <Icon />
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h6" component="div" className='font-normalText'>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="">
                          {item.content}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Story Section */}
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src={contactData.storySection.imageSrc}
                alt={contactData.storySection.imageAlt}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 4 }, borderLeft: { md: '2px solid', borderColor: 'grey.300' } }}>
                <Typography variant="h4" gutterBottom className='font-normalText'>
                  {contactData.storySection.title}
                </Typography>
                <Typography variant="body1" paragraph className="">
                  {contactData.storySection.mainParagraph}
                </Typography>
                <Grid container spacing={2}>
                  {contactData.storySection.yearInfo.map((yearData, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Typography variant="h5" gutterBottom className='font-normalText'>
                        {yearData.year}
                      </Typography>
                      <Typography variant="body2" className="">
                        {yearData.description}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="h5" sx={{ mt: 4 }} className="font-cursive">
                  {contactData.storySection.signature}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}