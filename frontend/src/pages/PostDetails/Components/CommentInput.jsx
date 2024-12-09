import { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send as SendIcon, Cancel as CancelIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CommentInput = ({postId}) => {

    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSendComment = async () => {
        if (comment) {
            const commentData = {
                topic_id: postId, content: comment, parent_comment_id: null
            }
            const sendCommentResposne = await axios.post(`http://localhost:8080/comment`, 
                                               commentData, 
                                               {
                                                "Content-Type": "application/json", 
                                                withCredentials: true
                                               }
                                            );
            setComment('');
            
        }
    };

    const handleCancelComment = () => {
        setComment(''); // Clear the text field
    };

    return (
        <Box
            sx={{
                my: 2,
                mx: 3,
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '8px',
                gap: '8px',
                backgroundColor: '#f9f9f9',
            }}
        >

            <TextField
                fullWidth
                multiline
                variant="standard"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={handleCommentChange}
                slotProps={{
                    input: {
                        disableUnderline: true,
                    }
                }}
                sx={{
                    flex: 1,
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    padding: '8px 12px',
                }}
            />

            {/* Cancel Button */}
            {comment.trim() &&
                <IconButton aria-label="cancel" size="small" onClick={handleCancelComment}>
                    <CancelIcon fontSize="small" />
                </IconButton>
            }

            {/* Comment Button */}
            <IconButton
                aria-label="comment"
                size="small"
                color="primary"
                onClick={handleSendComment}
                disabled={!comment.trim()}
            >
                <SendIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

export default CommentInput;
