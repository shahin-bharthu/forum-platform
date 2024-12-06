import { Avatar, Card, CardActions, CardContent, CardHeader, IconButton, styled, Typography } from "@mui/material"
import { red } from "@mui/material/colors";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useState } from "react";

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
export default function ParentComments() {
    const [isLiked, setIsLiked] = useState(false)

    const handleLike = () => {
        setIsLiked((prev) => !prev)
    }
    return (
        <Card sx={{ boxShadow: 0 }}>
            <StyledCardHeader
                sx={{ pb: 1 }}
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
                    </Avatar>
                }
                // action={
                //     <IconButton aria-label="settings">
                //         <MoreVertIcon />
                //     </IconButton>
                // }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
            />
            <CardContent sx={{ py: 0 }}>
                <Typography variant="body2" sx={{ mx: 4, pl: 3, textAlign: 'left' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta tempora maxime quasi facilis animi similique in consequuntur distinctio provident autem?</Typography>
            </CardContent>
            <CardActions sx={{ mx: 1 }}>
                <IconButton onClick={handleLike}>
                    {!isLiked && <FavoriteBorderIcon fontSize="small"/>}
                    {isLiked && <FavoriteIcon color="error" fontSize="small"/>}
                </IconButton>
                <IconButton >
                    <ChatBubbleOutlineIcon fontSize="small"/>
                </IconButton>
            </CardActions>
        </Card>
    )
} 