import React, { useState } from 'react';
import { Box, Typography, Rating, Avatar, Paper, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 5px 15px 2px rgba(0, 0, 0, .08)',
    },
}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
}));

export default function ReviewComponent({ name, rating, comment, avatar, time }) {
    const [expanded, setExpanded] = useState(false);

    const handleToggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <StyledPaper elevation={1}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <AvatarStyled alt={name} src={avatar} />
                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>{name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Rating value={rating} readOnly precision={0.5} />
                        <Typography variant="body2" color="text.secondary">
                            {time}
                        </Typography>
                    </Stack>
                    <Typography variant="body1" color="text.secondary" sx={{
                        overflow: expanded ? 'visible' : 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: expanded ? 'none' : 3,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {comment}
                    </Typography>
                    <Button size="small" onClick={handleToggleExpand}>
                        {expanded ? 'Show Less' : 'See More'}
                    </Button>
                </Box>
            </Stack>
        </StyledPaper>
    );
}
