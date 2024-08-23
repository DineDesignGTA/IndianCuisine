'use client';

import { notFound } from 'next/navigation';
import { Typography, Card, CardMedia, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { LocalFireDepartment, Restaurant, People } from '@mui/icons-material';
import menuData from '../../Data/menu.json';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MenuItem({ params }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true
    };

    if (!params) {
        return <div>Loading...</div>;
    }

    const { itemName } = params;

    const item = Object.values(menuData.MenuItems).flat().find(
        menuItem => menuItem.Name === decodeURIComponent(itemName)
    );

    if (!item) {
        notFound();
    }

    // Mock reviews data
    const reviews = [
        { id: 1, author: "John Doe", content: "This dish was absolutely delicious! The flavors were perfectly balanced.", rating: 5 },
        { id: 2, author: "Jane Smith", content: "I loved the presentation and taste. Will definitely order again.", rating: 4 },
        { id: 3, author: "Mike Johnson", content: "Good portion size and great value for money.", rating: 4 },
    ];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen p-4 lg:p-8 bg-gray-100">
            {/* Left section (2/3 on desktop) */}
            <div className="w-full lg:w-2/3 lg:pr-8 mb-8 lg:mb-0">
                <Card className="h-full flex flex-col">
                    <CardMedia
                        component="img"
                        className="h-64 lg:h-96 object-cover"
                        image={item.Image}
                        alt={item.Name}
                    />
                    <CardContent className="flex-grow flex flex-col">
                        <Typography variant="h4" className="mb-2">{item.Name}</Typography>
                        <Typography variant="h6" color="text.secondary" className="mb-4">${item.Price}</Typography>
                        <Typography variant="h5" className="mb-4">Reviews</Typography>
                        <div className="flex-grow bg-gray-200 rounded-lg p-4">
                            <div className="slider-container">
                                <Slider {...settings}>
                                    {reviews.map((review) => (
                                        <div key={review.id} className="px-4">
                                            <Card className="h-full">
                                                <CardContent>
                                                    <Typography variant="h6">Reviews coming soon</Typography>
                                                    {/* <Typography variant="h6">{review.author}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Rating: {review.rating}/5
                                                    </Typography>
                                                    <Typography variant="body1" className="mt-2">
                                                        {review.content}
                                                    </Typography> */}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right section (1/3 on desktop) */}
            <div className="w-full lg:w-1/3">
                <Card className="h-full">
                    <CardContent>
                        <Typography variant="h4" className="mb-4 ">{item.Name}</Typography>
                        <Typography variant="body1" paragraph className='font-normalText'>

                            {item['Item Description']}

                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon><LocalFireDepartment color="error" /></ListItemIcon>
                                <ListItemText primary="Spice Level" secondary={item['Spice Level']} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Restaurant color="primary" /></ListItemIcon>
                                <ListItemText primary="Flavor Profile" secondary={item['Flavour Profile']} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><People color="action" /></ListItemIcon>
                                <ListItemText primary="Serving Size" secondary={item['Serving Size']} />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}