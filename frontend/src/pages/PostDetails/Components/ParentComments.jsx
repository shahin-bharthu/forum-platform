import React, { useState, useEffect, useCallback } from "react";
import { 
    Avatar, 
    Box, 
    Card, 
    CardActionArea, 
    CardActions, 
    CardContent, 
    CardHeader, 
    Collapse, 
    IconButton, 
    styled, 
    Typography, 
    CircularProgress 
} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from "axios";
import { formatDate } from "../../../../utils/timestamp";
import ChildrenComments from "./ChildrenComment";
import CommentInput from "./CommentInput";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
    ".MuiCardHeader-content": {
        display: "flex",    
        alignItems: "center",
        gap: theme.spacing(2),
    },
    ".MuiCardHeader-title": {
        margin: 0,
        fontWeight: 500
    },
    ".MuiCardHeader-subheader": {
        margin: 0,
    },
    ".MuiCardHeader-action": {
        margin: 0
    }
}));

const ViewRepliesButton = styled(CardActionArea)(({ theme }) => ({
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(0,0,0,0)',
    "&:hover , &:focus":{
        backgroundColor:'rgba(0,0,0,0)',
        textDecoration:'underline'
    },
    "& .MuiCardActionArea-focusHighlight": {
        display: 'none'
    }
}));

export default function ParentComments({ postId, refreshKey }) {
    const [comments, setComments] = useState([]);
    const [showReplies, setShowReplies] = useState({});
    const [replyInput, setReplyInput] = useState(null);
    const [likedComments, setLikedComments] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchParentComments = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const parentComments = await axios.get(`http://localhost:8080/comment/${postId}`, { 
                withCredentials: true 
            });
            const parentCommentsData = parentComments.data.data;

            const enrichedComments = await Promise.all(
                parentCommentsData.map(async (comment) => {
                    try {
                        const [avatarResponse, repliesResponse] = await Promise.all([
                            axios.get(`http://localhost:8080/user/avatar/${comment.user.id}`, {
                                withCredentials: true,
                                responseType: "blob",
                            }),
                            axios.get(`http://localhost:8080/comment/replies/${comment.id}`, {
                                withCredentials: true,
                            })
                        ]);

                        return {
                            ...comment,
                            avatarUrl: avatarResponse.data 
                                ? URL.createObjectURL(avatarResponse.data) 
                                : null,
                            hasReplies: repliesResponse.data.data.length > 0,
                            repliesCount: repliesResponse.data.data.length
                        };
                    } catch (error) {
                        console.error('Error fetching comment details', error);
                        return {
                            ...comment,
                            avatarUrl: null,
                            hasReplies: false,
                            repliesCount: 0
                        };
                    }
                })
            );

            setComments(enrichedComments);
        } catch (error) {
            console.error('Error fetching parent comments', error);
            setError('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchParentComments();
    }, [fetchParentComments, postId, refreshKey, refreshTrigger]);

    const handleToggleReplies = (commentId) => {
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const handleLike = (commentId) => {
        setLikedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const handleAddReply = (commentId) => {
        setReplyInput(prev => prev === commentId ? null : commentId);
    };

    const handleRefreshComments = () => {
        setRefreshTrigger(prev => !prev);
    };

    if (isLoading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '200px' 
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '200px',
                    color: 'error.main'
                }}
            >
                <Typography variant="h6">{error}</Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        cursor: 'pointer', 
                        mt: 1, 
                        textDecoration: 'underline' 
                    }}
                    onClick={fetchParentComments}
                >
                    Retry
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Card 
                        key={comment.id} 
                        sx={{ 
                            boxShadow: 0, 
                            mb: 2,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <StyledCardHeader
                            sx={{ pb: 1 }}
                            avatar={
                                <Avatar 
                                    aria-label="avatar" 
                                    src={comment.avatarUrl} 
                                    sx={{
                                        width: 30, 
                                        height: 30, 
                                        boxShadow: 2
                                    }} 
                                />
                            }
                            title={comment.user.username}
                            subheader={formatDate(comment.createdAt)}
                        />
                        <CardContent sx={{ py: 0 }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    mx: 4, 
                                    pl: 1.75, 
                                    textAlign: 'left', 
                                    wordBreak: "break-word" ,
                                    whiteSpace: "pre-wrap" 
                                }}
                            >
                                {comment.content}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ mx: 5.5 }}>
                            <IconButton onClick={() => handleLike(comment.id)}>
                                {!likedComments[comment.id] 
                                    ? <FavoriteBorderIcon fontSize="small" /> 
                                    : <FavoriteIcon color="error" fontSize="small" />
                                }
                            </IconButton>
                            <IconButton onClick={() => handleAddReply(comment.id)}>
                                <ChatBubbleOutlineIcon 
                                    fontSize="small" 
                                    sx={{ p: 0 }} 
                                />
                            </IconButton>
                        </CardActions>
                        {replyInput === comment.id && (
                            <CommentInput 
                                postId={postId} 
                                parentCommentId={comment.id} 
                                username={comment.user.username} 
                                onCommentadded={handleRefreshComments} 
                                onReplySend={() => setReplyInput(null)} 
                            />
                        )}
                        {comment.hasReplies && (
                            <>
                                <ViewRepliesButton
                                    disableRipple
                                    sx={{
                                        width: {
                                            xs: '64%',
                                            sm: '52%',
                                            md: '36%',
                                            lg: '27%',
                                            xl: '21.5%'
                                        },
                                        pl:8,
                                        py: 1,
                                        textAlign: 'left'
                                    }}
                                    onClick={() => handleToggleReplies(comment.id)}
                                >
                                    <Typography variant="body2">
                                        {showReplies[comment.id] 
                                            ? 'Hide replies' 
                                            : `View ${comment.repliesCount} ${comment.repliesCount === 1 ? 'reply' : 'replies'}`
                                        }
                                    </Typography>
                                </ViewRepliesButton>
                                <Collapse 
                                    in={showReplies[comment.id]} 
                                    timeout={200} 
                                    unmountOnExit
                                >
                                    <Box sx={{ pl: 2, pb: 2 }}>
                                        <ChildrenComments 
                                            parentId={comment.id} 
                                            childRefreshKey={refreshTrigger} 
                                        />
                                    </Box>
                                </Collapse>
                            </>
                        )}
                    </Card>
                ))
            ) : (
                <Box 
                    sx={{ 
                        m: 2, 
                        height: '30vh', 
                        pt: 5, 
                        textAlign: 'center' 
                    }}
                >
                    <Typography variant="h6" color="text.secondary">
                        No comments yet
                    </Typography>
                </Box>
            )}
        </>
    );
}
// import { Avatar, Box, Card, CardActionArea, CardActions, CardContent, CardHeader, IconButton, styled, Typography } from "@mui/material"
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { formatDate } from "../../../../utils/timestamp";
// import ChildrenComments from "./ChildrenComment";
// import CommentInput from "./CommentInput";

