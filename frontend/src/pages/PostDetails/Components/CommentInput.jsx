import { useState, useCallback } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send as SendIcon, Cancel as CancelIcon } from '@mui/icons-material';
import axiosInstance from '../../../../utils/axiosInstance';
import { useDispatch } from 'react-redux';
import { clearNotification, setNotification } from '../../../store/slices/uiSlice';

const CommentInput = ({ postId, parentCommentId, username, onCommentadded, onReplySend }) => {
    const [comment, setComment] = useState('');

    const dispatch=useDispatch()
    const handleCommentChange = useCallback((event) => {
        setComment(event.target.value);
    }, []);

    const handleSendComment = useCallback(async () => {
        try {
            const commentData = {
                topic_id: postId,
                content: comment.trim(),
                parent_comment_id: parentCommentId
            };

            await axiosInstance.post('http://localhost:8080/comment', commentData);

            // Reset and trigger callbacks
            setComment('');
            onCommentadded?.();
            onReplySend?.();
        } catch (error) {
            console.error('Comment submission failed:', error);
            dispatch(setNotification({message:error.response?.data?.message || 'Failed to post comment. Please try again.', type:'error'}))
            setTimeout(() => {
                dispatch(clearNotification())
            }, 1500);
        }
    }, [postId, parentCommentId, comment, onCommentadded, onReplySend, dispatch]);

    const handleCancelComment = useCallback(() => {
        setComment('');
    }, []);
    return (
        <Box
            sx={parentCommentId ?
                {
                    mb: 2,
                    ml: 6,
                    mr: 1,
                    display: 'flex',
                    alignItems: 'center',
                    width: '92%'
                }
                :
                {
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
                autoFocus={parentCommentId}
                variant={parentCommentId ? "outlined" : "standard"}
                placeholder={parentCommentId ? `Replying to ${username}` : "Share your thoughts..."}
                value={comment}
                onChange={handleCommentChange}
                slotProps={{
                    input: {
                        disableUnderline: true,
                    }
                }}
                size={parentCommentId ? 'small' : ''}
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
