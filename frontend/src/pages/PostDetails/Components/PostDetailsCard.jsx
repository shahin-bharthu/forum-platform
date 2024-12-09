import { Avatar, Box, Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, Link, styled, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useState } from "react";
import CommentInput from "./CommentInput";
import ParentComments from "./ParentComments";
import { formatDate } from "../../../../utils/timestamp";

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

export default function PostDetailsCard({post, user}) {
    const navigate = useNavigate()
    const [isLiked, setIsLiked] = useState(false)

    const handleLike = () => {
        setIsLiked((prev) => !prev)
    }

    return (
        <Box mb={2}>
            <Card>
                <StyledCardHeader
                    avatar={
                        <Avatar aria-label="Forum Banner" src='https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649' />
                    }
                    action={
                        <>
                            <IconButton onClick={() => navigate(-1)}>
                                <ArrowBackIcon />
                            </IconButton>
                        </>
                    }
                    title={user.username}
                    // subheader={formatDate(topic.createdAt)}
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
                <CommentInput postId={post.id}/>
                <CardContent>
                    <Typography variant="h6" sx={{textAlign:'left', mx:1}}>Comments</Typography>
                    <ParentComments postId={post.id}/>
                </CardContent>
            </Card>
        </Box>
    )
}