// const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
//     ".MuiCardHeader-content": {
//         display: "flex",    
//         alignItems: "center",
//         gap: theme.spacing(2),
//     },
//     ".MuiCardHeader-title": {
//         margin: 0,
//         fontWeight: 500
//     },
//     ".MuiCardHeader-subheader": {
//         margin: 0,
//     },
//     ".MuiCardHeader-action": {
//         margin: 0
//     }
// }));

// export default function ParentComments({ postId , refreshKey }) {
//     const [isLiked, setIsLiked] = useState(false)
//     const [comments, setComments] = useState([]);
//     const [showReplies, setShowReplies] = useState({});
//     const [replyInput, setReplyInput] = useState();
//     const [refreshpage,setRefreshpage]=useState(false)

//     const handleClick = (commentId) => {
//         setShowReplies(prev => ({
//             ...prev,
//             [commentId]: !prev[commentId]
//         }));
//     };

//     const handleLike = () => {
//         setIsLiked((prev) => !prev)
//     }

//     const handleRefresh=()=>{
//         setRefreshpage((prev)=>!prev)
//     }

//     const handleAddReply = (event, commentId) => {
//         setReplyInput(prev => prev === commentId ? null : commentId); 
//     };

//     const handleHideReplyInput = () => {
//         setReplyInput(null); 
//     }

//     useEffect(() => {
//         async function getParentComments(postId) {
//             const parentComments = await axios.get(`http://localhost:8080/comment/${postId}`, { withCredentials: true })
//             const parentCommentsData = parentComments.data.data;

