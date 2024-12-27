import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, styled, Typography, CircularProgress, Box } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect, useCallback } from "react";
import { formatDate } from "../../../../utils/timestamp";
import axiosInstance from "../../../../utils/axiosInstance.js";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    ".MuiCardHeader-content": {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(2),
    },
    ".MuiCardHeader-title, .MuiCardHeader-subheader": {
        margin: 0,
    },
    ".MuiCardHeader-action": {
        margin: 0
    }
}));

export default function ChildrenComments({ parentId, childRefreshKey }) {
    const [replies, setReplies] = useState([]);
    const [likedReplies, setLikedReplies] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReplies = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const commentReplies = await axiosInstance.get(`/comment/replies/${parentId}`);
            const repliesData = commentReplies.data.data;

            const enrichedReplies = await Promise.all(
                repliesData.map(async (reply) => {
                    try {
                        const avatarResponse = await axiosInstance.get(
                            `/user/avatar/${reply.user.id}`,
                            {
                                responseType: "blob",
                            }
                        );

                        return {
                            ...reply,
                            avatarUrl: avatarResponse.data 
                                ? URL.createObjectURL(avatarResponse.data) 
                                : null
                        };
                    } catch (error) {
                        console.error('Error fetching avatar', error);
                        return {
                            ...reply,
                            avatarUrl: null
                        };
                    }
                })
            );

            setReplies(enrichedReplies);
        } catch (error) {
            console.error('Error fetching replies', error);
            setError('Failed to load replies');
        } finally {
            setIsLoading(false);
        }
    }, [parentId]);

    useEffect(() => {
        setTimeout(() => {
            fetchReplies();
        }, 250);
    }, [fetchReplies, parentId, childRefreshKey]);

    const handleLike = (replyId) => {
        setLikedReplies(prev => ({
            ...prev,
            [replyId]: !prev[replyId]
        }));
    };

    if (isLoading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%', 
                    py: 2 
                }}
            >
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%', 
                    py: 2,
                    color: 'error.main'
                }}
            >
                <Typography variant="body2">{error}</Typography>
            </Box>
        );
    }

    if (replies.length === 0) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    width: '100%', 
                    py: 2 
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    No replies yet
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {replies.map((reply) => (
                <Card 
                    key={reply.id} 
                    sx={{
                        boxShadow: 0,
                        width: {
                            xs: '85%',
                            sm: '87%',
                            md: '91%',
                            lg: '93%',
                            xl: '95%'
                        },
                        justifySelf: 'right'
                    }}
                >
                    <StyledCardHeader
                        sx={{ pb: 1, pl:0.25 }}
                        avatar={
                            <Avatar 
                                aria-label="avatar" 
                                src={reply.avatarUrl} 
                                sx={{
                                    width: 30, 
                                    height: 30, 
                                    boxShadow: 2
                                }} 
                            />
                        } 
                        title={reply.user.username}
                        subheader={formatDate(reply.createdAt)}
                    />
                    <CardContent sx={{ py: 0 }}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                mx: 2.5, 
                                pl: 1.5, 
                                textAlign: 'left' ,
                                wordBreak: "break-word" ,
                                whiteSpace: "pre-wrap" 
                            }}
                        >
                            {reply.content}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ mx: 1 }}>
                        <IconButton onClick={() => handleLike(reply.id)} sx={{ mx: 3 }}>
                            {!likedReplies[reply.id] 
                                ? <FavoriteBorderIcon fontSize="small" />
                                : <FavoriteIcon color="error" fontSize="small" />
                            }
                        </IconButton>
                    </CardActions>
                </Card>
            ))}
        </>
    );
}