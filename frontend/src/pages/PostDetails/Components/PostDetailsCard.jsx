import { Avatar, Box, Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, Link, styled, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useState } from "react";
import CommentInput from "./CommentInput";
import ParentComments from "./ParentComments";

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

export default function PostDetailsCard() {
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
                        <Link href={`/forum/533b80d0-8c21-4f19-a2a8-24b9405ecbbd`} color="inherit" underline="hover">
                            <Avatar aria-label="Forum Banner" src='https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649' />
                        </Link>
                    }
                    action={
                        <>
                            <IconButton onClick={() => navigate(-1)}>
                                <ArrowBackIcon />
                            </IconButton>
                        </>
                    }
                    title={<Link href={`/forum/533b80d0-8c21-4f19-a2a8-24b9405ecbbd`} color="inherit" underline="hover">idk where tho honestly</Link>}
                    // subheader={formatDate(topic.createdAt)}
                    subheader='2m'
                />
                <CardContent sx={{ py: 0, px: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{ textAlign: "left", wordBreak: "break-word" }}
                    >
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta labore odit sit praesentium molestias quidem recusandae aliquid soluta fugiat ad.
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
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste, numquam et expedita autem eligendi nobis architecto officia molestiae dolores cum iure qui harum odit ipsam magnam commodi aliquid, odio eius saepe itaque exercitationem maxime? Quasi omnis repellendus libero maiores animi quae nulla veniam est, laborum aspernatur ad veritatis reiciendis tempore.
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
                <CommentInput />
                <CardContent>
                    <Typography variant="h6" sx={{textAlign:'left', mx:1}}>Comments</Typography>
                    <ParentComments/>
                </CardContent>
            </Card>
        </Box>
    )
}