//             const commentUserAvatars = await Promise.all(
//                 parentCommentsData.map(async (comment) => {
//                     try {
//                         const avatarResponse = await axios.get(
//                             `http://localhost:8080/user/avatar/${comment.user.id}`,
//                             {
//                                 withCredentials: true,
//                                 responseType: "blob",
//                             }
//                         )

//                         const replies = await axios.get(
//                             `http://localhost:8080/comment/replies/${comment.id}`,
//                             {
//                                 withCredentials: true,
//                             }
//                         )

//                         if (avatarResponse.data) {
//                             const avatarBlob = avatarResponse.data
//                             const repliesLength = replies.data.data.length;

//                             return {
//                                 hasReplies: repliesLength > 0,
//                                 commentId: comment.id,
//                                 avatarUrl: URL.createObjectURL(avatarBlob)
//                             }
//                         }
//                     }
//                     catch (error) {
//                         console.error('Error fetching avatar or replies', error)
//                         return {
//                             hasReplies: false,
//                             commentId: comment.id,
//                             avatarUrl: null
//                         }
//                     }
//                 })
//             )

//             const enrichedCommentsData = parentCommentsData.map(comment => {
//                 const commentInfo = commentUserAvatars.find(avatar => avatar.commentId == comment.id);
//                 return {
//                     ...comment,
//                     avatarUrl: commentInfo?.avatarUrl,
//                     hasReplies: commentInfo?.hasReplies
//                 };
//             });
            
//             setComments(enrichedCommentsData);
//         }

//         getParentComments(postId)
//     }, [postId, refreshKey, refreshpage]);
    
//     return (
//         <>
//             {comments.length > 0 ?
//                 comments.map((comment) =>
//                     <Card key={comment.id} sx={{ boxShadow: 0 }}>
//                         <StyledCardHeader
//                             sx={{ pb: 1 }}
//                             avatar={
//                                 <Avatar aria-label="avatar" src={comment.avatarUrl} sx={{width: 30, height: 30, boxShadow:2}}></Avatar>
//                             }
//                             title={comment.user.username}
//                             subheader={formatDate(comment.createdAt)}
//                         />
//                         <CardContent sx={{ py: 0 }}>
//                             <Typography variant="body2" sx={{ mx: 4, pl: 1.75, textAlign: 'left' , wordBreak: "break-word" }}>{comment.content}</Typography>
//                         </CardContent>
//                         <CardActions sx={{ mx: 5.5 }}>
//                             <IconButton onClick={handleLike} sx={{pb:0}}>
//                                 {!isLiked && <FavoriteBorderIcon fontSize="small" />}
//                                 {isLiked && <FavoriteIcon color="error" fontSize="small" />}
//                             </IconButton>
//                             <IconButton onClick={(event) => handleAddReply(event, comment.id)} sx={{pb:0}}>
//                                 <ChatBubbleOutlineIcon fontSize="small" />
//                             </IconButton>
//                         </CardActions>
//                             {replyInput === comment.id && <CommentInput postId={postId} parentCommentId={comment.id} username={comment.user.username} onCommentadded={handleRefresh} onReplySend={handleHideReplyInput}></CommentInput>}
//                         {comment.hasReplies ? <>
//                             <CardActionArea
//                                 disableRipple
//                                 sx={{
//                                     width: {
//                                         xs: '64%',
//                                         sm: '52%',
//                                         md: '36%',
//                                         lg: '27%',
//                                         xl: '21.5%'
//                                     },
//                                     boxShadow: 'none',
//                                     border: 'none',
//                                     cursor: 'pointer',
//                                     padding: 0,
//                                     outline: 'none',
//                                 }}
//                                 onClick={() => handleClick(comment.id)}
//                             >
//                                 {showReplies[comment.id] ? 'Hide replies' : 'View replies'}
//                             </CardActionArea>
//                             {showReplies[comment.id] && (
//                                 <ChildrenComments parentId={comment.id} childRefreshKey={refreshpage}/>
//                             )}
//                         </> : null }
//                     </Card>
//                 ) :
//                 <Box sx={{ m: 2, height: '30vh', pt: 5 }}>
//                     <Typography variant="subtitle">No comments yet</Typography>
//                     {/* <Typography variant="body2">Be the first one to comment</Typography> */}
//                 </Box>
//             }
//         </>
//     )
// } 