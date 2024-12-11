import { Avatar, Box, Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, Link, styled, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useState, useEffect } from "react";
import CommentInput from "./CommentInput";
import ParentComments from "./ParentComments";
import { formatDate } from "../../../../utils/timestamp";
import axios from "axios";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    ".MuiCardHeader-content": {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(3),
    },
    ".MuiCardHeader-title": {
        margin: 0,
    },
    ".MuiCardHeader-subheader": {
        margin: 0,
    },
    ".MuiCardHeader-action": {
        margin: 0
    }
}));

export default function PostDetailsCard({post, user, forum}) {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [userAvatarUrl, setUserAvatarUrl] = useState();

    const handleLike = () => {
        setIsLiked((prev) => !prev)
    };

    const handleFileRead = async (id) => {
        const file = await axios.get(`http://localhost:8080/user/avatar/${id}`, {
          withCredentials: true,
          responseType: "blob",
        });
    
        if (file.data) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUserAvatarUrl(reader.result);
          };
          reader.readAsDataURL(file.data);
        }
    };

    useEffect(() => {
        const fetchAvatar = async (id) => {
            const data = await handleFileRead(id);
          };
      
        fetchAvatar(user.id).catch(console.error);
    }, []);

    return (
        <Box mb={2}>
            <Card>
                <StyledCardHeader
                    avatar={
                        <Avatar aria-label="Forum Banner" src={userAvatarUrl} sx={{width: 30, height: 30}}/>
                    }
                    action={
                        <>
                            <IconButton onClick={() => navigate(-1)}>
                                <ArrowBackIcon />
                            </IconButton>
                        </>
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
                        {!isLiked && <FavoriteBorderIcon />}
                        {isLiked && <FavoriteIcon color="error" />}
                    </IconButton>
                    <IconButton >
                        <ChatBubbleOutlineIcon />
                    </IconButton>
                </CardActions>
                {forum.isActive ? <CommentInput postId={post.id} parentCommentId={null}/> : null}
                <CardContent>
                    <Typography variant="h6" sx={{textAlign:'left', mx:1}}>Comments</Typography>
                    <ParentComments postId={post.id}/>
                </CardContent>
            </Card>
        </Box>
    )
}