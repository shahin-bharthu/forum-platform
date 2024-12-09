import { Avatar, Box, Card, CardActions, CardContent, CardHeader, IconButton, styled, Typography } from "@mui/material"
import { blue } from "@mui/material/colors";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "../../../../utils/timestamp";

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

export default function ChildrenComments({ parentId }) {
    const [isLiked, setIsLiked] = useState(false)
    const [replies, setReplies] = useState([]);

    const handleLike = () => {
        setIsLiked((prev) => !prev)
    }

    useEffect(() => {
        async function getReplies(parentId) {
            const replies = await axios.get(`http://localhost:8080/comment/replies/${parentId}`, { withCredentials: true })
            setReplies(replies.data.data);
        }

        getReplies(parentId)
    }, []);

    return (
        <>
            {replies.length > 0 ? replies.map((reply) =>

                <Card key={reply.id} sx={{
                    boxShadow: 0,
                    width: {
                        xs:'80%',
                        sm:'85%',
                        md:'90%'
                    },
                    justifySelf: 'right'
                }}>
                    <StyledCardHeader
                        sx={{ pb: 1 }}
                        avatar={
                            <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                                C
                            </Avatar>
                        }
                        title={reply.user.username}
                        subheader={formatDate(reply.createdAt)}
                    />
                    <CardContent sx={{ py: 0 }}>
                        <Typography variant="body2" sx={{ mx: 4, pl: 3, textAlign: 'left' }}>
                            {reply.content}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ mx: 1 }}>
                        <IconButton onClick={handleLike}>
                            {!isLiked && <FavoriteBorderIcon fontSize="small" />}
                            {isLiked && <FavoriteIcon color="error" fontSize="small" />}
                        </IconButton>
                        <IconButton >
                            <ChatBubbleOutlineIcon fontSize="small" />
                        </IconButton>
                    </CardActions>
                </Card >

            ) : null
            }
        </>
    )
} 