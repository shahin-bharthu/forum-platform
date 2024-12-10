import { Avatar, Box, Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, Link, styled, Typography } from "@mui/material"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "../../../../utils/timestamp";
import ChildrenComments from "./ChildrenComment";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    ".MuiCardHeader-content": {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(2),
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

export default function ParentComments({ postId , refreshKey }) {
    const [isLiked, setIsLiked] = useState(false)
    const [comments, setComments] = useState([]);
    const [showReplies, setShowReplies] = useState({});
    
    const handleClick = (commentId) => {
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const handleLike = () => {
        setIsLiked((prev) => !prev)
    }

    
    useEffect(() => {
        async function getParentComments(postId) {
            const parentComments = await axios.get(`http://localhost:8080/comment/${postId}`, {withCredentials: true})
            const parentCommentsData = parentComments.data.data;
            
            const commentUserAvatars = await Promise.all(
                parentCommentsData.map(async (comment) => {
                    try {                    
                        const avatarResponse = await axios.get(
                            `http://localhost:8080/user/avatar/${comment.user.id}`,
                            {
                                withCredentials: true,
                                responseType: "blob",
                            }
                        )

                        if (avatarResponse.data) {
                            const avatarBlob = avatarResponse.data                        
                            return {
                                commentId: comment.id,
                                avatarUrl: URL.createObjectURL(avatarBlob)
                            }
                        }
                    }
                    catch (error) {
                        console.error('Error fetching avatar', error)
                        return {
                            commentId: comment.id,
                            avatarUrl: null
                        }
                    }
                })
            )            
            
            const enrichedCommentsData = parentCommentsData.map(comment => {
                const commentInfo = commentUserAvatars.find(avatar => avatar.commentId == comment.id);
                return {
                    ...comment,
                    avatarUrl: commentInfo?.avatarUrl
                };
            });
            
            setComments(enrichedCommentsData);
        }

        getParentComments(postId)
    }, [postId,refreshKey ]);
    
    // console.log(comments);

    return (
        <>
        {comments.length>0 ? 
        comments.map((comment) => 
            <Card key={comment.id} sx={{ boxShadow: 0 }}>
            <StyledCardHeader
            sx={{ pb: 1 }}
            avatar={
                <Avatar aria-label="avatar" src={comment.avatarUrl}></Avatar>
            }
            title={comment.user.username}
            subheader={formatDate(comment.createdAt)}
            />
            <CardContent sx={{ py: 0 }}>
            <Typography variant="body2" sx={{ mx: 4, pl: 3, textAlign: 'left' }}>{comment.content}</Typography>
            </CardContent>
            <CardActions sx={{ mx: 1 }}>
            <IconButton onClick={handleLike}>
                {!isLiked && <FavoriteBorderIcon fontSize="small"/>}
                {isLiked && <FavoriteIcon color="error" fontSize="small"/>}
            </IconButton>
            <IconButton >
            <ChatBubbleOutlineIcon fontSize="small"/>
            </IconButton>
            <Link  color="inherit" underline="hover">Reply</Link>
            </CardActions>
            {showReplies[comment.id] && (
                            <ChildrenComments parentId={comment.id} />
                        )}
                        <CardActionArea
                            disableRipple
                            sx={{
                                width: {
                                    xs: '100%',
                                    sm: '80%',
                                    md: '60%',
                                    lg: '40%',
                                    xl: '20%'
                                },
                                py: 1,
                                mx: 2,
                                boxShadow: 'none',
                                border: 'none',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline',
                                    boxShadow: 'none',
                                    opacity: 1,
                                    '@media (hover: hover)': {
                                        backgroundColor: 'transparent',
                                    }
                                },
                                '&.Mui-focusVisible': {
                                    backgroundColor: 'transparent',
                                },
                                cursor: 'pointer',
                                padding: 0,
                                outline: 'none',
                            }}
                            onClick={() => handleClick(comment.id)}
                        >
                            {showReplies[comment.id] ? 'Hide replies' : 'View replies'}
                        </CardActionArea>
            </Card>
        ) :
        <Box sx={{m:2, height:'30vh', pt:5}}>
        <Typography variant="subtitle">No comments yet</Typography>
        <Typography variant="body2">Be the first one to comment</Typography>
        </Box>
    } 
    </>
    )
} 