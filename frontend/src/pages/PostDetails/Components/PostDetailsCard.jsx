import { Avatar, Box, Card, CardActions, CardContent, CardHeader, IconButton, Typography, styled, Skeleton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useState, useEffect, useCallback, useMemo } from "react";
import CommentInput from "./CommentInput";
import ParentComments from "./ParentComments";
import { formatDate } from "../../../../utils/timestamp";
import axiosInstance from "../../../../utils/axiosInstance.js";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    ".MuiCardHeader-content": {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(3),
    },
    ".MuiCardHeader-title, .MuiCardHeader-subheader, .MuiCardHeader-action": {
        margin: 0
    }
}));

export default function PostDetailsCard({ post, user, forum }) {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [userAvatarUrl, setUserAvatarUrl] = useState(null);
    const [isAvatarLoading, setIsAvatarLoading] = useState(true);
    const [refreshPage, setRefreshPage] = useState(false);

    const handleLike = useCallback(() => {
        setIsLiked(prev => !prev);
    }, []);

    const handleRefresh = useCallback(() => {
        setRefreshPage(prev => !prev);
    }, []);

    const fetchUserAvatar = useCallback(async (userId) => {
        setIsAvatarLoading(true);
        try {
            const response = await axiosInstance.get(`/user/avatar/${userId}`, {
                responseType: "blob",
            });

            if (response.data) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setUserAvatarUrl(reader.result);
                    setIsAvatarLoading(false);
                };
                reader.readAsDataURL(response.data);
            } else {
                setIsAvatarLoading(false);
            }
        } catch (error) {
            console.error('Failed to fetch user avatar:', error);
            setIsAvatarLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserAvatar(user.id);
    }, [user.id, fetchUserAvatar]);

    const avatarContent = useMemo(() => {
        if (isAvatarLoading) {
            return <Skeleton variant="circular" width={30} height={30} />;
        }
        return (
            <Avatar 
                aria-label="Forum Banner" 
                src={userAvatarUrl} 
                sx={{ width: 30, height: 30 }}
            />
        );
    }, [isAvatarLoading, userAvatarUrl]);

    return (
        <Box mb={2}>
            <Card>
                <StyledCardHeader
                    avatar={avatarContent}
                    action={
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                    }
                    title={user.username}
                    subheader={formatDate(post.createdAt)}
                />
                <CardContent sx={{ py: 0, px: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{ textAlign: "left", wordBreak: "break-word" }}
                    >
                        {post.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 3,
                            marginBottom: 2,
                            textAlign: "left",
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap"
                        }}
                    >
                        {post.content}
                    </Typography>
                </CardContent>
                <CardActions sx={{ mx: 1 }}>
                    <IconButton onClick={handleLike}>
                        {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <IconButton>
                        <ChatBubbleOutlineIcon />
                    </IconButton>
                </CardActions>
                {forum.isActive && (
                    <CommentInput 
                        postId={post.id} 
                        parentCommentId={null} 
                        onCommentadded={handleRefresh}
                    />
                )}
                <CardContent>
                    <Typography variant="h6" sx={{textAlign:'left', mx:1}}>
                        Comments
                    </Typography>
                    <ParentComments 
                        postId={post.id} 
                        refreshKey={refreshPage}
                    />
                </CardContent>
            </Card>
        </Box>
    );
}
