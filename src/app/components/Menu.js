'use client';
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Button, Box, CardActionArea } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import menuData from '../Data/menu.json';
import Link from 'next/link';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('Appetizers');
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const itemsPerRow = isXsScreen ? 1 : 4;
  const initialRowsToShow = 5;
  const initialItemsToShow = initialRowsToShow * itemsPerRow;

  const activeItems = menuData.MenuItems[activeCategory];
  const visibleItems = showAll ? activeItems : activeItems.slice(0, initialItemsToShow);

  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  const buttonStyle = {
    minWidth: 'auto',
    px: 1,
    whiteSpace: 'nowrap',
    backgroundColor: 'white',
    color: '#8B4513',
    border: '1px solid #8B4513',
    '&:hover': {
      backgroundColor: '#8B4513',
      color: 'white',
    },
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#8B4513',
    color: 'white',
  };

  return (
    <Container id="menu" maxWidth="md" className="p-9">
      <Typography variant="h2" align="center" gutterBottom>
        {menuData.Title}
      </Typography>
      <Typography variant="body1" align="center" paragraph className="font-normalText">
        {menuData.Description}
      </Typography>
      <div className="flex flex-col gap-12">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 0,
            overflowX: isXsScreen ? 'auto' : 'visible',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {Object.keys(menuData.MenuItems).map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              size="small"
              sx={activeCategory === category ? activeButtonStyle : buttonStyle}
            >
              <Typography variant="button" noWrap>
                {category}
              </Typography>
            </Button>
          ))}
        </Box>

        <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          {visibleItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <Link href={`/menus/${encodeURIComponent(item.Name)}`}>
                  <CardActionArea sx={{ width: '100%', maxWidth: 200, margin: 'auto' }}>
                    <CardMedia component="img" image={item.Image} alt={item.Name} sx={{ width: 200, height: 200 }} />
                    <CardContent>
                      <Typography variant="h6">{item.Name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.Price}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>

        {activeItems.length > initialItemsToShow && !showAll && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => setShowAll(true)}
              sx={buttonStyle}
            >
              Show More
            </Button>
          </Box>
        )}
      </div>
    </Container>
  );
}